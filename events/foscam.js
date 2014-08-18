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

/**
 * @author brian@bevey.org
 * @fileoverview Simple script to fire when the given device executes a
 *               presumed good command.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140816,

    fire : function(device, command, controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          callback,
          deviceId;

      if((command === 'AlarmOn') || (command === 'AlarmOff')) {
        callback = function(deviceId, err, reply, params) {
          var deviceState = require(__dirname + '/../lib/deviceState'),
              message     = 'err';

          params = params || {};

          if(reply) {
            message = 'ok';
          }

          params.state = message;

          deviceState.updateState(deviceId, controllers[deviceId].config.typeClass, params);
        };

        // We want to grab the state from the source of truth (the actual
        // device), but we need to wait a short time for it to register.
        setTimeout(function() {
            console.log('\x1b[35mFoscam\x1b[0m: Fetching alarm state');

            controllers[device].controller.state(controllers[device], controllers[device].config, callback);
        }, 250);

        for(deviceId in controllers) {
          if((deviceId !== 'config') && (controllers[deviceId].config.typeClass === 'speech')) {
            runCommand.runCommand(deviceId, command === 'AlarmOn' ? 'text-Camera armed' : 'text-Camera disarmed', 'single', false);
          }
        }
      }
    }
  };
}());
