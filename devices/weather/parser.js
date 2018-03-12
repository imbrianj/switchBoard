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

(function (exports){
  'use strict';

  exports.weather = function (deviceId, markup, state, value, fragments, language) {
    var template   = fragments.forecast,
        i          = 0,
        tempMarkup = '',
        translate,
        translateCode;

    translate  = function (message) {
      var util;

      if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
        message = SB.util.translate(message, 'weather');
      }

      else {
        util    = require(__dirname + '/../../lib/sharedUtil').util;
        message = util.translate(message, 'weather', language);
      }

      return message;
    };

    // https://developer.yahoo.com/weather/documentation.html#codes
    translateCode = function (code) {
      var warning    = 'warning',   // Tropical Storm
          lightning  = 'bolt',      // Thunderstorm
          snow       = 'snowflake', // Snow
          rain       = 'tint',      // Rain
          smoke      = 'fire',      // Smoke
          wind       = 'flag',      // Wind
          cloud      = 'cloud',     // Cloudy
          clearNight = 'moon',      // Clear Night
          clearDay   = 'sun',       // Clear Day
          codes = {
            0  : warning,
            1  : warning,
            2  : warning,
            3  : lightning,
            4  : lightning,
            5  : snow,
            6  : snow,
            7  : snow,
            8  : snow,
            9  : rain,
            10 : rain,
            11 : rain,
            12 : rain,
            13 : snow,
            14 : snow,
            15 : snow,
            16 : snow,
            17 : snow,
            18 : snow,
            19 : smoke,
            20 : smoke,
            21 : smoke,
            22 : smoke,
            23 : wind,
            24 : wind,
            25 : snow,
            26 : cloud,
            27 : cloud,
            28 : cloud,
            29 : cloud,
            30 : cloud,
            31 : clearNight,
            32 : clearDay,
            33 : clearNight,
            34 : clearDay,
            35 : snow,
            36 : clearDay,
            37 : lightning,
            38 : lightning,
            39 : lightning,
            40 : rain,
            41 : snow,
            42 : snow,
            43 : snow,
            44 : cloud,
            45 : lightning,
            46 : snow,
            47 : lightning
          };

      code = parseInt(code, 10);

      return codes[code] || 'question';
    };

    if ((value) && (value.code)) {
      markup = markup.replace('{{WEATHER_ICON}}', translateCode(value.code));
      markup = markup.replace('{{WEATHER_CURRENT}}', value.city + ' ' + translate('CURRENT') + ': ' + value.temp + '&deg; ' + value.text);
      markup = markup.replace('{{WEATHER_SUNRISE}}', value.sunrise);
      markup = markup.replace('{{WEATHER_SUNSET}}', value.sunset);

      for (i in value.forecast) {
        if (value.forecast.hasOwnProperty(i)) {
          tempMarkup = tempMarkup + template.split('{{WEATHER_ICON}}').join(translateCode(value.forecast[i].code));
          tempMarkup = tempMarkup.split('{{WEATHER_DAY}}').join(value.forecast[i].day + ':');
          tempMarkup = tempMarkup.split('{{WEATHER_TEXT}}').join(value.forecast[i].text);
          tempMarkup = tempMarkup.split('{{WEATHER_HIGH}}').join(value.forecast[i].high + '&deg;');
          tempMarkup = tempMarkup.split('{{WEATHER_LOW}}').join(value.forecast[i].low + '&deg;');
        }
      }
    }

    else {
      markup = markup.replace('{{WEATHER_CURRENT}}', translate('UNAVAILABLE'));
      markup = markup.replace('{{WEATHER_SUNRISE}}', '');
      markup = markup.replace('{{WEATHER_SUNSET}}', '');

      if (typeof value === 'string') {
        tempMarkup = value;
      }
    }

    return markup.replace('{{WEATHER_DYNAMIC}}', tempMarkup);
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
