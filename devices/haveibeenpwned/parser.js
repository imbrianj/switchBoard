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

  exports.haveibeenpwned = function (deviceId, markup, state, value, fragments, language) {
    var allClear   = fragments.allClear,
        pwns       = fragments.pwns,
        pwn        = fragments.pwn,
        tempMarkup = '',
        i          = 0,
        translate  = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'haveibeenpwned');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'haveibeenpwned', language);
          }

          return message;
        };

    if ((state) && (value) && (value.length)) {
      for (i; i < value.length; i += 1) {
        tempMarkup = tempMarkup + pwn.split('{{HAVEIBEENPWNED_TITLE}}').join(value[i].title);
        tempMarkup = tempMarkup.split('{{HAVEIBEENPWNED_DATETIME}}').join(value[i].date);
        tempMarkup = tempMarkup.split('{{HAVEIBEENPWNED_DATE}}').join(value[i].date);
        tempMarkup = tempMarkup.split('{{HAVEIBEENPWNED_DESCRIPTION}}').join(value[i].description);
      }

      tempMarkup = pwns.split('{{HAVEIBEENPWNED_PWNS}}').join(tempMarkup);
    }

    else {
      tempMarkup = allClear.split('{{HAVEIBEENPWNED_ALL_CLEAR}}').join(translate('ALL_CLEAR'));
    }

    markup = markup.replace('{{HAVEIBEENPWNED_DYNAMIC}}', tempMarkup);

    return markup;
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
