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

  exports.neato = function (deviceId, markup, state, value, fragments, language) {
    var batteryClass = 'empty',
        batteryValue = 0,
        charging     = false,
        docked       = false,
        dockedToken  = 'UNDOCKED',
        translate    = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'neato');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'neato', language);
          }

          return message;
        };

    if (value) {
      batteryValue = value.battery;
      charging     = value.charging;
      docked       = value.docked;
      dockedToken  = docked ? 'DOCKED' : 'UNDOCKED';

      if (batteryValue > 25) {
        batteryClass = 'quarter';
      }

      if (batteryValue > 50) {
        batteryClass = 'half';
      }

      if (batteryValue > 75) {
        batteryClass = 'three-quarters';
      }

      if (batteryValue > 97) {
        batteryClass = 'full';
      }
    }

    markup = markup.split('{{DEVICE_BATTERY_LEVEL}}').join(batteryValue + '%');
    markup = markup.split('{{DEVICE_STATE_BATTERY_CLASS}}').join(batteryClass);
    markup = markup.split('{{DEVICE_STATE_CHARGING}}').join(charging ? ' device-active' : '');
    markup = markup.split('{{DOCK_STATUS}}').join(translate(dockedToken));

    return markup;
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
