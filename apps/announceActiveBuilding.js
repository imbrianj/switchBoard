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
 * @fileoverview If the latest build is failing, send a Desktop Notification.
 *               As build failures are not always terrible (such as a pending
 *               pull request), we don't want to send an annoying notification
 *               via SMS, push or text.
 */

module.exports = (function () {
  'use strict';

  var ActiveBuildingPackages = {};

  return {
    version : 20150613,

    translate : function(token, lang) {
      var translate = require(__dirname + '/../lib/translate');

      return translate.translate('{{i18n_' + token + '}}', 'activeBuilding', lang);
    },

    announceActiveBuilding : function(device, command, controllers, values, config) {
      var deviceState         = require(__dirname + '/../lib/deviceState'),
          activeBuildingState = deviceState.getDeviceState(device),
          notify,
          runCommand,
          lang                = controllers.config.language,
          senders             = '',
          message             = '',
          i                   = 0,
          packages            = [],
          deviceId;

      if((values) && (values.value)) {
        packages = values.value;

        if(JSON.stringify(ActiveBuildingPackages[device]) !== JSON.stringify(packages)) {
          for(i; i < values.value.length; i += 1) {
            if(i) {
              if (i === (values.value.length - 1)) {
                senders = senders + ' ' + this.translate('AND', lang) + ' ';
              }

              else {
                senders = senders + ', ';
              }
            }

            senders = senders + values.value[i];
          }

          if(senders) {
            ActiveBuildingPackages[device] = packages;

            notify     = require(__dirname + '/../lib/notify');
            runCommand = require(__dirname + '/../lib/runCommand');

            if(i === 1) {
              message = this.translate('SINGLE_PACKAGE', lang);
            }

            else if(i > 1) {
              message = this.translate('PLURAL_PACKAGES', lang);
            }

            message = message.split('{{SENDERS}}').join(senders);

            notify.sendNotification(null, message, device);
            notify.notify(message, controllers);
          }
        }
      }
    }
  };
}());
