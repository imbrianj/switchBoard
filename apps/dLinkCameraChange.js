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
 * @fileoverview When the DLink camera is armed or disarmed, we want to wait a
 *               very short time to allow the new setting to be registered on
 *               the device - then grab the new state instead of waiting for the
 *               next scheduled state.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20181205,

    dLinkCameraChange : function (deviceId, command, controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand');

      if ((command === 'ALARM_ON') || (command === 'ALARM_OFF')) {
        // We want to grab the state from the source of truth (the actual
        // device), but we need to wait a short time for it to register.
        setTimeout(function () {
          console.log('\x1b[35m' + controllers[deviceId].config.title + '\x1b[0m: Fetching alarm state');

          runCommand.runCommand(deviceId, 'state', 'single', false);
        }, 250);
      }
    }
  };
}());
