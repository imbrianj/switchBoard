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

/**
 * @author brian@bevey.org
 * @fileoverview Execute Gerty commands based on stocks.
 */

module.exports = (function () {
  'use strict';

  return {
    stocks : function (state) {
      var excited = 0,
          scared  = 0,
          stock,
          change  = 0,
          i       = 0;

      if ((state) && (state.value)) {
        // Collect an average of all current sotck movement for the day.
        for (stock in state.value) {
          if (state.value[stock].dayChangePercent) {
            change += parseFloat(state.value[stock].dayChangePercent.replace('%', ''));
            i      += 1;
          }
        }

        if (i) {
          excited = change / i;

          if (excited < 0) {
            scared = excited;
          }

          // We'll limit the amount of excitement (or lack thereof).
          if (excited > 5) {
            excited = 5;
          }

          else if (excited < -5) {
            excited = -5;
            scared  = -5;
          }
        }
      }

      return { excited : excited, scared : scared };
    }
  };
}());
