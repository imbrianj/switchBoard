/*jslint white: true */
/*global module, require, console */

/**
 * Copyright (c) 2014 markewest@gmail.com
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
   * @author jfeiler87
   * @fileoverview Basic control of raspberry-remote's send command
   * @requires child_process, raspberry-remote
   */
  return {
    version : 20150921,

    inputs : ['subdevice'],

    /**
     * Reference template fragment to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { switch : fs.readFileSync(__dirname + '/fragments/raspberryRemote.tpl').toString() };
    },

    /**
     * When a requet to change a subdevice's state comes in, we parse through it
     * to find the correct parameters to change the given device to a given
     * state.
     *
     * "send" requires the following parameters: system code, unit code,
     * command.
     */
    getDeviceParameters : function (rremote) {
      var params      = [],
          commandType = '',
          subdevice;

      if(rremote.subdevice.indexOf('on-') === 0) {
        commandType = 'on';
      }

      else if(rremote.subdevice.indexOf('off-') === 0) {
        commandType = 'off';
      }

      if(commandType) {
        subdevice   = rremote.subdevice.replace(commandType + '-', '');
        subdevice   = rremote.subdevices[subdevice];

        if((rremote.system) && (subdevice) && (commandType)) {
          params = [rremote.system, subdevice, commandType === 'on' ? 1 : 0];
        }
      }

      return params;
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     *
     * Since RaspberryRemote does not indicate state, we'll just need to load
     * subdevice names to be populated.
     */
    init : function (controller, config) {
      var deviceState = require(__dirname + '/../../lib/deviceState'),
          subdevices  = {},
          className   = '',
          i,
          j           = 0;

      if(process.platform === 'linux') {
        for(i in controller.config.subdevices) {
          className = '';

          if((controller.config.className) && (controller.config.className[i])) {
            className = controller.config.className[i];
          }

          subdevices[j] = { id        : controller.config.subdevices[i],
                            label     : i,
                            type      : 'switch',
                            className : className };
          j += 1;
        }

        deviceState.updateState(controller.config.deviceId, controller.config.typeClass, { state : 'ok', value : { devices : subdevices } });
      }

      else {
        deviceState.updateState(controller.config.deviceId, controller.config.typeClass, { state : 'err', value : {} });
      }
    },

    send : function (config) {
      var spawn   = require('child_process').spawn,
          rremote = {},
          send;

      rremote.subdevice  = config.subdevice;
      rremote.system     = config.device.system;
      rremote.subdevices = config.device.subdevices;
      rremote.callback   = config.callback || function () {};

      if((rremote.subdevice) && (rremote.system)) {
        rremote.parameters = this.getDeviceParameters(rremote);

        if(rremote.parameters.length === 3) {
          send = spawn('send', rremote.parameters);

          send.once('error', function(err) {
            rremote.callback(err);
          });

          send.once('close', function(code) {
            rremote.callback(null, 'ok', true);
          });
        }
      }
    }
  };
}());
