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

  exports.travis = function (deviceId, markup, state, value, fragments) {
    var template   = fragments.build,
        tempMarkup = '',
        icon       = '';

    if(state) {
      if(state === 'ok') {
        icon = 'check';
      }

      else if(state === 'err') {
        icon = 'times';
      }

      tempMarkup = tempMarkup + template.split('{{TRAVIS_URL}}').join(value.url);
      tempMarkup = tempMarkup.split('{{TRAVIS_ICON}}').join(icon);
      tempMarkup = tempMarkup.split('{{TRAVIS_STATE}}').join(state);
      tempMarkup = tempMarkup.split('{{TRAVIS_DURATION}}').join(value.duration + 's');
      tempMarkup = tempMarkup.split('{{TRAVIS_DESCRIPTION}}').join(value.description);

      markup = markup.replace('{{TRAVIS_STATUS}}', tempMarkup);

      return markup;
    }
  };
})(typeof exports === 'undefined' ? this.Switchboard.parsers : exports);
