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
 * @fileoverview Announce when Geiger values go beyond a given threshold.
 */

module.exports = (function () {
  'use strict';

  var GeigerValues = {};

  return {
    version : 20200331,

    translate : function (token, lang) {
      var translate = require(__dirname + '/../lib/translate');

      return translate.translate('{{i18n_' + token + '}}', 'geiger', lang);
    },

    announceGeiger : function (deviceId, command, controllers, values, config) {
      var notify,
          runCommand,
          lang         = controllers.config.language,
          macros       = config.macros || {},
          macro,
          rawMacro,
          message      = '',
          type,
          value,
          i            = 0,
          j            = 0,
          configLevels = config.levels || {},
          levels       = { cpm  : configLevels.cpm  || 25,
                           acpm : configLevels.acpm || 1500,
                           usv  : configLevels.usv  || 0.15 };

      if ((values.value) && (values.value.report)) {
        for (i; i < values.value.report.length; i += 1) {
          if (values.value.report[i]) {
            for (j; j < values.value.report[i][j]; j += 1) {
              type  = values.value.report[i][j].type;
              value = values.value.report[i][j].value;

              GeigerValues[deviceId] = GeigerValues[deviceId] || {};

              if ((GeigerValues[deviceId][type] !== value) && (levels[type] < value)) {
                notify = require(__dirname + '/../lib/notify');

                message = this.translate('GEIGER_UNSAFE', lang).replace('{{TYPE}}', type).replace('{{VALUE}}', value);

                notify.notify(message, controllers, deviceId);

                if (macros[type]) {
                  runCommand = require(__dirname + '/../lib/runCommand');

                  rawMacro = config.macros[type].split(';');

                  for (macro in rawMacro) {
                    if (rawMacro.hasOwnProperty(macro)) {
                      runCommand.macroCommands(rawMacro[macro]);
                    }
                  }
                }
              }

              GeigerValues[deviceId][type] = value;
            }
          }
        }
      }
    }
  };
}());
