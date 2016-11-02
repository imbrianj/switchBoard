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

  exports.foscam = function (deviceId, markup, state, value, fragments, language) {
    var video      = fragments.video,
        videos     = fragments.videos,
        stateOn    = '',
        stateOff   = '',
        status     = '',
        arm,
        disarm,
        videoList,
        tempMarkup = '',
        i          = 0,
        translate  = function (message) {
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

    value = value || {};

    if (value.alarm === 'on') {
      stateOn = ' device-active';
      status  = translate('CAMERA_ARMED');
    }

    else if (value.alarm === 'off') {
      stateOff = ' device-active';
      status   = translate('CAMERA_DISARMED');
    }

    markup = markup.split('{{DEVICE_STATE_ON}}').join(stateOn);
    markup = markup.split('{{DEVICE_STATE_OFF}}').join(stateOff);
    markup = markup.split('{{ARMED_STATUS}}').join(status);
    markup = markup.split('{{DISARMED_STATUS}}').join(status);

    markup = markup.split('{{SCREENSHOT}}').join(translate('SCREENSHOT'));
    markup = markup.split('{{THUMBNAIL}}').join(translate('THUMBNAIL'));
    markup = markup.split('{{VIDEO}}').join(translate('VIDEO'));

    if (value.videos) {
      for (i; i < value.videos.length; i += 1) {
        tempMarkup = tempMarkup + video.split('{{VIDEO_NAME}}').join(value.videos[i].name);
        tempMarkup = tempMarkup.split('{{SCREEN_URL}}').join(value.videos[i].screen);
        tempMarkup = tempMarkup.split('{{THUMB_URL}}').join(value.videos[i].thumb);
        tempMarkup = tempMarkup.split('{{VIDEO_URL}}').join(value.videos[i].video);
      }

      tempMarkup = tempMarkup.split('{{SCREENSHOT}}').join(translate('SCREENSHOT'));
      tempMarkup = tempMarkup.split('{{THUMBNAIL}}').join(translate('THUMBNAIL'));
      tempMarkup = tempMarkup.split('{{VIDEO}}').join(translate('VIDEO'));
      tempMarkup = videos.split('{{FOSCAM_VIDEOS}}').join(tempMarkup);
    }

    markup = markup.split('{{FOSCAM_DYNAMIC}}').join(tempMarkup);

    if (typeof SB === 'object') {
      if (SB.hasClass(SB.getByClass('selected', null, 'li')[0], deviceId)) {
        tempMarkup = tempMarkup.split('{{LAZY_LOAD_IMAGE}}').join('src');
        markup     = markup.split('{{LAZY_LOAD_IMAGE}}').join('src');
      }

      else {
        markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
      }

      arm       = SB.getByClass('fa-lock',   SB.get(deviceId), 'a')[0];
      disarm    = SB.getByClass('fa-unlock', SB.get(deviceId), 'a')[0];
      videoList = SB.getByClass('videoList', SB.get(deviceId), 'ol')[0] || {};

      if (tempMarkup !== videoList.outerHTML) {
        videoList.outerHTML = tempMarkup;
      }

      if ((value.alarm === 'on') && (!SB.hasClass(arm, 'device-on'))) {
        SB.addClass(arm,       'device-active');
        SB.removeClass(disarm, 'device-active');
        SB.putText(SB.getByTag('em', arm)[0],    status);
        SB.putText(SB.getByTag('em', disarm)[0], status);
        markup = '';
      }

      else if ((value.alarm === 'off') && (!SB.hasClass(disarm, 'device-on'))) {
        SB.addClass(disarm, 'device-active');
        SB.removeClass(arm, 'device-active');
        SB.putText(SB.getByTag('em', arm)[0],    status);
        SB.putText(SB.getByTag('em', disarm)[0], status);
        markup = '';
      }
    }

    return markup;
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
