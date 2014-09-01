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
 * @fileoverview Simple script to fire for each scheduled interval.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140901,

    /**
     * If moisture is detected (such as a laundry room or basement flood), or
     * a person's arrival or departure, notify via appropriate means.  If
     * someone comes home, also disarm the Foscam and point it in a safe
     * direction, if one is available.
     */
    fire : function(device, command, controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          translate  = require(__dirname + '/../lib/translate'),
          notify,
          value,
          message,
          deviceId;

      if(command.indexOf('subdevice-state-moisture-') === 0) {
        command = command.split('subdevice-state-moisture-').join('');
        value   = command.split('-');
        command = value[0];
        value   = value[1];

        if(value === 'on') {
          message = translate.translate('{{i18n_WATER_DETECTED}}', 'smartthings', controllers.config.language).replace('{{LABEL}}', command);
        }
      }

      else if(command.indexOf('subdevice-state-presence-') === 0) {
        command = command.split('subdevice-state-presence-').join('');
        value   = command.split('-');
        command = value[0];
        value   = value[1];

        if(value === 'on') {
          message = translate.translate('{{i18n_ARRIVED}}', 'smartthings', controllers.config.language).replace('{{LABEL}}', command);
        }

        else if(value === 'off') {
          message = translate.translate('{{i18n_LEFT}}', 'smartthings', controllers.config.language).replace('{{LABEL}}', command);
        }
      }

      if(message) {
        notify = require(__dirname + '/../lib/notify');

        notify.sendNotification(null, message, device);

        for(deviceId in controllers) {
          if(deviceId !== 'config') {
            if(controllers[deviceId].config.typeClass === 'speech') {
              runCommand.runCommand(deviceId, 'text-' + message, device);
            }

            else if((value === 'on') && (controllers[deviceId].config.typeClass === 'foscam')) {
              runCommand.runCommand(deviceId, 'ALARM_OFF', deviceId);
              runCommand.runCommand(deviceId, 'PRESET3',  device);
            }
          }
        }
      }
    },

    /**
     * On long interval, poll the SmartThings API just to sync state.  This is
     * largely unnecessary, as state is sent through normal use via API
     * callbacks, but this will ensure things are current.
     */
    poll : function(deviceId, command, controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          controller = controllers[deviceId];

      if((controller.config.auth) && (controller.config.auth.url)) {
        runCommand.runCommand(deviceId, 'list', deviceId, false);
      }
    }
  };
}());
