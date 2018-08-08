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

  exports.powerView = function (deviceId, markup, state, value, fragments, language) {
    var templateBlind  = fragments.blind,
        templateBlinds = fragments.blinds,
        templateScene  = fragments.scene,
        templateScenes = fragments.scenes,
        blindsMarkup   = '',
        scenesMarkup   = '',
        i              = 0,
        j              = 0,
        device,
        scene,
        encodeName     = function (name) {
          var util;

          if (typeof SB === 'object') {
            name = SB.util.encodeName(name);
          }

          else {
            util = require(__dirname + '/../../lib/sharedUtil').util;
            name = util.encodeName(name);
          }

          return name;
        },
        translate      = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'powerView');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'powerView', language);
          }

          return message;
        };

    if ((value) && (value.devices)) {
      for (i; i < value.devices.length; i += 1) {
        device = value.devices[i];

        blindsMarkup += templateBlind.split('{{SUB_DEVICE_ID}}').join(encodeName(device.label));
        blindsMarkup  = blindsMarkup.split('{{SUB_DEVICE_PERCENTAGE}}').join(device.percentage);
        blindsMarkup  = blindsMarkup.split('{{SUB_DEVICE_STATE_CLASS}}').join(device.battery && device.battery < 10 ? 'peripheral batt' : '');
        blindsMarkup  = blindsMarkup.split('{{SUB_DEVICE_STATE}}').join(device.battery ? ' (' + device.battery + '%)' : '');
        blindsMarkup  = blindsMarkup.split('{{SUB_DEVICE_NAME}}').join(device.label);
      }

      blindsMarkup = blindsMarkup.split('{{i18n_SET_PERCENTAGE}}').join(translate('SET_PERCENTAGE'));
      blindsMarkup = templateBlinds.split('{{POWERVIEW_BLINDS}}').join(blindsMarkup);

      if (value.scenes.length) {
        for (j; j < value.scenes.length; j += 1) {
          scene = value.scenes[j];

          scenesMarkup += templateScene.split('{{SCENE_NAME_COMMAND}}').join(scene.name);
          scenesMarkup  = scenesMarkup.split('{{SCENE_NAME}}').join(scene.name);
          scenesMarkup  = scenesMarkup.split('{{SCENE_ICON}}').join(scene.icon);
        }

        scenesMarkup = templateScenes.split('{{POWERVIEW_SCENES}}').join(scenesMarkup);
      }
    }

    markup = markup.split('{{POWERVIEW_DYNAMIC}}').join(blindsMarkup + scenesMarkup);

    return markup;
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
