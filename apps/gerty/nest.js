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
 * @fileoverview Execute Gerty commands based on Nest interactions.
 */

module.exports = (function () {
  'use strict';

  return {
    nest : function (state) {
      var comfortable = 0,
          social      = 0,
          scared      = 0,
          temp        = 0,
          temps       = 0,
          device,
          deviceId;

      if((state) && (state.value)) {
        switch(state.value.presence) {
          case 'on' :
            social += 1;
          break;

          case 'off' :
            social -= 5;
          break;
        }

        for(deviceId in state.value.devices) {
          device = state.value.devices[deviceId];

          if(device.temp) {
            temp  += device.temp;
            temps += 1;
          }

          if(device.type === 'protect') {
            if(device.battery !== 'ok') {
              comfortable -= 3;
            }

            if(device.co !== 'ok') {
              scared -= 10;
            }

            if(device.smoke !== 'ok') {
              scared -= 10;
            }
          }
        }
      }

      if(temps) {
        temp = temp / temps;

        // This is a good temperature range for me.
        if((temp > 60) && (temp < 75)) {
          comfortable += 4;
        }

        // As it gets colder, I get less comfortable.
        else if(temp < 55) {
          comfortable += ((temp - 55) / 5);
        }

        // But as it gets hotter, I tend to get less comfortable faster.
        else if(temp > 80) {
          comfortable += ((80 - temp) / 3);
        }
      }

      return { social : social, comfortable : comfortable, scared : scared };
    }
  };
}());
