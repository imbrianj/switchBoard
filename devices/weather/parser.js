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
        forecast,
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

    // https://darksky.net/dev/docs
    translateCode = function (code) {
      var codes = {
            'clear-day'           : 'sun-o',
            'clear-night'         : 'moon-o',
            'rain'                : 'umbrella',
            'snow'                : 'snowflake-o',
            'sleet'               : 'snowflake-o',
            'wind'                : 'flag',
            'fog'                 : 'fire',
            'cloudy'              : 'cloud',
            'partly-cloudy-day'   : 'cloud',
            'partly-cloudy-night' : 'cloud',
            'hail'                : 'snowflake-o',
            'thunderstorm'        : 'bolt',
            'tornado'             : 'warning'
          };

      return codes[code] || 'question';
    };

    if ((value) && (value.code)) {
      markup = markup.replace('{{WEATHER_ICON}}', translateCode(value.code));
      markup = markup.replace('{{WEATHER_CURRENT}}', translate('CURRENT') + ': ' + value.temp + '&deg; ' + value.text);
      markup = markup.replace('{{WEATHER_SUNRISE}}', value.sunrise);
      markup = markup.replace('{{WEATHER_SUNSET}}', value.sunset);
      markup = markup.replace('{{WEATHER_SUMMARY}}', value.text + '.  ' + value.hourly);

      for (i; i < value.forecast.days.length; i += 1) {
        forecast   = value.forecast.days[i];
        tempMarkup = tempMarkup + template.split('{{WEATHER_ICON}}').join(translateCode(forecast.code));
        tempMarkup = tempMarkup.split('{{WEATHER_DAY}}').join(translate(forecast.day) + ':');
        tempMarkup = tempMarkup.split('{{WEATHER_TEXT}}').join(forecast.text);
        tempMarkup = tempMarkup.split('{{WEATHER_HIGH}}').join(forecast.high + '&deg;');
        tempMarkup = tempMarkup.split('{{WEATHER_LOW}}').join(forecast.low + '&deg;');
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
