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
        icon       = '',
        duration   = '',
        i          = 0;

    if((state) && (value)) {
      for(i; i < value.length; i += 1) {
        icon     = '';
        duration = '';

        if((value[i].state === 'created') || (value[i].state === 'started')) {
          icon = 'cogs';
        }

        else if(value[i].status === 'ok') {
          icon = 'check';
        }

        else if(value[i].status === 'err') {
          icon = 'times';
        }

        if(value[i].duration) {
          duration = ' (' + value[i].duration + 's)';
        }

        tempMarkup = tempMarkup + template.split('{{TRAVIS_URL}}').join(value[i].url);
        tempMarkup = tempMarkup.split('{{TRAVIS_ICON}}').join(icon);
        tempMarkup = tempMarkup.split('{{TRAVIS_STATE}}').join(value[i].status);
        tempMarkup = tempMarkup.split('{{TRAVIS_DURATION}}').join(duration);
        tempMarkup = tempMarkup.split('{{TRAVIS_DESCRIPTION}}').join(value[i].label);
      }
    }

    markup = markup.replace('{{TRAVIS_DYNAMIC}}', tempMarkup);

    return markup;
  };
})(typeof exports === 'undefined' ? this.Switchboard.spec.parsers : exports);
