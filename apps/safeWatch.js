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
 * @fileoverview Monitor a sensor to a secured room or safe - and notify if
 *               there is activity if all configured users are "Away".
 */

module.exports = (function () {
  'use strict';

  var TempNotified = false;

  return {
    version : 20160331,

    safeWatch : function (device, command, controllers, values, config) {
      var notify,
          translate,
          deviceState,
          smartThingsState,
          tempRange = config.temp    || {},
          tempMin   = tempRange.low  || 50,
          tempMax   = tempRange.high || 90,
          subdevice = '',
          type      = '',
          message   = '',
          now,
          parts,
          temp,
          governor  = (config.governor || 5) * 60000,
          isIn      = function (command, collection, prefix) {
            var found = false,
                current;

            for (current in collection) {
              if (command === prefix + collection[current] + '-on') {
                found = collection[current];
                break;
              }
            }

            return found;
          },
          isPresent = function (devices, presence) {
            var current,
                value = false;

            for (current in devices) {
              if ((devices[current].type === 'presence') && (devices[current].state === 'on')) {
                if (presence.indexOf(devices[current].label !== -1)) {
                  value = true;
                  break;
                }
              }
            }

            return value;
          };

      if (isIn(command, config.motion, 'subdevice-state-motion-')) {
        subdevice = isIn(command, config.motion, 'subdevice-state-motion-');
        type = 'MOTION';
      }

      else if (isIn(command, config.vibrate, 'subdevice-state-vibrate-')) {
        subdevice = isIn(command, config.vibrate, 'subdevice-state-vibrate-');
        type = 'VIBRATE';
      }

      else if (isIn(command, config.contact, 'subdevice-state-contact-')) {
        subdevice = isIn(command, config.contact, 'subdevice-state-contact-');
        type = 'CONTACT';
      }

      else if (command.indexOf('subdevice-state-temp-') === 0) {
        parts     = command.replace('subdevice-state-temp-', '').split('-');
        temp      = parts.pop();
        subdevice = parts.join('-');

        if (temp > tempMax || temp < tempMin) {
          now = new Date().getTime();

          if (now - governor > TempNotified) {
            type         = 'TEMP';
            TempNotified = now;
          }
        }
      }

      if ((subdevice) && (type)) {
        deviceState      = require(__dirname + '/../lib/deviceState');
        smartThingsState = deviceState.getDeviceState(device);

        if ((smartThingsState) && (smartThingsState.value) && (smartThingsState.value.devices)) {
          if (!isPresent(smartThingsState.value.devices, config.presence)) {
            notify    = require(__dirname + '/../lib/notify');
            translate = require(__dirname + '/../lib/translate');

            message = translate.translate('{{i18n_SAFE_WATCH_' + type + '}}', 'smartthings', controllers.config.language).split('{{LABEL}}').join(subdevice).split('{{TEMP}}').join(temp);

            notify.notify(message, controllers, device);
          }
        }
      }
    }
  };
}());
