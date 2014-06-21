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

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control over Roku devices via TCP POST requests using
   *               Node.js.
   * @requires xml2js, http, fs, request
   */
  return {
    version : 20140619,

    inputs  : ['command', 'text', 'list', 'launch'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['Home', 'Rev', 'Fwd', 'Play', 'Select', 'Left', 'Right', 'Down', 'Up', 'Back', 'InstantReplay', 'Info', 'Backspace', 'Search', 'Enter'],

    /**
     * Prepare a POST request for a Roku command.
     */
    postPrepare : function (command) {
      var path    = '/',
          method  = 'POST',
          that    = this,
          runText = function(i, text, ip) {
            var letter = text[i];

            if(letter) {
              that.send({ letter: letter, device : { deviceIp: ip }});

              setTimeout(function() {
                runText(i + 1, text, ip);
              }, 200);
            }
          };

      if(command.command) {
        path += 'keypress/' + command.command;
      }

      if(command.letter) {
        path += 'keypress/Lit_' + command.letter;
      }

      if(command.text) {
        // Roku requires a string to be sent one char at a time.
        runText(0, command.text, command.deviceIp);
      }

      if(command.list) {
        method = 'GET';
        path  += 'query/apps';
      }

      if(command.launch) {
        path += 'launch/11?contentID=' + command.launch;
      }

      return {
        host   : command.deviceIp,
        port   : command.devicePort,
        path   : path,
        method : method
      };
    },

    cacheImage : function (appName, appId, config, logging) {
      var fs       = require('fs'),
          filePath = __dirname + '/../images/roku/icon_' + appId + '.png';

      fs.exists(filePath, function(exists) {
        var request;

        if(exists) {
          if(logging === 'verbose') {
            console.log('Roku: Skipping ' + appName + ' image - already saved locally');
          }
        }

        else {
          request = require('request');

          console.log('Roku: Saved image for ' + appName);
          request('http://' + config.deviceIp + ':8060/query/icon/' + appId).pipe(fs.createWriteStream(filePath));
        }
      });
    },

    findState : function (controller, callback, logging) {
      var xml2js = require('xml2js'),
          fs     = require('fs'),
          path   = require('path'),
          parser = new xml2js.Parser(),
          config = controller.config,
          apps   = {},
          that   = this;

      callback   = callback || function() {};

      this.send({ device : { deviceIp: config.deviceIp }, list: true, callback: function(err, response) {
        if(err) {
          var errorMsg = '';

          if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
            errorMsg = 'Roku: Device is off or unreachable';
          }

          else {
            errorMsg = 'Roku: ' + err.code;
          }

          callback(errorMsg);
        }

        else {
          parser.parseString(response, function(err, reply) {
            var app,
                i = 0;

            if(reply) {
              if(err) {
                console.log('Roku: Unable to parse reply');
              }

              else {
                for(i in reply.apps.app) {
                  app = reply.apps.app[i];

                  apps[app.$.id] = { 'name'  : app._,
                                     'id'    : app.$.id,
                                     'link'  : 'http://' + config.deviceIp + ':8060/launch/11?contentID=' + app.$.id,
                                     'image' : 'http://' + config.deviceIp + ':8060/query/icon/' + app.$.id,
                                     'cache' : '/images/roku/icon_' + app.$.id + '.png'
                                   };

                  that.cacheImage(app._, app.$.id, config, logging);
                }

                callback(null, apps);
              }
            }
          });
        }
      }});
    },

    init : function (controller, config) {
      var callback = function(deviceName, err, state, params) {
        var deviceState = require('../lib/deviceState');

        params.state = state;

        deviceState.updateState(deviceName, params);
      };

      this.state(controller, callback, 'verbose');
    },

    state : function (controller, callback, logging) {
      var stateCallback;

      logging  = logging || 'quiet';

      stateCallback = function(err, reply) {
        if(err) {
          callback(controller.config.deviceId, err);
        }

        else if(reply) {
          callback(controller.config.deviceId, null, 'ok', { value : reply });
        }
      };

      this.findState(controller, stateCallback, logging);
    },

    onload : function (controller) {
      var markup     = controller.markup,
          fs         = require('fs'),
          template   = fs.readFileSync(__dirname + '/../templates/fragments/roku.tpl').toString(),
          i          = 0,
          tempMarkup = '',
          apps;

      apps = State[controller.config.deviceId].value;

      if(apps) {
        for(i in apps) {
          tempMarkup = tempMarkup + template.split('{{APP_ID}}').join(apps[i].id);
          tempMarkup = tempMarkup.split('{{APP_IMG}}').join(apps[i].cache);
          tempMarkup = tempMarkup.split('{{APP_NAME}}').join(apps[i].name);
        }
      }

      return markup.replace('{{ROKU_DYNAMIC}}', tempMarkup);
    },

    send : function (config) {
      var http        = require('http'),
          roku        = {},
          dataReply   = '',
          request;

      roku.deviceIp   = config.device.deviceIp;
      roku.command    = config.command    || '';
      roku.text       = config.text       || '';
      roku.letter     = config.letter     || '';
      roku.list       = config.list       || '';
      roku.launch     = config.launch     || '';
      roku.devicePort = config.devicePort || 8060;
      roku.callback   = config.callback   || function () {};

      request = http.request(this.postPrepare(roku), function(response) {
                  response.once('data', function(response) {
                    console.log('Roku: Connected');

                    dataReply += response;
                  });

                  response.once('end', function() {
                    roku.callback(null, dataReply);
                  });
                });

      request.once('error', function(err) {
        var errorMsg = '';

        if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
          errorMsg = 'Roku: Device is off or unreachable';
        }

        else {
          errorMsg = 'Roku: ' + err.code;
        }

        console.log(errorMsg);

        roku.callback(errorMsg);
      });

      request.end();

      return dataReply;
    }
  };
}());
