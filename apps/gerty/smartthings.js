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
 * @fileoverview Execute Gerty commands based on SmartThings interactions.
 */

module.exports = (function () {
  'use strict';

  return {
    mood : function (state) {
      var comfortable = 0,
          social      = 0,
          temp        = 0,
          temps       = 0,
          present     = 0,
          presence    = 0,
          device,
          deviceId;

      if ((state) && (state.value) && (state.value.mode)) {
        switch (state.value.mode) {
          case 'Home' :
            social += 1;
          break;

          case 'Away' :
            social -= 10;
          break;

          // If you're asleep, I'm assuming you're pretty comfortable.
          // This also will explicitly trigger the "SLEEP" emotion.
          case 'Night' :
            comfortable += 100;
          break;
        }

        for (deviceId in state.value.devices) {
          if (state.value.devices.hasOwnProperty(deviceId)) {
            device = state.value.devices[deviceId];

            if ((device.peripheral) && (device.peripheral.temp)) {
              temp  += parseInt(device.peripheral.temp, 10);
              temps += 1;
            }

            if (device.type === 'presence') {
              if (device.state === 'on') {
                present += 5;
              }

              else {
                present -= 5;
              }

              presence += 1;
            }
          }
        }
      }

      if (temps) {
        temp = temp / temps;

        // This is a good temperature range for me.
        if ((temp > 60) && (temp < 75)) {
          comfortable += 4;
        }

        // As it gets colder, I get less comfortable.
        else if (temp < 55) {
          comfortable += ((temp - 55) / 5);
        }

        // But as it gets hotter, I tend to get less comfortable faster.
        else if (temp > 80) {
          comfortable += ((80 - temp) / 3);
        }
      }

      if (present) {
        social += (present / presence);
      }

      return { social : social, comfortable : comfortable };
    }
  };
}());
