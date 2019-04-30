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

  exports.debug = function (deviceId, markup, state, value, fragments, language) {
    var now                 = new Date().getTime(),
        uptime              = '',
        runtime             = '',
        memoryUsed          = 0,
        systemMemory        = 0,
        memoryPercent       = 0,
        cpuLoad             = 0,
        clientCount         = 0,
        translate           = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'debug');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'debug', language);
          }

          return message;
        },
        displayTime         = function (unix) {
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
        displayRelativeTime = function (milliseconds) {
          var seconds = milliseconds / 1000,
              util,
              time;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            time = SB.util.displayRelativeTime(seconds);
          }

          else {
            util = require(__dirname + '/../../lib/sharedUtil').util;
            time = util.displayRelativeTime(seconds);
          }

          return time;
        },
        temperature         = translate ('NA');

    if (value) {
      uptime        = displayRelativeTime(value.uptime);
      runtime       = displayRelativeTime(now - value.startup);
      memoryUsed    = value.memoryUsed;
      systemMemory  = value.totalMemory;
      memoryPercent = value.percentMemory;
      cpuLoad       = Math.round(value.cpuLoad[0] * 100);
      clientCount   = value.clientCount;
      temperature   = value.temperature ? value.temperature : temperature;
    }

    markup = markup.replace('{{DEBUG_UPDATE}}',         displayTime(now));
    markup = markup.replace('{{DEBUG_UPTIME}}',         uptime);
    markup = markup.replace('{{DEBUG_RUNTIME}}',        runtime);
    markup = markup.replace('{{DEBUG_MEMORY_USED}}',    memoryUsed);
    markup = markup.replace('{{DEBUG_SYSTEM_MEMORY}}',  systemMemory);
    markup = markup.replace('{{DEBUG_MEMORY_PERCENT}}', memoryPercent);
    markup = markup.replace('{{DEBUG_CPU}}',            cpuLoad);
    markup = markup.replace('{{DEBUG_CLIENT_TEMP}}',    temperature);
    markup = markup.replace('{{DEBUG_CLIENT_COUNT}}',   clientCount);

    return markup;
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
