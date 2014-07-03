/*jslint white: true */
/*global State, module, require, console */

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
   * @fileoverview Basic control over PS3 pre-configured GIMX setup.
   * @requires child_process, fs
   * @note Requires the installation of sixemu package, version 1.11+ available
   *       here: https://code.google.com/p/diyps3controller/downloads/list
   */
  return {
    version : 20140619,

    inputs  : ['command'],

    /**
     * Whitelist of available key codes to use.  We could support all buttons,
     * as they are supported in GIMX, but timing of events for unnecessary
     * buttons in the context of media control seems pointless.
     */
    keymap  : ['PowerOn', 'Left', 'Right', 'Up', 'Down', 'PS', 'Select', 'Start', 'Triangle', 'Circle', 'Cross', 'Square'],

    translateCommand : function (command, deviceMac, platform, revert) {
      var execute = { command : '', params : [] },
          value   = revert === true ? 0 : 255;

      if(platform === 'linux' || platform === 'win32') {
        switch(command) {
          case 'PowerOn' :
            execute.command = 'emu';

            execute.params.push(deviceMac);
          break;

          case 'PS' :
            execute.command = 'emuclient';

            execute.params.push('--event');
            execute.params.push('PS(' + value + ')');
          break;

          case 'Left'     :
          case 'Right'    :
          case 'Up'       :
          case 'Down'     :
          case 'Select'   :
          case 'Start'    :
          case 'Triangle' :
          case 'Circle'   :
          case 'Cross'    :
          case 'Square'   :
            execute.command = 'emuclient';

            execute.params.push('--event');
            execute.params.push(command.toLowerCase() + '(' + value + ')');
          break;
        }
      }

      else {
        execute = '';

        console.log('\x1b[31mPS3\x1b[0m: Gimx is not supported on your platform!');
      }

      return execute;
    },

    init : function(controller, config) {
      var deviceState = require('../lib/deviceState');

      deviceState.updateState(controller.config.deviceId, 'ps3', { state : 'err' });
    },

    onload : function (controller) {
      var parser = require(__dirname + '/../parsers/ps3').ps3;

      return parser(controller.deviceId, controller.markup, State[controller.config.deviceId].state, State[controller.config.deviceId].value);
    },

    send : function (config) {
      var fs         = require('fs'),
          spawn      = require('child_process').spawn,
          ps3        = {},
          that       = this,
          emuclient;

      ps3.deviceId  = config.device.deviceId;
      ps3.deviceMac = config.device.deviceMac;
      ps3.command   = config.command  || '';
      ps3.callback  = config.callback || function () {};
      ps3.platform  = config.platform || process.platform;
      ps3.revert    = config.revert   || false;

      if(State[ps3.deviceId].state === 'ok') {
        // If the PS3 is already on, we shouldn't execute PowerOn again.
        if(ps3.command === 'PowerOn') {
          console.log('\x1b[35mPS3\x1b[0m: Device looks on already.  Changing command to PS');

          ps3.command = 'PS';
        }
      }

      else {
        console.log('\x1b[35mPS3\x1b[0m: Device doesn\'t look on');
      }

      ps3.execute = this.translateCommand(ps3.command, ps3.deviceMac, ps3.platform, ps3.revert);

      emuclient = spawn(ps3.execute.command, ps3.execute.params);

      // The Gimx service will run for quite a while, so we need to execute the
      // callback to send a response before the command closes some time later.
      if(ps3.command === 'PowerOn') {
        ps3.callback(null, 'ok');
      }

      emuclient.once('close', function(code) {
        var deviceState;

        if(ps3.command === 'PowerOn') {
          deviceState = require('../lib/deviceState');

          deviceState.updateState(ps3.deviceId, 'ps3', { state : 'err' });
        }

        else if((ps3.revert !== true) && (ps3.command !== 'PS')) {
          config.revert = true;

          that.send(config);
        }

        else {
          if(code === 0) {
            ps3.callback(null, 'ok');
          }

          else {
            ps3.callback('err');
          }
        }
      });
    }
  };
}());
