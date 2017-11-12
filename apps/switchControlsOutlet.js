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
 *               configured devices.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20171111,

    lastState : {},

    switchControlsOutlet : function (deviceId, command, controllers, values, config) {
      var that        = this,
          deviceState = require(__dirname + '/../lib/deviceState'),
          runCommand  = require(__dirname + '/../lib/runCommand'),
          checkState,
          status,
          currDevice,
          subdevice,
          currentDeviceState,
          state;

      checkState = function () {
        var currDevice,
            currentDevice = {},
            status,
            subdeviceId,
            subdevice;

        for (currDevice in controllers) {
          if (controllers[currDevice].config) {
            currentDevice = deviceState.getDeviceState(currDevice);

            if ((currentDevice.value) && (currentDevice.value.devices)) {
              for (subdeviceId in currentDevice.value.devices) {
                if (currentDevice.value.devices[subdeviceId]) {
                  subdevice = currentDevice.value.devices[subdeviceId];

                  if (config.trigger === subdevice.label) {
                    status = subdevice.state;

                    if (!that.lastState[deviceId]) {
                      that.lastState[deviceId] = {};
                      that.lastState[deviceId][config.trigger] = status;
                    }

                    break;
                  }
                }
              }
            }
          }
        }

        return status;
      };

      status = checkState();

      if ((this.lastState[deviceId]) && (status !== this.lastState[deviceId][config.trigger])) {
        this.lastState[deviceId][config.trigger] = status;

        for (currDevice in controllers) {
          if (controllers.hasOwnProperty(currDevice)) {
            state = deviceState.getDeviceState(currDevice);

            if (controllers[currDevice].config) {
              switch (controllers[currDevice].config.typeClass) {
                case 'smartthings'     :
                case 'wemo'            :
                case 'raspberryRemote' :
                  currentDeviceState = deviceState.getDeviceState(currDevice);
                break;
              }

              if ((currentDeviceState.value) && (currentDeviceState.value.devices)) {
                for (subdevice in currentDeviceState.value.devices) {
                  if (config.action.indexOf(currentDeviceState.value.devices[subdevice].label) !== -1) {
                    if (currentDeviceState.value.devices[subdevice].state !== status) {
                      runCommand.runCommand(currDevice, 'subdevice-' + state.value.devices[subdevice].label + '-' + status);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}());
