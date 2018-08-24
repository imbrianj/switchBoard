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
 * @fileoverview After a command to operate a blind, check SmartThings to see if
 *               that particular window is open.  If so, do not allow the blind
 *               to roll up or down if it's currently below the window safe
 *               threshold to protect it from rolling up unevenly, causing
 *               damage.  If the issued blind is currently above the threshold,
 *               allow it to roll all the way up and down as far as the
 *               threshold allows.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20180922,

    translate : function (token, lang) {
      var translate = require(__dirname + '/../../lib/translate');

      return translate.translate('{{i18n_' + token + '}}', 'powerView', lang);
    },

    formatMessage : function (messageType, contact, state, lang) {
      var message    = '';

      switch (messageType) {
        case 'warn' :
          message = this.translate('LOWER_AS_FAR_AS_ABLE', lang);
        break;

        case 'abort' :
          message = this.translate('UNABLE_TO_LOWER', lang);
        break;
      }

      message = message.split('{{WINDOW}}').join(contact);

      return message;
    },

    blindsWindowOpen : function (deviceId, command, controllers, config) {
      var notify           = require(__dirname + '/../../lib/notify'),
          deviceState      = require(__dirname + '/../../lib/deviceState'),
          runCommand       = require(__dirname + '/../../lib/runCommand'),
          commandParts     = command.split('-'),
          commandSubdevice = '',
          commandPercent   = '',
          checkState,
          message          = '',
          status;

      if (commandParts.length === 3) {
        commandSubdevice = commandParts[1];

        if ((commandParts[2]) && (!isNaN(commandParts[2]))) {
          commandPercent = commandParts[2];
        }
      }

      checkState = function () {
        var currDevice,
            currentDevice = {},
            status        = {},
            subdeviceId,
            subdevice,
            i;

        for (currDevice in controllers) {
          if (controllers[currDevice].config) {
            switch (controllers[currDevice].config) {
              // Look through powerView for any blinds that may be down.
              case 'powerView' :
                currentDevice = deviceState.getDeviceState(currDevice);

                if (currentDevice.value) {
                  for (subdeviceId in currentDevice.value.devices) {
                    if (currentDevice.value.devices.hasOwnProperty(subdeviceId)) {
                      subdevice = currentDevice.value.devices[subdeviceId];

                      for (i = 0; i < config.windows.length; i += 1) {
                        if ((config.windows[i].blind === commandSubdevice) && (config.windows[i].blind === subdevice.label)) {
                          // If the blind is rolled down past the limit, we can't
                          // safely do anything.
                          if (subdevice.percentage < config.windows[i].limit) {
                            status.blind = subdevice.label;
                            status.type  = 'abort';
                          }

                          // ...but if the blind is above the threshold, we can
                          // adjust safely within that area.
                          else if ((subdevice.percentage >= config.windows[i].limit) && (commandPercent < config.windows[i].limit)) {
                            status.blind = subdevice.label;
                            status.limit = config.windows[i].limit;
                            status.type  = 'warn';
                          }
                        }
                      }
                    }
                  }
                }
              break;

              // Look through SmartThings for any open contacts.
              case 'smartthings' :
                currentDevice = deviceState.getDeviceState(currDevice);

                if (currentDevice.value) {
                  for (subdeviceId in currentDevice.value.devices) {
                    if (currentDevice.value.devices.hasOwnProperty(subdeviceId)) {
                      subdevice = currentDevice.value.devices[subdeviceId];

                      for (i = 0; i < config.windows.length; i += 1) {
                        if ((subdevice.state === 'on') && (config.windows[i].blind === commandSubdevice) && (config.windows[i].contact === subdevice.label)) {
                          status.contact = subdevice.label;
                        }
                      }
                    }
                  }
                }
              break;
            }
          }
        }

        return status;
      };

      // We only care if it's a command to a specific blind.
      if (commandPercent) {
        status = checkState();

        // checkState will return warnings.  We only want to act if we have
        // something worth noting.
        if ((status) && (status.type) && (status.contact)) {
          switch (status.type) {
            case 'warn' :
              message = this.formatMessage('warn', status.contact, controllers.config.language);
              notify.notify(message, controllers, deviceId);

              // We can lower the blind as far as the set limit.
              runCommand.runCommand(deviceId, 'subdevice-' + status.blind + '-' + status.limit);
            break;

            case 'abort' :
              message = this.formatMessage('abort', status.contact, controllers.config.language);
              notify.notify(message, controllers, deviceId);
            break;
          }

          return false;
        }
      }
    }
  };
}());
