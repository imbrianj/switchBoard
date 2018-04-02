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
 * @fileoverview Announce when Air Quality values go beyond a given threshold.
 */

module.exports = (function () {
  'use strict';

  var AirQualityValues = {};

  return {
    version : 20180402,

    translate : function (token, lang) {
      var translate = require(__dirname + '/../lib/translate');

      return translate.translate('{{i18n_' + token + '}}', 'airQuality', lang);
    },

    announceAirQuality : function (deviceId, command, controllers, values, config) {
      var notify,
          runCommand,
          lang         = controllers.config.language,
          macros       = config.macros || {},
          message      = '',
          type,
          value,
          i            = 0,
          configLevels = config.levels || {},
          levels       = { co   : configLevels.co   || 9,
                           pm25 : configLevels.pm25 || 34.4,
                           no2  : configLevels.pm25 || 0.045 };

      if ((values.value) && (values.value.report)) {
        for (i; i < values.value.report.length; i += 1) {
          type  = values.value.report[i].type;
          value = values.value.report[i].value;

          AirQualityValues[deviceId] = AirQualityValues[deviceId] || {};

          if ((AirQualityValues[deviceId][type] !== value) && (levels[type] < value)) {
            notify = require(__dirname + '/../lib/notify');

            message = this.translate('AIRQUALITY_UNSAFE', lang).replace('{{TYPE}}', type).replace('{{VALUE}}', value);

            notify.notify(message, controllers, deviceId);

            if (macros[type]) {
              runCommand = require(__dirname + '/../lib/runCommand');
              runCommand.macroCommands(macros[type]);
            }
          }

          AirQualityValues[deviceId][type] = value;
        }
      }
    }
  };
}());
