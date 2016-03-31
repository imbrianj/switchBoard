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

  exports.foscam = function (deviceId, markup, state, value, language) {
    var stateOn   = '',
        stateOff  = '',
        status    = '',
        arm,
        disarm,
        translate = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'foscam');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'foscam', language);
          }

          return message;
        };

    if (value === 'on') {
      stateOn = ' device-active';
      status  = translate('CAMERA_ARMED');
    }

    else if (value === 'off') {
      stateOff = ' device-active';
      status   = translate('CAMERA_DISARMED');
    }

    markup = markup.split('{{DEVICE_STATE_ON}}').join(stateOn);
    markup = markup.split('{{DEVICE_STATE_OFF}}').join(stateOff);
    markup = markup.split('{{ARMED_STATUS}}').join(status);
    markup = markup.split('{{DISARMED_STATUS}}').join(status);

    if (typeof SB === 'object') {
      arm    = SB.getByClass('fa-lock',   SB.get(deviceId), 'a')[0];
      disarm = SB.getByClass('fa-unlock', SB.get(deviceId), 'a')[0];

      if ((value === 'on') && (!SB.hasClass(arm, 'device-on'))) {
        SB.addClass(arm,       'device-active');
        SB.removeClass(disarm, 'device-active');
        SB.putText(SB.getByTag('em', arm)[0],    status);
        SB.putText(SB.getByTag('em', disarm)[0], status);
        markup = '';
      }

      else if ((value === 'off') && (!SB.hasClass(disarm, 'device-on'))) {
        SB.addClass(disarm, 'device-active');
        SB.removeClass(arm, 'device-active');
        SB.putText(SB.getByTag('em', arm)[0],    status);
        SB.putText(SB.getByTag('em', disarm)[0], status);
        markup = '';
      }

      else {
        if (SB.hasClass(SB.getByClass('selected', null, 'li')[0], deviceId)) {
          markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('src');
        }

        else {
          markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
        }
      }
    }

    return markup;
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
