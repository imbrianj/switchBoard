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

/**
 * @author brian@bevey.org
 * @fileoverview When a window is opened from SmartThings - notify immediately
 *               if the Nest thermostat is on.  After a grace period, turn the
 *               thermostat off.  Additionally, if the window is already open
 *               and a thermostat is turned on, notify and turn it off.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20150216,

    governor : false,

    windowOpen : function(device, command, controllers, values, config) {
      var deviceState = require(__dirname + '/../lib/deviceState'),
          runCommand  = require(__dirname + '/../lib/runCommand'),
          that        = this,
          delay       = config.delay || 60,
          notify,
          checkState,
          status      = { thermostat : [], contact : [] };

      notify = function(message) {
        var deviceId;

        for(deviceId in controllers) {
          if(controllers[deviceId].config) {
            switch(controllers[deviceId].config.typeClass) {
              case 'pushover' :
              case 'sms'      :
              case 'speech'   :
                runCommand.runCommand(deviceId, 'text-' + message);
              break;
            }
          }
        }
      };

      checkState = function() {
        var deviceId,
            currentDevice = {},
            status        = { thermostat : [], contact : [] },
            subDeviceId,
            subDevice,
            i;

        for(deviceId in controllers) {
          if((controllers[deviceId].config) && (controllers[deviceId].config.typeClass === 'nest')) {
            currentDevice = deviceState.getDeviceState(deviceId);

            if(currentDevice.value) {
              for(subDeviceId in currentDevice.value.devices) {
                subDevice = currentDevice.value.devices[subDeviceId];

                if((config.thermostat.indexOf(subDevice.label) !== -1) && (subDevice.type === 'thermostat') && (subDevice.state !== 'off')) {
                  status.thermostat.push({ label : subDevice.label, state : subDevice.state });
                }
              }
            }
          }

          else if((controllers[deviceId].config) && (controllers[deviceId].config.typeClass === 'smartthings')) {
            currentDevice = deviceState.getDeviceState(deviceId);

            if(currentDevice.value) {
              for(subDeviceId in currentDevice.value.devices) {
                subDevice = currentDevice.value.devices[subDeviceId];

                if((config.contact.indexOf(subDevice.label)) && (subDevice.type === 'contact') && (subDevice.state === 'on')) {
                  status.contact.push(subDeviceId);
                }
              }
            }
          }
        }

        return status;
      };

      status = checkState();

      // If something is on while a contact sensor is open, we'll first notify,
      // then wait a minute before we shut things down.
      if((this.governor === false) && (status.thermostat.length) && (status.contact.length)) {
        this.governor = true;

        notify(config.message[status.thermostat[0].state]);

        setTimeout(function() {
          var status = checkState(),
              deviceId,
              i;

          if(status.thermostat.length && status.contact.length) {
            notify(config.message.off);

            for(deviceId in controllers) {
              if(controllers[deviceId].config) {
                if(controllers[deviceId].config.typeClass === 'nest') {
                  for(i = 0; i < status.thermostat.length; i += 1) {
                    runCommand.runCommand(deviceId, 'subdevice-mode-' + status.thermostat[i].label + '-off');
                  }
                }
              }
            }
          }

          // Don't hammer us if we're messing with the thermostat.
          setTimeout(function() {
            that.governor = false;
          }, 60000);
        }, delay * 1000);
      }
    }
  };
}());
