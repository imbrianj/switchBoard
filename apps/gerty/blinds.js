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
 * @fileoverview Execute Gerty commands based on Blinds interactions.
 */

module.exports = (function () {
  'use strict';

  return {
    mood : function (state) {
      var entertained = 0,
          blind       = 0,
          blinds      = 0,
          device,
          i           = 0;

      if ((state) && (state.value) && (state.value.devices)) {
        for (i; i < state.value.devices.length; i += 1) {
          device = state.value.devices[i];

          if (device.percentage) {
            blind  += device.percentage;
            blinds += 1;
          }
        }
      }

      if (blinds) {
        // I like having the blinds open, usually.
        if (blind / blinds > 80) {
          entertained += 2;
        }
      }

      return { entertained : entertained };
    }
  };
}());
