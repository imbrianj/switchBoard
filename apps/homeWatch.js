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
 * @fileoverview Monitor a number of sensors around your home and execute
 *               specified commands if actions are triggered during certain
 *               active modes.  Allows a configurable delay to compensate for
 *               presence sensor lag.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20160516,

    homeWatch : function (device, command, controllers, values, config) {
      var notify      = require(__dirname + '/../lib/notify'),
          translate   = require(__dirname + '/../lib/translate'),
          message     = '',
          trigger     = '',
          secureModes = config.secureModes || ['Away'],
          delay       = (config.delay || 15) * 1000,
          isIn        = function (command, collection, prefix) {
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
          isSecure    = function () {
            var deviceState      = require(__dirname + '/../lib/deviceState'),
                smartThingsState = deviceState.getDeviceState(device),
                isSecure         = false;

            if ((smartThingsState) && (smartThingsState.value) && (smartThingsState.value.mode)) {
              if (secureModes.indexOf(smartThingsState.value.mode) !== -1) {
                isSecure = true;
              }
            }

            return isSecure;
          };

      trigger = isIn(command, config.motion, 'subdevice-state-motion-') ||
                isIn(command, config.contact, 'subdevice-state-contact-');

      if (trigger && isSecure()) {
        // We use a delay here of a few seconds, as Presence sensors may take a
        // few seconds to register and update the mode.  We want to avoid false
        // positives as much as possible.
        setTimeout(function () {
          if(isSecure()) {
            console.log('\x1b[35m' + controllers[device].config.title + '\x1b[0m: Home Watch found something suspicous');

            message = translate.translate('{{i18n_HOME_WATCH}}', 'smartthings', controllers.config.language).split('{{LABEL}}').join(trigger);
            notify.notify(message, controllers, device);
          }
        }, delay);
      }
    }
  };
}());
