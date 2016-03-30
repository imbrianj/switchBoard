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

  exports.stocks = function (deviceId, markup, state, value, fragments, language) {
    var template   = fragments.list,
        i          = 0,
        tempMarkup = '',
        change     = '',
        arrow      = '',
        direction  = '',
        translate  = function (message) {
          var util;

          if((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'stocks');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'stocks', language);
          }

          return message;
        };

    if(value) {
      for(i in value) {
        change    = 'neutral';
        arrow     = 'arrows-h';
        direction = translate('NEUTRAL');

        if(value[i].dayChangeValue) {
          if(value[i].dayChangeValue.indexOf('+') === 0) {
            change    = 'gain';
            arrow     = 'arrow-up';
            direction = translate('GAIN');
          }

          else if(value[i].dayChangeValue.indexOf('-') === 0) {
            change    = 'loss';
            arrow     = 'arrow-down';
            direction = translate('LOSS');
          }
        }

        tempMarkup = tempMarkup + template.split('{{STOCK_CHANGE}}').join(change);
        tempMarkup = tempMarkup.split('{{STOCK_ARROW}}').join(arrow);
        tempMarkup = tempMarkup.split('{{STOCK_DIRECTION}}').join(direction);
        tempMarkup = tempMarkup.split('{{STOCK_NAME}}').join(value[i].name);
        tempMarkup = tempMarkup.split('{{STOCK_PRICE}}').join(value[i].price);
        tempMarkup = tempMarkup.split('{{STOCK_CHANGE_VALUE}}').join(value[i].dayChangeValue);
        tempMarkup = tempMarkup.split('{{STOCK_CHANGE_PERCENT}}').join(value[i].dayChangePercent);
      }
    }

    return markup.replace('{{STOCKS_DYNAMIC}}', tempMarkup);
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
