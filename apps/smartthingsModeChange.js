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
 * @fileoverview When SmartThings has a change in mode, we'll run any configured
 *               commands.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20170202,

    lastEvents : {},

    smartthingsModeChange : function (deviceId, command, controllers, values, config) {
      var deviceState      = require(__dirname + '/../lib/deviceState'),
          smartthingsState = deviceState.getDeviceState(deviceId),
          now              = new Date().getTime(),
          delay            = (config.delay || 5) * 1000,
          newMode,
          translate,
          notify,
          runCommand,
          message,
          rawMacro,
          macro;

      if ((smartthingsState) && (smartthingsState.value) && (smartthingsState.value.mode)) {
        this.lastEvents[deviceId] = this.lastEvents[deviceId] || { time : 0 };

        // We'll check the SmartThings state and compare to the last time we
        // ran this to see if things have changed, regardless of source.
        // Add a delay since any latency from the SmartThings API may cause the
        // mode to be somewhat unpredictable with some race conditions.
        if ((now > this.lastEvents[deviceId].time + delay) && (smartthingsState.value.mode !== this.lastEvents[deviceId].mode)) {
          if (this.lastEvents[deviceId].mode) {
            newMode   = smartthingsState.value.mode;

            translate = require(__dirname + '/../lib/translate');
            notify    = require(__dirname + '/../lib/notify');
            message   = translate.translate('{{i18n_MODE_CHANGE}}', 'smartthings', controllers.config.language).replace('{{MODE}}', newMode);

            notify.notify(message, controllers, deviceId);

            // If you have a macro assigned to this specific Mode, we'll act
            // upon it.
            if (config[newMode]) {
              runCommand = require(__dirname + '/../lib/runCommand');

              rawMacro = config[newMode].split(';');

              for (macro in rawMacro) {
                if (rawMacro.hasOwnProperty(macro)) {
                  runCommand.macroCommands(rawMacro[macro]);
                }
              }
            }
          }

          this.lastEvents[deviceId].mode = smartthingsState.value.mode;
        }

        this.lastEvents[deviceId].time = now;
      }
    }
  };
}());
