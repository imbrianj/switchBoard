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
 * @fileoverview Execute Gerty commands based on air quality.
 */

module.exports = (function () {
  'use strict';

  return {
    mood : function (state) {
      var comfortable = 0,
          scared      = 0,
          i           = 0,
          type,
          value;

      if ((state) && (state.value) && (state.value.report)) {
        for (i; i < state.value.report.length; i += 1) {
          type  = state.value.report[i].type;
          value = state.value.report[i].value;

          switch (type) {
            case 'pm25' :
              if (value < 12) {
                comfortable += 1;
              }

              else if (value > 150) {
                comfortable -= 2;
                scared      += 2;
              }

              else if (value > 55) {
                comfortable -= 1;
                scared      += 1;
              }
            break;

            case 'no2' :
              if (value < 0.05) {
                comfortable += 1;
              }

              else if (value > 0.15) {
                comfortable -= 2;
                scared      += 2;
              }

              else if (value > 0.1) {
                comfortable -= 1;
                scared      += 1;
              }
            break;

            case 'co' :
              if (value < 9) {
                comfortable += 1;
              }

              else if (value > 24) {
                comfortable -= 1;
                scared      += 1;
              }
            break;
          }
        }
      }

      return { comfortable : comfortable, scared : scared };
    }
  };
}());
