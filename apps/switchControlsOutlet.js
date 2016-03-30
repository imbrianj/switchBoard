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
    version : 20150628,

    lastState : {},

    switchControlsOutlet : function (device, command, controllers, values, config) {
      var that        = this,
          deviceState = require(__dirname + '/../lib/deviceState'),
          runCommand  = require(__dirname + '/../lib/runCommand'),
          checkState,
          status,
          deviceId,
          subdevice,
          currentDeviceState,
          state;

      checkState = function () {
        var deviceId,
            currentDevice = {},
            status,
            subDeviceId,
            subDevice;

        for(deviceId in controllers) {
          if(controllers[deviceId].config) {
            currentDevice = deviceState.getDeviceState(deviceId);

            if((currentDevice.value) && (currentDevice.value.devices)) {
              for(subDeviceId in currentDevice.value.devices) {
                subDevice = currentDevice.value.devices[subDeviceId];

                if(config.trigger === subDevice.label) {
                  status = subDevice.state;

                  if(!that.lastState[device]) {

                    that.lastState[device] = {};
                    that.lastState[device][config.trigger] = status;
                  }

                  break;
                }
              }
            }
          }
        }

        return status;
      };

      status = checkState();

      if(status !== this.lastState[device][config.trigger]) {
        this.lastState[device][config.trigger] = status;

        for(deviceId in controllers) {
          state = deviceState.getDeviceState(deviceId);

          if(controllers[deviceId].config) {
            switch(controllers[deviceId].config.typeClass) {
              case 'smartthings'     :
              case 'wemo'            :
              case 'raspberryRemote' :
                currentDeviceState = deviceState.getDeviceState(deviceId);
              break;
            }

            if((currentDeviceState.value) && (currentDeviceState.value.devices)) {
              for(subdevice in currentDeviceState.value.devices) {
                if(config.action.indexOf(currentDeviceState.value.devices[subdevice].label) !== -1) {
                  if(currentDeviceState.value.devices[subdevice].state !== status) {
                    runCommand.runCommand(deviceId, 'subdevice-' + status + '-' + state.value.devices[subdevice].label);
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
