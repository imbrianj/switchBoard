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
 * @fileoverview Execute specified macros and SmartThings mode changes based on
 *               sunset or sunrise.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20151009,

    lastState : null,

    translate : function (token, lang) {
      var translate = require(__dirname + '/../lib/translate');

      return translate.translate('{{i18n_' + token + '}}', 'weather', lang);
    },

    sunPhase : function (device, command, controllers, values, config) {
      var state    = values.value ? values.value.phase : null,
          runCommand,
          notify,
          deviceState,
          smartthingsState,
          newPhase = '',
          newMode  = '',
          rawMacro,
          macro,
          deviceId,
          message  = '';

      if (!this.lastState) {
        this.lastState = state;
      }

      if (state !== this.lastState) {
        this.lastState = state;
        runCommand     = require(__dirname + '/../lib/runCommand');
        notify         = require(__dirname + '/../lib/notify');
        newPhase       = state === 'Day' ? 'Sunrise' : 'Sunset';
        newMode        = state === 'Day' ? config.dayMode : config.nightMode;
        rawMacro       = config.macros[newPhase].split(';');

        for (deviceId in controllers) {
          if ((controllers[deviceId].config) && (controllers[deviceId].config.typeClass === 'smartthings')) {
            deviceState      = require(__dirname + '/../lib/deviceState');
            smartthingsState = deviceState.getDeviceState(deviceId);

            if ((smartthingsState) &&
                (smartthingsState.value) &&
                (smartthingsState.value.mode !== 'Away') &&
                (smartthingsState.value.mode !== newMode)) {
              runCommand.runCommand(deviceId, 'subdevice-mode-' + newMode);

              message = this.translate(newPhase.toUpperCase(), controllers.config.language);
              message = message.split('{{SUNSET}}').join(config.nightMode);
              message = message.split('{{SUNRISE}}').join(config.dayMode);

              notify.notify(message, controllers, device);
            }
          }
        }

        for (macro in rawMacro) {
          if (rawMacro.hasOwnProperty(macro)) {
            runCommand.macroCommands(rawMacro[macro]);
          }
        }
      }
    }
  };
}());
