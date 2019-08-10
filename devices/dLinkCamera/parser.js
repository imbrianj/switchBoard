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

  exports.dLinkCamera = function (deviceId, markup, state, value, fragments, language) {
    var photo           = fragments.photo,
        photos          = fragments.photos,
        video           = fragments.video,
        videos          = fragments.videos,
        thumb           = fragments.thumb,
        stateOn         = '',
        stateOff        = '',
        status          = '',
        arm,
        disarm,
        tempPhotoMarkup = '',
        tempVideoMarkup = '',
        photoList,
        photoListParent,
        videoList,
        videoListParent,
        thumbPath,
        i               = 0,
        j               = 0,
        translate       = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'dLinkCamera');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'dLinkCamera', language);
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

    if ((value.photos) && (value.photos.length)) {
      for (i; i < value.photos.length; i += 1) {
        tempPhotoMarkup = tempPhotoMarkup + photo.split('{{PHOTO_NAME}}').join(value.photos[i].name);
        tempPhotoMarkup = tempPhotoMarkup.split('{{PHOTO_URL}}').join(value.photos[i].photo);
      }

      tempPhotoMarkup = tempPhotoMarkup.split('{{PHOTO}}').join(translate('PHOTO'));
      tempPhotoMarkup = tempPhotoMarkup.split('{{DEVICE_ID}}').join(deviceId);
      tempPhotoMarkup = photos.split('{{DLINKCAMERA_PHOTOS}}').join(tempPhotoMarkup);

      markup = markup.split('{{DLINKCAMERA_PHOTO_LIST}}').join(tempPhotoMarkup);
    }

    markup = markup.split('{{DLINKCAMERA_PHOTO_LIST}}').join('');

    if ((value.videos) && (value.videos.length)) {
      for (j; j < value.videos.length; j += 1) {
        thumbPath = value.videos[j].thumb || '';

        if (thumbPath) {
          tempVideoMarkup = tempVideoMarkup.split('{{VIDEO_THUMB}}').join(thumb);
          tempVideoMarkup = tempVideoMarkup.split('{{THUMB_URL}}').join(thumbPath);
        }

        tempVideoMarkup = tempVideoMarkup + video.split('{{VIDEO_NAME}}').join(value.videos[j].name);
        tempVideoMarkup = tempVideoMarkup.split('{{SCREEN_URL}}').join(value.videos[j].screen);
        tempVideoMarkup = tempVideoMarkup.split('{{VIDEO_URL}}').join(value.videos[j].video);
      }

      tempVideoMarkup = tempVideoMarkup.split('{{VIDEO_THUMB}}').join('');
      tempVideoMarkup = tempVideoMarkup.split('{{SCREENSHOT}}').join(translate('SCREENSHOT'));
      tempVideoMarkup = tempVideoMarkup.split('{{THUMBNAIL}}').join(translate('THUMBNAIL'));
      tempVideoMarkup = tempVideoMarkup.split('{{VIDEO}}').join(translate('VIDEO'));
      tempVideoMarkup = tempVideoMarkup.split('{{DEVICE_ID}}').join(deviceId);
      tempVideoMarkup = videos.split('{{DLINKCAMERA_VIDEOS}}').join(tempVideoMarkup);

      markup = markup.split('{{DLINKCAMERA_VIDEO_LIST}}').join(tempVideoMarkup);
    }

    markup = markup.split('{{DLINKCAMERA_VIDEO_LIST}}').join('');

    if (typeof SB === 'object') {
      photoListParent = SB.getByClass('image-list', SB.get(deviceId), 'div')[0];
      photoList       = SB.getByTag('ol', photoListParent)[0];
      videoListParent = SB.getByClass('video-list', SB.get(deviceId), 'div')[0];
      videoList       = SB.getByTag('ol', videoListParent)[0];

      if (SB.hasClass(SB.getByClass('selected', null, 'li')[0], deviceId)) {
        markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('src');
      }

      markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
      markup = markup.split('{{LAZY_PLACEHOLDER_IMAGE}}').join('data-placeholder-image');

      arm    = SB.getByClass('fa-lock',   SB.get(deviceId), 'a')[0];
      disarm = SB.getByClass('fa-unlock', SB.get(deviceId), 'a')[0];

      if ((photoList) && (tempPhotoMarkup !== photoList.outerHTML)) {
        photoListParent.removeChild(photoList);
      }

      if ((value.photos) && ((!photoList) || (tempPhotoMarkup !== photoList.outerHTML))) {
        // Since this markup is explicitly inserted via the parser, we'll also
        // have to explicitly set the lazyload property.
        if (SB.hasClass(SB.getByClass('selected', null, 'li')[0], deviceId)) {
          tempPhotoMarkup = tempPhotoMarkup.split('{{LAZY_LOAD_IMAGE}}').join('src');
          tempPhotoMarkup = tempPhotoMarkup.split('{{LAZY_PLACEHOLDER_IMAGE}}').join('data-placeholder-src');
        }

        else {
          tempPhotoMarkup = tempPhotoMarkup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
          tempPhotoMarkup = tempPhotoMarkup.split('{{LAZY_PLACEHOLDER_IMAGE}}').join('src');
        }

        photoListParent.innerHTML = tempPhotoMarkup;
      }

      if ((videoList) && (tempVideoMarkup !== videoList.outerHTML)) {
        videoListParent.removeChild(videoList);
      }

      if ((value.videos) && ((!videoList) || (tempVideoMarkup !== videoList.outerHTML))) {
        // Since this markup is explicitly inserted via the parser, we'll also
        // have to explicitly set the lazyload property.
        if (SB.hasClass(SB.getByClass('selected', null, 'li')[0], deviceId)) {
          tempVideoMarkup = tempVideoMarkup.split('{{LAZY_LOAD_IMAGE}}').join('src');
          tempVideoMarkup = tempVideoMarkup.split('{{LAZY_PLACEHOLDER_IMAGE}}').join('data-placeholder-src');
        }

        else {
          tempVideoMarkup = tempVideoMarkup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
          tempVideoMarkup = tempVideoMarkup.split('{{LAZY_PLACEHOLDER_IMAGE}}').join('src');
        }

        videoListParent.innerHTML = tempVideoMarkup;
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
