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

  exports.enviro = function (deviceId, markup, state, value, fragments) {
    var report      = fragments.report,
        graph       = fragments.graph,
        low         = fragments.low,
        optimum     = fragments.optimum,
        i           = 0,
        tempMarkup  = '',
        graphMarkup = '',
        lowVal,
        optimumVal,
        highVal,
        maxVal,
        percentVal;

    if (value) {
      for (i in value.report) {
        if (value.report.hasOwnProperty(i)) {
          graphMarkup = '';
          lowVal      = value.report[i].low;
          optimumVal  = value.report[i].optimum;
          highVal     = value.report[i].high;
          maxVal      = value.report[i].max;
          percentVal  = maxVal === undefined ? '' : Math.round((value.report[i].value / maxVal) * 100);

          if (!isNaN(maxVal)) {
            graphMarkup = graph.split('{{ENVIRO_LOW}}').join(lowVal);
            graphMarkup = graphMarkup.split('{{ENVIRO_OPTIMUM}}').join(optimumVal);
            graphMarkup = graphMarkup.split('{{ENVIRO_HIGH}}').join(highVal);
            graphMarkup = graphMarkup.split('{{ENVIRO_MAX}}').join(maxVal);
            graphMarkup = graphMarkup.split('{{PERCENT_QUALITY}}').join(percentVal);

            if (!isNaN(lowVal)) {
              graphMarkup = graphMarkup.split('{{LOW}}').join(low);
              graphMarkup = graphMarkup.split('{{ENVIRO_LOW}}').join(lowVal);
            }

            if (!isNaN(optimumVal)) {
              graphMarkup = graphMarkup.split('{{OPTIMUM}}').join(optimum);
              graphMarkup = graphMarkup.split('{{ENVIRO_OPTIMUM}}').join(optimumVal);
            }

            graphMarkup = graphMarkup.split('{{LOW}}').join('');
            graphMarkup = graphMarkup.split('{{OPTIMUM}}').join('');
          }

          tempMarkup = tempMarkup + report.split('{{ENVIRO_GRAPH}}').join(graphMarkup);
          tempMarkup = tempMarkup.split('{{ENVIRO_TYPE}}').join(value.report[i].type);
          tempMarkup = tempMarkup.split('{{ENVIRO_VALUE}}').join(value.report[i].value);
          tempMarkup = tempMarkup.split('{{ENVIRO_UNITS}}').join(value.report[i].units);
        }
      }
    }

    return markup.replace('{{ENVIRO_DYNAMIC}}', tempMarkup);
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
