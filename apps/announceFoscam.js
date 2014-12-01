/*jslint white: true */
/*global State, module, require, console */

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
    version : 20141130,

    /**
     * When the foscam is armed or disarmed, we want to wait a very short time
     * to allow the new setting to be registered on the device - then grab the
     * new state instead of waiting for the next scheduled state.
     *
     * If you have a speech controller set up, give a verbal confirmation that
     * the camera has been armed or disarmed.
     */
    announceFoscam : function(device, command, controllers, values) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          translate  = require(__dirname + '/../lib/translate'),
          message    = '',
          deviceId;

      if((command === 'ALARM_ON') || (command === 'ALARM_OFF')) {
        for(deviceId in controllers) {
          if(deviceId !== 'config') {
            if(command === 'ALARM_ON') {
              message = translate.translate('{{i18n_CAMERA_ARMED}}', 'foscam', controllers.config.language);
            }

            else if(command === 'ALARM_OFF') {
              message = translate.translate('{{i18n_CAMERA_DISARMED}}', 'foscam', controllers.config.language);
            }

            runCommand.runCommand(deviceId, 'text-' + message);
          }
        }
      }
    }
  };
}());
