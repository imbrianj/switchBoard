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

  exports.piHole = function (deviceId, markup, state, value) {
    var now                 = new Date().getTime(),
        displayRelativeTime = function (milliseconds) {
          var util,
              time;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            time = SB.util.displayRelativeTime(milliseconds);
          }

          else {
            util = require(__dirname + '/../../lib/sharedUtil').util;
            time = util.displayRelativeTime(milliseconds);
          }

          return time;
        };

    value  = value || {};

    markup = markup.replace('{{PIHOLE_UPDATE}}',                value.lastUpdate ? displayRelativeTime((now - value.lastUpdate) / 1000) : '');
    markup = markup.replace('{{PIHOLE_QUERIES_TODAY}}',         value.queriesToday        || '');
    markup = markup.replace('{{PIHOLE_QUERIES_BLOCKED_TODAY}}', value.queriesBlockedToday || '');
    markup = markup.replace('{{PIHOLE_PERCENT_BLOCKED_TODAY}}', value.percentBlockedToday || '');
    markup = markup.replace('{{PIHOLE_DOMAINS_BLOCKED}}',       value.domainsBlocked      || '');

    return markup;
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
