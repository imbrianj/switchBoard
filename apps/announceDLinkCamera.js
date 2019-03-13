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
 * @fileoverview Announce when the camera is armed.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20190312,

    announceDLinkCamera : function (deviceId, command, controllers) {
      var translate    = require(__dirname + '/../lib/translate'),
          deviceState  = require(__dirname + '/../lib/deviceState'),
          notify       = require(__dirname + '/../lib/notify'),
          currentState = deviceState.getDeviceState(deviceId),
          message      = '';

      if ((currentState) && (currentState.value)) {
        if ((command === 'ALARM_ON') || (command === 'ALARM_OFF')) {
          if ((command === 'ALARM_ON') && (currentState.value.alarm === 'off')) {
            message = translate.translate('{{i18n_CAMERA_ARMED}}', 'dLinkCamera', controllers.config.language);
          }

          else if ((command === 'ALARM_OFF') && (currentState.value.alarm === 'on')) {
            message = translate.translate('{{i18n_CAMERA_DISARMED}}', 'dLinkCamera', controllers.config.language);
          }

          if (message) {
            notify.notify(message.split('{{CAMERA}}').join(controllers[deviceId].config.title), controllers, deviceId);
          }
        }
      }
    }
  };
}());
