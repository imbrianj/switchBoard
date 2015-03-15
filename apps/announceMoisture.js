/*jslint white: true */
/*global module, require, console */

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
 * @fileoverview Announce and push notification when a SmartThings moisture
 *               sensor has gone off.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20150314,

    announceMoisture : function(device, command, controllers, values, config) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          translate  = require(__dirname + '/../lib/translate'),
          notify     = require(__dirname + '/../lib/notify'),
          message    = '',
          value,
          deviceId;

      if(command.indexOf('subdevice-state-moisture-') === 0) {
        command = command.split('subdevice-state-moisture-').join('');
        value   = command.split('-');
        command = value[0];
        value   = value[1];

        if(value === 'on') {
          message = translate.translate('{{i18n_WATER_DETECTED}}', 'smartthings', controllers.config.language).replace('{{LABEL}}', command);
        }

        notify.sendNotification(null, message, device);

        if(message) {
          for(deviceId in controllers) {
            if(deviceId !== 'config') {
              runCommand.runCommand(deviceId, 'text-' + message);
            }
          }
        }
      }
    }
  };
}());
