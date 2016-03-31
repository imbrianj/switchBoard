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
 * @fileoverview Change SmartThings mode based on user presence.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20151009,

    stillAway : true,

    translate : function (token, lang) {
      var translate = require(__dirname + '/../lib/translate');

      return translate.translate('{{i18n_' + token + '}}', 'smartthings', lang);
    },

    isPresent : function (devices, presence) {
      var present = [],
          subdevice;

      for (subdevice in devices) {
        if ((devices[subdevice].type === 'presence') && (devices[subdevice].state === 'on') && (presence) && (presence.indexOf(devices[subdevice].label) !== -1)) {
          present.push(devices[subdevice].label);
        }
      }

      return present;
    },

    changeMode : function (device, newMode, present, controllers, lang) {
      var sharedUtil = require(__dirname + '/../lib/sharedUtil').util,
          notify     = require(__dirname + '/../lib/notify'),
          runCommand = require(__dirname + '/../lib/runCommand'),
          plural     = present.length > 1 ? 'ARE' : 'IS',
          message    = '',
          people     = '';

      if (newMode === 'Away') {
        message = this.translate('NOBODY_HOME', lang);
      }

      else {
        people  = sharedUtil.arrayList(present, 'smartthings', lang);
        message = this.translate('SOMEBODY_HOME', lang).split('{{PEOPLE}}').join(people);
        message = message.split('{{PLURAL}}').join(this.translate(plural, lang));
      }

      runCommand.runCommand(device, 'subdevice-mode-' + newMode);

      notify.notify(message, controllers, device);
    },

    presenceMode : function (device, command, controllers, values, config) {
      var that        = this,
          deviceState = require(__dirname + '/../lib/deviceState'),
          lang        = controllers.config.language,
          newMode     = null,
          deviceId,
          weatherState,
          present     = [],
          delay       = config.delay    || 10,
          presence    = config.presence || [];

      if (command.indexOf('subdevice-state-presence-') === 0) {
        if ((values.value) && (values.value.devices)) {
          present = this.isPresent(values.value.devices, presence);

          if (present.length === 0) {
            // Only mark "Away" based on a presence sensor going off.
            if (command.indexOf('-off') === (command.length - 4)) {
              this.stillAway = true;
              newMode = 'Away';
            }
          }

          else {
            // Only mark "Home" or "Night" based on a presence sensor going on.
            if (command.indexOf('-on') === (command.length - 3)) {
              this.stillAway = false;
              newMode = 'Home';

              for (deviceId in controllers) {
                if ((controllers[deviceId].config) && (controllers[deviceId].config.typeClass === 'weather')) {
                  weatherState = deviceState.getDeviceState(deviceId);

                  newMode = weatherState.value.phase === 'Day' ? config.dayMode : config.nightMode;
                }
              }
            }
          }

          if ((newMode) && (values.value.mode !== newMode)) {
            if (newMode === 'Away') {
              setTimeout(function () {
                var currentState = deviceState.getDeviceState(device),
                    present      = that.isPresent(currentState.value.devices);

                if ((that.stillAway) && (present.length === 0)) {
                  that.stillAway = false;

                  that.changeMode(device, newMode, present, controllers, lang);
                }
              }, delay * 60000);
            }

            else {
              this.changeMode(device, newMode, present, controllers, lang);
            }
          }
        }
      }
    }
  };
}());
