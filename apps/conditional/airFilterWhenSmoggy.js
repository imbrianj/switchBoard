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
 * @fileoverview Prevent an air filter or other device from being turned off if
 *               air quality is bad.  The main intent of this is to prevent
 *               automated macros or machine learning from turning off a filter
 *               if air quality (PM 2.5) is really bad.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20180822,

    airFilterWhenSmoggy : function (deviceId, command, controllers, config) {
      var deviceState      = require(__dirname + '/../../lib/deviceState'),
          commandParts     = command.split('-'),
          filter           = config.filter,
          maxLevel         = config.maxLevel || 34.4,
          commandSubdevice = '',
          checkState,
          status;

      checkState = function () {
        var currDevice,
            currentDevice = {},
            status        = {},
            subdeviceId,
            i             = 0;

        for (currDevice in controllers) {
          if (controllers[currDevice].config) {
            switch (controllers[currDevice].config.typeClass) {
              // Look for bad PM 2.5 values in Air Quality
              case 'airQuality' :
                currentDevice = deviceState.getDeviceState(currDevice);

                if (currentDevice.value && currentDevice.value.report) {
                  for (i; i < currentDevice.value.report.length; i += 1) {
                    if (currentDevice.value.report[i].type === 'pm25') {
                      status.value = currentDevice.value.report[i].value;
                    }
                  }
                }
              break;

              case 'nest'        :
              case 'smartthings' :
              case 'wemo'        :
                currentDevice = deviceState.getDeviceState(currDevice);

                if (currentDevice.value) {
                  for (subdeviceId in currentDevice.value.devices) {
                    if (currentDevice.value.devices[subdeviceId].label === filter) {
                      status.filter   = currentDevice.value.devices[subdeviceId];
                      status.newState = currentDevice.value;
                    }
                  }
                }
              break;
            }
          }
        }

        return status;
      };

      if (commandParts.length === 3) {
        commandSubdevice = commandParts[1];

        // We only care if it's the given subdevice AND we're trying to
        // potentially turn it off.
        if ((filter === commandSubdevice) && ((commandParts[2] === 'toggle') || (commandParts[2] === 'off'))) {
          status = checkState();

          // Air quality is beyond it's determined safe bounds and the chosen
          // filter is currently on - abort this off or toggle command.
          if ((status.value >= maxLevel) && (status.filter.state === 'on')) {

            return false;
          }
        }
      }
    }
  };
}());
