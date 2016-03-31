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

  var SmartthingsMode = {};

  return {
    version : 20150613,

    smartthingsModeChange : function (device, command, controllers, values, config) {
      var deviceState      = require(__dirname + '/../lib/deviceState'),
          smartthingsState = deviceState.getDeviceState(device),
          runCommand,
          rawMacro,
          macro;

      if ((smartthingsState) && (smartthingsState.value) && (smartthingsState.value.mode)) {
        // We'll check the SmartThings state and compare to the last time we
        // ran this to see if things have changed, regardless of source.
        if (smartthingsState.value.mode !== SmartthingsMode[device]) {
          SmartthingsMode[device] = smartthingsState.value.mode;

          // If you have a macro assigned to this specific Mode, we'll act upon
          // it.
          if (config[SmartthingsMode[device]]) {
            runCommand = require(__dirname + '/../lib/runCommand');

            rawMacro = config[SmartthingsMode[device]].split(';');

            for (macro in rawMacro) {
              runCommand.macroCommands(rawMacro[macro]);
            }
          }
        }
      }
    }
  };
}());
