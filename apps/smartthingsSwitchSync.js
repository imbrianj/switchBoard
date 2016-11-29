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
 * @fileoverview When a switch is changed, relay that same change to any other
 *               configured devices.  This differs from switchSync in that it
 *               does not have a trigger or action - if any of the specified
 *               subdevices are acted upon, all others are given the same state.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20161101,

    smartthingsSwitchSync : function (deviceId, command, controllers, values, config) {
      var runCommand,
          deviceState,
          smartthingsState,
          deviceParts  = command.split('-'),
          deviceName   = '',
          deviceAction = '',
          subdevice;

      if (command.indexOf('subdevice-state-switch-') === 0) {
        runCommand       = require(__dirname + '/../lib/runCommand');
        deviceState      = require(__dirname + '/../lib/deviceState');

        smartthingsState = deviceState.getDeviceState(deviceId);
        deviceAction     = deviceParts[(deviceParts.length - 1)];
        deviceName       = command.split('subdevice-state-switch-').join('');
        deviceName       = deviceName.split('-' + deviceAction).join('');

        if (config.action.indexOf(deviceName) !== -1) {
          if ((smartthingsState.value) && (smartthingsState.value.devices)) {
            for (subdevice in smartthingsState.value.devices) {
              if (config.action.indexOf(smartthingsState.value.devices[subdevice].label) !== -1) {
                if ((smartthingsState.value.devices[subdevice].state !== deviceAction) &&
                    (smartthingsState.value.devices[subdevice].label !== deviceName)) {
                  runCommand.runCommand(deviceId, 'subdevice-' + smartthingsState.value.devices[subdevice].label + '-' + deviceAction);
                }
              }
            }
          }
        }
      }
    }
  };
}());
