/*jslint white: true */
/*global module, console */

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

(function(exports){
  'use strict';

  exports.stocks = function (deviceId, markup, state, value, fragments) {
    var template   = fragments.list,
        i          = 0,
        className  = '',
        tempMarkup = '',
        change     = '',
        arrow      = '',
        direction  = '';

    if(state === 'ok') {
      className = ' device-on';
    }

    else if(state === 'err') {
      className = ' device-off';
    }

    markup = markup.replace('{{DEVICE_STATE}}', className);

    if(value) {
      for(i in value) {
        if(value[i].dayChangeValue.indexOf('+') === 0) {
          change    = 'gain';
          arrow     = 'arrow-up';
          direction = 'Gain';
        }

        else if(value[i].dayChangeValue.indexOf('-') === 0) {
          change    = 'loss';
          arrow     = 'arrow-down';
          direction = 'Loss';
        }

        else {
          change    = 'neutral';
          arrow     = 'arrows-h';
          direction = 'Neutral';
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
})(typeof exports === 'undefined' ? this.Switchboard.parsers : exports);
