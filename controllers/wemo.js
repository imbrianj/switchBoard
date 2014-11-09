/*jslint white: true */
/*global module, require, console */

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
   * @fileoverview Basic control of Belkin Wemo devices.
   * @requires http, xml2js
   */
  return {
    version : 201401108,

    inputs  : ['subdevice'],

    /**
     * Reference template fragment to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { group  : fs.readFileSync(__dirname + '/../templates/fragments/wemoGroups.tpl').toString(),
               switch : fs.readFileSync(__dirname + '/../templates/fragments/wemoListSwitch.tpl').toString() };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (wemo) {
      var path    = '/upnp/control/basicevent1',
          method  = 'POST',
          action  = wemo.command === 'state' ? 'Get' : 'Set';

      return {
        host    : wemo.deviceIp,
        port    : wemo.devicePort,
        path    : path,
        method  : method,
        headers : { 'content-type'  : 'text/xml; charset=utf-8',
                    'accept'        : 'text/xml',
                    'cache-control' : 'no-cache',
                    'soapaction'    : '"urn:Belkin:service:basicevent:1#' + action + 'BinaryState"' }
      };
    },

    /**
     * Prepare the POST data to be sent.
     */
    postData : function (wemo) {
      var response = '',
          action   = wemo.command === 'state' ? 'Get' : 'Set',
          command  = wemo.command === 'on'    ? 1 : 0;

      response += '<?xml version="1.0" encoding="utf-8"?>';
      response += '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">';
      response += '  <s:Body>';
      response += '    <u:' + action + 'BinaryState xmlns:u="urn:Belkin:service:basicevent:1">';
      response += '      <BinaryState>' + command + '</BinaryState>';
      response += '    </u:' + action + 'BinaryState>';
      response += '  </s:Body>';
      response += '</s:Envelope>';

      return response;
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller, config) {
      var runCommand = require(__dirname + '/../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'state', controller.config.deviceId);
    },

    /**
     * Prepares and calls send() to request the current state.
     */
    state : function (controller, config, callback) {
      var that        = this,
          deviceState = require(__dirname + '/../lib/deviceState'),
          wemoState   = deviceState.getDeviceState(controller.config.deviceId),
          wemo        = { device  : {}, config : {} },
          value       = { devices : {}, groups : controller.config.groups },
          wemoKeys    = Object.keys(controller.config.subdevices),
          xml2js      = require('xml2js'),
          parser      = new xml2js.Parser(),
          dataReply   = {},
          sendCommand,
          name;

      callback                 = callback || function() {};
      wemo.command             = 'state';
      wemo.device.deviceIp     = controller.config.subdevices[wemoKeys[0]];
      wemo.device.deviceId     = controller.config.deviceId;
      wemo.device.subdevices   = controller.config.subdevices;
      wemo.device.localTimeout = controller.controller.localTimeout || config.localTimeout;

      sendCommand = function(subdevices, count) {
        wemo.callback = function (err, reply) {
          var state  = 'err';

          value.devices[count] = { label : wemoKeys[count],
                                   state : 'err',
                                   type  : 'switch' };

          if((!err) && (reply)) {
            parser.parseString(reply, function(err, reply) {
              if(reply['s:Envelope']) {
                state = parseInt(reply['s:Envelope']['s:Body'][0]['u:GetBinaryStateResponse'][0].BinaryState[0], 10) > 0 ? 'on' : 'off';
              }

              value.devices[count].state = state;
            });
          }

          count += 1;

          wemo.device.deviceIp = subdevices[wemoKeys[count]];

          if(count >= wemoKeys.length) {
            callback(controller.config.deviceId, null, 'ok', { value : value });
          }

          else {
            sendCommand(subdevices, count);
          }
        };

        that.send(wemo);
      };

      sendCommand(controller.config.subdevices, 0);
    },

    send : function (config) {
      var http      = require('http'),
          that      = this,
          deviceState,
          wemoState,
          wemo      = {},
          dataReply = '',
          commandType,
          request,
          device;

      wemo.deviceIp   = config.device.deviceIp;
      wemo.timeout    = config.device.localTimeout || config.config.localTimeout;
      wemo.devicePort = config.devicePort          || 49153;
      wemo.command    = config.command             || '';
      wemo.subdevice  = config.subdevice           || '';
      wemo.callback   = config.callback            || function () {};

      if(wemo.subdevice) {
        if(wemo.subdevice.indexOf('toggle-') === 0) {
          commandType = 'toggle';
        }

        else if(wemo.subdevice.indexOf('on-') === 0) {
          commandType = 'on';
        }

        else if(wemo.subdevice.indexOf('off-') === 0) {
          commandType = 'off';
        }

        if(commandType) {
          wemo.subdevice = wemo.subdevice.replace(commandType + '-', '');

          if(commandType === 'toggle') {
            deviceState = require(__dirname + '/../lib/deviceState');
            wemoState   = deviceState.getDeviceState(config.device.deviceId);

            for(device in wemoState.value.devices) {
              if(wemo.subdevice === wemoState.value.devices[device].label) {
                commandType = wemoState.value.devices[device].state === 'on' ? 'off' : 'on';

                break;
              }
            }
          }

          if((commandType) && (commandType !== 'toggle')) {
            wemo.deviceIp = config.device.subdevices[wemo.subdevice];
            wemo.command  = commandType;
          }
        }
      }

      request = http.request(this.postPrepare(wemo), function(response) {
                  var deviceState = require(__dirname + '/../lib/deviceState'),
                      wemoState   = deviceState.getDeviceState(config.deviceId),
                      runCommand;

                  response.on('data', function(response) {
                    dataReply += response;
                  });

                  response.once('end', function() {
                    if(commandType) {
                      runCommand = require(__dirname + '/../lib/runCommand');

                      wemo.callback(null, wemoState);
                      runCommand.runCommand(config.device.deviceId, 'state', config.device.deviceId);
                    }

                    else {
                      wemo.callback(null, dataReply);
                    }
                  });
                });

      if(wemo.command === 'state') {
        request.setTimeout(wemo.timeout, function() {
          request.destroy();
          wemo.callback({ code : 'ETIMEDOUT' }, null, true);
        });
      }

      request.once('error', function(err) {
        if((err.code !== 'ETIMEDOUT') && (wemo.command !== 'state')) {
          wemo.callback(err);
        }
      });

      request.write(this.postData(wemo));

      request.end();

      return dataReply;
    }
  };
}());
