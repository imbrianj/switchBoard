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
 * @fileoverview If a presence sensor doesn't go "away" for a specified amount
 *               of time, send a notification.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20180612,

    lastEvent : {},

    dogWalkReminder : function (deviceId, command, controllers, values, config) {
      var dogName      = config.dogName,
          delayMinutes = config.delay || 600,
          that         = this,
          timestamp,
          notify,
          translate;

      if (command === 'subdevice-state-presence-' + dogName + '-off') {
        this.lastEvent[dogName] = new Date().getTime();
      }

      else if (command === 'subdevice-state-presence-' + dogName + '-on') {
        timestamp = new Date().getTime();
        this.lastEvent[dogName] = timestamp;

        setTimeout(function (timestamp) {
          var message = '';

          if (that.lastEvent[dogName] === timestamp) {
            notify    = require(__dirname + '/../lib/notify');
            translate = require(__dirname + '/../lib/translate');

            message = translate.translate('{{i18n_DOG_WALK}}', 'smartthings', controllers.config.language);
            message = message.split('{{DOG_NAME}}').join(dogName);
            message = message.split('{{MINUTES}}').join(delayMinutes);

            notify.notify(message, controllers, deviceId);
          }
        }, delayMinutes * 60000, timestamp);
      }
    }
  };
}());
