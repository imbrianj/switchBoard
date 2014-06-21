/*jslint white: true */
/*global State, module, setTimeout, require, console */

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

  return {
    version : 20140327,

    findCommands : function (request, controllers, response) {
      var url        = require('url'),
          runCommand = require('./runCommand'),
          query      = {},
          device;

      if(request.method === 'POST') {
        request.on('data', function(data) {
          var queryParts = data.toString().split('='),
              device     = 'fail',
              command    = 'fail';

          if(queryParts.length === 2) {
            device  = queryParts[0];
            command = 'text-' + queryParts[1].split(',').join('').split(';').join('').substring(0, 100);
          }

          query[device] = command;
        });

        request.on('end', function() {
          var device;

          for(device in query) {
            runCommand.parseCommands(device, query[device], controllers, 'single', response);
          }
        });
      }

      else {
        query = url.parse(request.url, true).query;

        for(device in query) {
          runCommand.parseCommands(device, query[device], controllers, 'single', response);
        }
      }
    },

    parseCommands : function (device, command, controllers, source, response) {
      var reply = '',
          rawMacro,
          macro;

      source = source || 'single';

      if(!command) {
        console.log('No command received');

        response.end('{"device":"' + device + '","command":"undefined","status":"err"}');
      }

      else if(command.indexOf(';') !== -1) {
        console.log('Multi-device macro command issued');

        response.end('{"device":"multi-device macro","status":"received"}');

        rawMacro = command.split(';');
        rawMacro[0] = device + '=' + rawMacro[0];

        for(macro in rawMacro) {
          reply = this.macroCommands(rawMacro[macro], controllers);
        }
      }

      else if(command.indexOf(',') !== -1) {
        console.log('Macro command issued');

        response.end('{"device":"macro","status":"received"}');

        reply = this.macroCommands(device + '=' + command, controllers);
      }

      else if(device !== 'ts') {
        if(source === 'single') {
          console.log('Single command issued');
        }

        reply = this.runCommand(device, command, controllers, source, response);
      }

      return reply;
    },

    macroCommands : function (commands, controllers) {
      var commandParts   = commands.split('='),
          device         = commandParts[0],
          parsedCommands = commandParts[1].split(',');

      return this.runMacro(device, parsedCommands, controllers, [], 0);
    },

    runMacro : function(device, commands, controllers, reply, i) {
      var tempCommand = commands[i];

      if(tempCommand) {
        if(tempCommand === 'sleep') {
          console.log('Sleep command issued');
        }

        else {
          reply[reply.length] = this.parseCommands(device, tempCommand, controllers, 'macro');
        }

        setTimeout(function() {
          var runCommand = require('./runCommand');

          runCommand.runMacro(device, commands, controllers, reply, i + 1);
        }, controllers.config.macroPause);
      }

      else {
        return reply;
      }
    },

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

        case 'list' :
          command = command.replace('list', '');
        break;
      }

      return command;
    },

    getCommandType : function (device, command) {
      var type = 'command';

      if(command.indexOf('text-') === 0) {
        type = 'text';
      }

      else if(command.indexOf('subdevice-') === 0) {
        type = 'subdevice';
      }

      else if(command.indexOf('launch-') === 0) {
        type = 'launch';
      }

      else if(command === 'list') {
        type = 'list';
      }

      return type;
    },

    validateCommand : function (device, command, controllers) {
      var commandType  = this.getCommandType(device, command),
          commandValid = false;

      if(controllers[device] !== undefined && controllers[device].controller.inputs.indexOf(commandType) !== -1) {
        // Standard commands need to be registered in each device keymap.
        if((commandType === 'command') && (controllers[device].controller.keymap.indexOf(command) !== -1)) {
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

        else if((commandType === 'list') && command === 'list') {
          commandValid = true;
        }
      }

      return commandValid;
    },

    runCommand : function (device, command, controllers, source, response, callback) {
      var message     = 'invalid',
          commandType = this.getCommandType(device, command),
          request     = {};

      callback = callback || function() {};

      if(device !== 'ts') {
        if(this.validateCommand(device, command, controllers)) {
          message = 'valid';

          if((typeof controllers[device].event === 'object') && (device !== source)) {
            controllers[device].event.fire(device, command, controllers);
          }

          request.callback = function(err, reply) {
            var deviceState = require(__dirname + '/deviceState');

            callback(err, reply);

            if(err) {
              console.log(controllers[device].config.title + ': An error has occurred executing a command');

              deviceState.updateState(device, { state : 'err' });

              if(response) {
                response.end('{"device":"' + device + '","command":"' + command + '","status":"err"}');
              }
            }

            else {
              console.log(controllers[device].config.title + ': Command executed');

              deviceState.updateState(device, { state : 'ok' });

              if(response) {
                response.end('{"device":"' + device + '","command":"' + command + '","status":"ok"}');
              }
            }
          };

          request.config = controllers.config;
          request.device = controllers[device].config;
          request[commandType] = this.stripTypePrefix(command, commandType);

          controllers[device].controller.send(request);

          console.log(controllers[device].config.title + ': Command ' + command + ' looks valid');
        }

        else if(controllers[device]) {
          console.log(controllers[device].config.title + ': Command looks invalid!');
        }

        else if(response) {
          response.end('{"device":"unknown","status":"err"}');
        }

        else {
          console.log('Cannot run command: Device unknown');
        }

        return { 'device' : device, 'command' : command, 'message' : message };
      }
    }
  };
}());
