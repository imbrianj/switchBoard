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
 * @fileoverview Execute Gerty commands based on weather.
 */

module.exports = (function () {
  'use strict';

  return {
    mood : function (state, command, celsius) {
      var util        = require(__dirname + '/../../lib/sharedUtil').util,
          excited     = 0,
          comfortable = 0,
          temp,
          weather;

      if ((state) && (state.value)) {
        temp    = parseInt(state.value.temp, 10);
        weather = parseInt(state.value.code, 10);

        if (celsius) {
          temp = parseInt(util.cToF(temp), 10);
        }

        // This is a good temperature range for me.
        if ((temp > 60) && (temp < 75)) {
          comfortable += 5;
        }

        // As it gets colder, I get less comfortable.
        else if (temp < 55) {
          comfortable += ((temp - 55) / 8);
        }

        // But as it gets hotter, I tend to get less comfortable faster.
        else if (temp > 80) {
          comfortable += ((80 - temp) / 3);
        }

        // All types of rain are a bum out.
        if (((weather > 8) && (weather < 14)) || (weather === 40)) {
          excited     += -1;
          comfortable += -2;
        }

        // ...but I like snow!
        if (((weather > 4) && (weather < 9)) || ((weather > 40) && (weather < 44)) || (weather === 46)) {
          excited = 5;
        }
      }

      return { excited : excited, comfortable : comfortable };
    }
  };
}());
