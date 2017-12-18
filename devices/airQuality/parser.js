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

  exports.airQuality = function (deviceId, markup, state, value, fragments) {
    var report      = fragments.report,
        graph       = fragments.graph,
        i           = 0,
        location    = '',
        tempMarkup  = '',
        graphMarkup = '',
        max;

    if (value) {
      location = value.location;

      for (i in value.report) {
        if (value.report.hasOwnProperty(i)) {
          graphMarkup = '';
          max         = value.report[i].max;

          if (max) {
            graphMarkup = graph.split('{{MAX_VALUE}}').join(max);
            graphMarkup = graphMarkup.split('{{PERCENT_QUALITY}}').join((value.report[i].value / max) * 100);
          }

          tempMarkup = tempMarkup + report.split('{{AIR_QUALITY_GRAPH}}').join(graphMarkup);
          tempMarkup = tempMarkup.split('{{AIR_QUALITY_TYPE}}').join(value.report[i].type);
          tempMarkup = tempMarkup.split('{{AIR_QUALITY_VALUE}}').join(value.report[i].value);
          tempMarkup = tempMarkup.split('{{AIR_QUALITY_UNITS}}').join(value.report[i].units);
        }
      }
    }

    markup = markup.replace('{{AIR_QUALITY_LOCATION}}', location);
    return markup.replace('{{AIR_QUALITY_DYNAMIC}}', tempMarkup);
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
