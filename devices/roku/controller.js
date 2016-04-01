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

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control over Roku devices via TCP POST requests using
   *               Node.js.
   * @requires xml2js, http, fs, request, path
   */
  return {
    version : 20151129,

    inputs  : ['command', 'text', 'list', 'launch'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['HOME', 'REV', 'FWD', 'PLAY', 'SELECT', 'LEFT', 'RIGHT', 'DOWN', 'UP', 'BACK', 'INSTANTREPLAY', 'INFO', 'BACKSPACE', 'SEARCH', 'ENTER'],

    /**
     * Map inputted commands to the values the device or API is expecting.
     */
    hashTable : { 'BACK'           : 'Back',
                  'BACKSPACE'      : 'Backspace',
                  'DOWN'           : 'Down',
                  'ENTER'          : 'Enter',
                  'FWD'            : 'Fwd',
                  'HOME'           : 'Home',
                  'INFO'           : 'Info',
                  'INSTANT_REPLAY' : 'InstantReplay',
                  'LEFT'           : 'Left',
                  'PLAY'           : 'Play',
                  'REV'            : 'Rev',
                  'RIGHT'          : 'Right',
                  'SEARCH'         : 'Search',
                  'SELECT'         : 'Select',
                  'UP'             : 'Up',
                },

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { list : fs.readFileSync(__dirname + '/fragments/roku.tpl', 'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (command) {
      var path    = '/',
          method  = 'POST',
          that    = this,
          runText = function (i, text, ip) {
            var letter = text[i];

            if (letter) {
              that.send({ letter: letter, device : { deviceIp: ip }});

              setTimeout(function () {
                runText(i + 1, text, ip);
              }, 200);
            }
          };

      if (command.command) {
        path += 'keypress/' + command.command;
      }

      if (command.letter) {
        path += 'keypress/Lit_' + command.letter;
      }

      if (command.text) {
        // Roku requires a string to be sent one char at a time.
        runText(0, command.text, command.deviceIp);
      }

      if (command.list) {
        method = 'GET';
        path  += 'query/apps';
      }

      if (command.launch) {
        path += 'launch/11?contentID=' + command.launch;
      }

      return {
        host   : command.deviceIp,
        port   : command.devicePort,
        path   : path,
        method : method
      };
    },

    /**
     * For each app installed, we'll query the Roku, find it's associated image,
     * and save it locally for quicker and offline recall.  If the image is
     * already cached, it will be retained.
     */
    cacheImage : function (appName, appId, config) {
      var fs       = require('fs'),
          filePath = __dirname + '/../../images/roku/icon_' + appId + '.png',
          request,
          image;

      try {
        image = fs.statSync(filePath);
      }

      catch (catchErr) {
        request = require('request');

        console.log('\x1b[35m' + config.title + '\x1b[0m: Saved image for ' + appName);
        request('http://' + config.deviceIp + ':8060/query/icon/' + appId).pipe(fs.createWriteStream(filePath));
      }
    },

    /**
     * Prepare the request and build the callback that will take the XML from
     * the Roku, parse through it, find the installed applications and call
     * cacheImage.
     */
    findState : function (controller, callback) {
      var xml2js = require('xml2js'),
          parser = new xml2js.Parser(),
          config = controller.config,
          apps   = {},
          that   = this;

      callback   = callback || function () {};

      this.send({ device : { deviceIp: config.deviceIp }, list: true, callback: function (err, response) {
        if (err) {
          callback(err);
        }

        else {
          parser.parseString(response, function (err, reply) {
            var app,
                i = 0;

            if (reply) {
              if (err) {
                console.log('\x1b[31m' + config.device.title + '\x1b[0m: Unable to parse reply');
              }

              else {
                for (i in reply.apps.app) {
                  if (reply.apps.app.hasOwnProperty(i)) {
                    app = reply.apps.app[i];

                    apps[app.$.id] = { 'name'  : app._,
                                       'id'    : app.$.id,
                                       'link'  : 'http://' + config.deviceIp + ':8060/launch/11?contentID=' + app.$.id,
                                       'image' : 'http://' + config.deviceIp + ':8060/query/icon/' + app.$.id,
                                       'cache' : '/images/roku/icon_' + app.$.id + '.png'
                                     };

                    that.cacheImage(app._, app.$.id, config);
                  }
                }

                callback(null, apps);
              }
            }
          });
        }
      }});
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'state', controller.config.deviceId);
    },

    /**
     * Prepares and calls send() to request the current state.
     */
    state : function (controller, config, callback) {
      var stateCallback;

      callback = callback || function () {};

      stateCallback = function (err, reply) {
        if (err) {
          callback(controller.config.deviceId, err);
        }

        else if (reply) {
          callback(controller.config.deviceId, null, 'ok', { value : reply });
        }
      };

      this.findState(controller, stateCallback);
    },

    send : function (config) {
      var http        = require('http'),
          roku        = {},
          dataReply   = '',
          request;

      roku.deviceIp   = config.device.deviceIp;
      roku.command    = this.hashTable[config.command] || '';
      roku.text       = config.text                    || '';
      roku.letter     = config.letter                  || '';
      roku.list       = config.list                    || '';
      roku.launch     = config.launch                  || '';
      roku.devicePort = config.devicePort              || 8060;
      roku.callback   = config.callback                || function () {};

      request = http.request(this.postPrepare(roku), function (response) {
                  response.on('data', function (response) {
                    dataReply += response;
                  });

                  response.once('end', function () {
                    roku.callback(null, dataReply);
                  });
                });

      request.once('error', function (err) {
        roku.callback(err);
      });

      request.end();
    }
  };
}());
