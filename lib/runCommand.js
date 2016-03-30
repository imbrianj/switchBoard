/**
 * Copyright (c) 2014 brian@bevey.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * @author brian@bevey.org
 * @fileoverview Handles command validation, parsing of macros and command
 *               generation before hand-off to specific controllers.
 * @requires url
 */

module.exports = (function () {
  'use strict';

  var Controllers = {};

  return {
    version : 20151208,

    /**
     * As we want to keep controllers private, but we also want to make them
     * available for events to fire against, we'll add each controller to a
     * private object here, so we can use it later.
     */
    init : function (controllers) {
      Controllers = controllers;
    },

    /**
     * Commands can come in via GET or POST - and can be macros, text, etc.
     * Here, we'll split it all apart for the parser.
     */
    findCommands : function (request, response, endResponse) {
      var url        = require('url'),
          sharedUtil = require(__dirname + '/../lib/sharedUtil').util,
          that       = this,
          query      = {},
          device;

      if(request.method === 'POST') {
        request.on('data', function (data) {
          var queryParts = sharedUtil.sanitize(data.toString()).split('='),
              device     = 'fail',
              command    = 'fail';

          if(queryParts.length === 2) {
            device  = queryParts[0];
            command = queryParts[1].split(',').join('').split(';').join('').substring(0, 100);
          }

          query[device] = sharedUtil.sanitize(command);
        });

        request.on('end', function () {
          var device;

          for(device in query) {
            that.parseCommands(device, query[device], 'single', request, response);
          }
        });
      }

      else {
        query = url.parse(sharedUtil.sanitize(request.url), true).query;

        for(device in query) {
          if(query.type) {
            query[device] = query.type + '-' + query[device];
            delete query.type;
          }

          this.parseCommands(device, query[device], 'single', request, response, endResponse);
        }
      }
    },

    /**
     * Take in the command components and determine their type, if it's a macro,
     * and filter out timestamp cache-busters for XHR calls.  Take all the good
     * bits and send it to runCommand to execute.
     */
    parseCommands : function (device, command, source, request, response, endResponse) {
      var reply = '',
          rawMacro,
          macro;

      source = source || 'single';

      if(!command) {
        console.log('\x1b[31mNo command received\x1b[0m');

        if(endResponse) {
          response.end('{"device":"' + device + '","command":"undefined","status":"err"}');
        }
      }

      else if(command.indexOf(';') !== -1) {
        console.log('\x1b[35mMulti-device macro command issued\x1b[0m');

        if(endResponse) {
          response.end('{"device":"multi-device macro","status":"received"}');
        }

        rawMacro = command.split(';');
        rawMacro[0] = device + '=' + rawMacro[0];

        for(macro in rawMacro) {
          reply = this.macroCommands(rawMacro[macro], request);
        }
      }

      else if(command.indexOf(',') !== -1) {
        console.log('\x1b[35mMacro command issued\x1b[0m');

        if(endResponse) {
          response.end('{"device":"macro","status":"received"}');
        }

        reply = this.macroCommands(device + '=' + command, request);
      }

      else if(device !== 'ts') {
        if(source === 'single') {
          console.log('\x1b[35mSingle command issued\x1b[0m');
        }

        reply = this.runCommand(device, command, source, request, response, null, endResponse);
      }

      return reply;
    },

    /**
     * Accepts a big macro command, splits it up and begins the macro loop.
     */
    macroCommands : function (commands, request) {
      var commandParts = commands.split('='),
          device       = commandParts[0],
          runMacro     = false,
          parsedCommands;

      if(commandParts[1]) {
        parsedCommands = commandParts[1].split(',');

        runMacro = this.runMacro(device, parsedCommands, request, [], 0);
      }

      return runMacro;
    },

    /**
     * Recursively goes through each command in the macro, executing them in
     * sequence.  If you pass "SLEEP", it will obey the timeout, but not
     * execute anything.
     */
    runMacro : function (device, commands, request, reply, i) {
      var tempCommand = commands[i],
          controllers = Controllers;

      if(tempCommand) {
        if(tempCommand.toUpperCase() === 'SLEEP') {
          console.log('\x1b[35mSleep command issued\x1b[0m');
        }

        else {
          reply[reply.length] = this.parseCommands(device, tempCommand, 'macro', request, request);
        }

        setTimeout(function () {
          var runCommand = require(__dirname + '/runCommand');

          runCommand.runMacro(device, commands, request, reply, i + 1);
        }, controllers.config.macroPause);
      }

      else {
        return reply;
      }
    },

    /**
     * Since we now know the command type, we can just remove the prefix so we
     * can pass the actual command onto the controller to be executed.
     */
    stripTypePrefix : function (command, commandType) {
      switch(commandType) {
        case 'text' :
          command = command.replace('text-', '');
        break;

        case 'subdevice' :
          command = command.replace('subdevice-', '');
        break;

        case 'launch' :
          command = command.replace('launch-', '');
        break;

        case 'list'  :
        case 'poll'  :
        case 'state' :
          command = true;
        break;
      }

      return command;
    },

    /**
     * Each (valid) command is prefixed with it's type.  Here, we use that to
     * register it's type.
     */
    getCommandType : function (device, command) {
      var type = 'command';

      if(!command) {
        type = '';
      }

      else if(command.indexOf('text-') === 0) {
        type = 'text';
      }

      else if(command.indexOf('subdevice-') === 0) {
        type = 'subdevice';
      }

      else if(command.indexOf('launch-') === 0) {
        type = 'launch';
      }

      else if(command.toUpperCase() === 'LIST') {
        type = 'list';
      }

      else if(command.toUpperCase() === 'POLL') {
        type = 'poll';
      }

      else if(command.toUpperCase() === 'STATE') {
        type = 'state';
      }

      return type;
    },

    /**
     * Each controller contains a "keymap" and "inputs" array of expected
     * inputs.  We'll reference that to ensure that the command we're sending
     * isn't totally unexpected.  This is more of a quick sanity check than any
     * real security.
     */
    validateCommand : function (device, command) {
      var commandType  = this.getCommandType(device, command),
          controller   = Controllers[device],
          commandValid = false;

      if((controller !== undefined) && (controller.controller.inputs.indexOf(commandType) !== -1)) {
        // Standard commands need to be registered in each device keymap.
        if((commandType === 'command') && (controller.controller.keymap.indexOf(command.toUpperCase()) !== -1)) {
          commandValid = true;
        }

        // If I cared about security, I could flag insecure text inputs.
        else if(commandType === 'text') {
          commandValid = true;
        }

        // If I cared about security, I could flag insecure text inputs.
        else if(commandType === 'subdevice') {
          commandValid = true;
        }

        // Launch is (currently) limited to numerical values.
        else if((commandType === 'launch') && !isNaN(command.replace('launch-', ''))) {
          commandValid = true;
        }

        else if((commandType === 'list') && (command.toUpperCase() === 'LIST')) {
          commandValid = true;
        }

        else if((commandType === 'poll') && (command.toUpperCase() === 'POLL')) {
          commandValid = true;
        }

        else if((commandType === 'state') && (command.toUpperCase() === 'STATE')) {
          commandValid = true;
        }
      }

      return commandValid;
    },

    /**
     * Takes a given command and sends it to the appropriate controller, along
     * with a callback that will generically set the device state if the
     * command is successfully executed.
     */
    runCommand : function (device, command, source, request, response, callback, endResponse) {
      var apps        = require(__dirname + '/../lib/apps'),
          message     = 'invalid',
          commandType = this.getCommandType(device, command),
          controllers = Controllers,
          controller  = controllers[device],
          config     = {};

      if((commandType !== 'text') && (commandType !== 'subdevice') && (commandType !== 'launch')) {
        command = command.toUpperCase();
      }

      callback = callback || function () {};

      if(device !== 'ts') {
        if(this.validateCommand(device, command, controllers)) {
          message = 'valid';

          if(command === 'POLL') {
            apps.poll(device, controllers);
          }

          else {
            config.callback = function (err, reply, ignoreState, appParams) {
              var deviceState = require(__dirname + '/deviceState'),
                  errorMsg    = err,
                  state       = err ? 'err' : 'ok';

              callback(err, reply);

              if(err) {
                if((err.code === 'ECONNRESET') || (err.code === 'ECONNREFUSED') || (err.code === 'EHOSTUNREACH') || (err.code === 'ETIMEDOUT')) {
                  errorMsg = 'Device is off or unreachable';
                }

                else if(err.code === 'ENOENT') {
                  errorMsg = 'System command could not be found';
                }

                else if(err.code){
                  errorMsg = err.code;
                }

                if(err !== 'ignore') {
                  console.log('\x1b[31m' + controller.config.title + '\x1b[0m: ' + errorMsg);
                }

                if(!ignoreState) {
                  deviceState.updateState(device, controller.config.typeClass, { state : state });
                }

                if(endResponse) {
                  response.end('{"device":"' + device + '","command":"' + command + '","status":"ok"}');
                }
              }

              if(reply) {
                console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Command executed');

                if(!ignoreState) {
                  deviceState.updateState(device, controller.config.typeClass, { state : state, value : reply });
                }

                if(endResponse) {
                  response.end('{"device":"' + device + '","command":"' + command + '","status":"ok"}');
                }
              }

              apps.execute(device, command, { state : state, value : reply }, controllers, appParams);
            };

            config.config       = controllers.config;
            config.device       = controller.config;
            config.source       = source;
            config.issuer       = request ? request.connection.remoteAddress : 'localhost';
            config[commandType] = this.stripTypePrefix(command, commandType);

            if((command === 'STATE') && (typeof controller.controller.state === 'function')) {
              callback = function (deviceId, err, reply, params, appParams) {
                var deviceState = require(__dirname + '/../lib/deviceState'),
                    message     = 'err',
                    errorMsg    = err;

                params = params || {};

                if(err) {
                  if((err.code === 'ECONNRESET') || (err.code === 'ECONNREFUSED') || (err.code === 'EHOSTUNREACH') || (err.code === 'ETIMEDOUT')) {
                    errorMsg = 'Device is off or unreachable';
                  }

                  else if(err.code){
                    errorMsg = err.code;
                  }

                  console.log('\x1b[31m' + controller.config.title + '\x1b[0m: ' + errorMsg);
                }

                else {
                  console.log('\x1b[32m' + controller.config.title + '\x1b[0m: State executed');

                  message = 'ok';
                }

                params.state = message;

                deviceState.updateState(deviceId, controller.config.typeClass, params);

                apps.execute(device, command, { state : message, value : reply }, controllers, appParams);
              };

              controller.controller.state(controller, controllers.config, callback);
            }

            else {
              controller.controller.send(config);
            }

            if(response) {
              console.log('\x1b[32m' + controllers[device].config.title + '\x1b[0m: Command ' + command + ' looks valid');
            }
          }
        }

        else if(controller) {
          console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Command looks invalid!');
        }

        else if(endResponse) {
          response.end('{"device":"unknown","status":"err"}');
        }

        else {
          console.log('\x1b[31mCannot run command: Device unknown\x1b[0m');
        }

        return { 'device' : device, 'command' : command, 'message' : message };
      }
    }
  };
}());
