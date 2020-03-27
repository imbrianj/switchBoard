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

  exports.geiger = function (deviceId, markup, state, value, fragments, language) {
    var report      = fragments.report,
        graph       = fragments.graph,
        tempMarkup  = '',
        graphMarkup = '',
        reported,
        i           = 0,
        translate   = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'geiger');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'geiger', language);
          }

          return message;
        },
        displayTime = function (unix) {
          var util,
              time;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            time = SB.util.displayTime(unix, translate);
          }

          else {
            util = require(__dirname + '/../../lib/sharedUtil').util;
            time = util.displayTime(unix, translate);
          }

          return time;
        },
        machineTime = function (unix) {
          var date = new Date(unix);

          return date.toISOString ? date.toISOString() : unix;
        };

    if (value && value.report && value.report[0]) {
      for (i; i < value.report[0].length; i += 1) {
        reported = value.report[0][i];
        graphMarkup = '';

        if (reported.max) {
          graphMarkup = graph.split('{{MAX_VALUE}}').join(reported.max);
          graphMarkup = graphMarkup.split('{{PERCENT_QUALITY}}').join(Math.round((reported.value / reported.max) * 100));
        }

        markup = markup.split('{{GEIGER_TIME}}').join(displayTime(reported.time));
        markup = markup.split('{{GEIGER_TIMESTAMP}}').join(machineTime(reported.time));

        tempMarkup = tempMarkup + report.split('{{GEIGER_GRAPH}}').join(graphMarkup);
        tempMarkup = tempMarkup.split('{{GEIGER_TYPE}}').join(reported.type);
        tempMarkup = tempMarkup.split('{{GEIGER_VALUE}}').join(reported.value);
        tempMarkup = tempMarkup.split('{{GEIGER_UNITS}}').join(reported.units);
        tempMarkup = tempMarkup.split('{{GEIGER_HIGH}}').join(reported.high);
      }
    }

    return markup.replace('{{GEIGER_DYNAMIC}}', tempMarkup);
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
