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
   * @fileoverview Basic control for Lutron.
   * @requires xml2js, http, fs
   */
  return {
    version : 20180326,

    inputs  : ['command', 'text', 'list'],

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (command) {
      var path    = '/',
          method  = 'GET';
          //that    = this;

      if (command.list) {
        path  = '/';
      }

      return {
        host   : command.deviceIp,
        port   : command.devicePort,
        path   : path,
        method : method
      };
    },

    /**
     * Prepare the request and build the callback that will take the XML from
     * the Lutron hub, parse through it and find the installed devices.
     */
    findState : function (controller, callback) {
      var xml2js  = require('xml2js'),
          parser  = new xml2js.Parser(),
          config  = controller.config,
          devices = {};
          //that    = this;

      callback = callback || function () {};

      this.send({ device : { deviceIp: config.deviceIp }, list: true, callback: function (err, response) {
        if (err) {
          callback(err);
        }

        else {
          parser.parseString(response, function (err, reply) {
            var device,
                i = 0;

            if (reply) {
              if (err) {
                console.log('\x1b[31m' + config.device.title + '\x1b[0m: Unable to parse reply');
              }

              else {
// TODO - super basic for right now.
                if (reply.Project && reply.Project.Areas && reply.Project.Areas[0]) {
                  for (i in reply.Project.Areas[0].Area[0].Areas[0].Area) {
                    if (reply.Project.Areas[0].Area[0].Areas[0].Area.hasOwnProperty(i)) {
                      device = reply.Project.Areas[0].Area[0].Areas[0].Area[i].$;

                      devices[device.IntegrationId] = { 'name' : device.Name,
                                                        'id'   : device.IntegrationId
                                                      };
                    }
                  }
                }

                callback(null, devices);
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
          lutron      = {},
          dataReply   = '',
          request;

// Telnet port 23:
// #OUTPUT,[DEVICE_ID],[ACTION_NUMBER],[VALUE],[FADE_TIMING]
// #OUTPUT,11,1,0,1

      lutron.deviceIp   = config.device.deviceIp;
      lutron.command    = this.hashTable[config.command] || '';
      lutron.text       = config.text                    || '';
      lutron.letter     = config.letter                  || '';
      lutron.list       = config.list                    || '';
      lutron.launch     = config.launch                  || '';
      lutron.devicePort = config.devicePort              || 80;
      lutron.callback   = config.callback                || function () {};

      request = http.request(this.postPrepare(lutron), function (response) {
                  response.on('data', function (response) {
                    dataReply += response;
                  });

                  response.once('end', function () {
                    lutron.callback(null, dataReply);
                  });
                });

      request.once('error', function (err) {
        lutron.callback(err);
      });

      request.end();
    }
  };
}());
