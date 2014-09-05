/*jslint white: true */
/*global module, console, require */

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

(function(exports){
  'use strict';

  exports.foscam = function (deviceId, markup, state, value, language) {
    var stateOn   = '',
        stateOff  = '',
        status    = '',
        arm,
        disarm,
        translate = function(message) {
          var util;

          if(typeof Switchboard === 'object') {
            message = Switchboard.util.translate(message, 'foscam');
          }

          else {
            util    = require(__dirname + '/../lib/sharedUtil').util;
            message = util.translate(message, 'foscam', language);
          }

          return message;
        };

    if(value === 'on') {
      stateOn = ' device-active';
      status  = translate('CAMERA_ARMED');
    }

    else if(value === 'off') {
      stateOff = ' device-active';
      status   = translate('CAMERA_DISARMED');
    }

    markup = markup.replace('{{DEVICE_STATE_ON}}',  stateOn);
    markup = markup.replace('{{DEVICE_STATE_OFF}}', stateOff);
    markup = markup.replace('{{ARMED_STATUS}}',     status);
    markup = markup.replace('{{DISARMED_STATUS}}',  status);

    if(typeof Switchboard === 'object') {
      arm    = Switchboard.getByClass('fa-lock',   Switchboard.get(deviceId), 'a')[0];
      disarm = Switchboard.getByClass('fa-unlock', Switchboard.get(deviceId), 'a')[0];

      if((value === 'on') && (!Switchboard.hasClass(arm, 'device-on'))) {
        Switchboard.addClass(arm,       'device-active');
        Switchboard.removeClass(disarm, 'device-active');
        Switchboard.putText(Switchboard.getByTag('em', arm)[0],    status);
        Switchboard.putText(Switchboard.getByTag('em', disarm)[0], status);
        markup = '';
      }

      else if((value === 'off') && (!Switchboard.hasClass(disarm, 'device-on'))) {
        Switchboard.addClass(disarm, 'device-active');
        Switchboard.removeClass(arm, 'device-active');
        Switchboard.putText(Switchboard.getByTag('em', arm)[0],    status);
        Switchboard.putText(Switchboard.getByTag('em', disarm)[0], status);
        markup = '';
      }

      else {
        if(Switchboard.hasClass(Switchboard.getByClass('selected', null, 'li')[0], deviceId)) {
          markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('src');
        }

        else {
          markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
        }
      }
    }

    return markup;
  };
})(typeof exports === 'undefined' ? this.Switchboard.parsers : exports);
