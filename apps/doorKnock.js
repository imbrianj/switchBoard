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
 * @fileoverview When a vibration sensor is triggered - and a contact sensor is
 *               not triggered within a given interval, notify that someone is
 *               knocking on a door.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20161101,

    lastEvents : { knock : 0, open : 0, close: 0 },

    doorKnock : function (deviceId, command, controllers, values, config) {
      var now   = new Date().getTime(),
          delay = (config.delay || 5) * 1000,
          that  = this;

      if (command === 'subdevice-state-vibrate-' + config.vibrate + '-on') {
        this.lastEvents.knock = now;
      }

      else if (command === 'subdevice-state-contact-' + config.contact + '-on') {
        this.lastEvents.open = now;
      }

      else if (command === 'subdevice-state-contact-' + config.contact + '-off') {
        this.lastEvents.close = now;
      }

      if (now === this.lastEvents.knock) {
        setTimeout(function () {
          var notify     = require(__dirname + '/../lib/notify'),
              translate  = require(__dirname + '/../lib/translate'),
              runCommand = require(__dirname + '/../lib/runCommand'),
              message    = '',
              currDevice;

          if ((that.lastEvents.open <= that.lastEvents.close) &&
              (Math.abs(that.lastEvents.knock - that.lastEvents.open)  > delay) &&
              (Math.abs(that.lastEvents.knock - that.lastEvents.close) > delay)) {
            message = translate.translate('{{i18n_DOOR_KNOCK}}', 'smartthings', controllers.config.language).split('{{LABEL}}').join(config.contact);

            notify.notify(message, controllers, deviceId);

            for (currDevice in controllers) {
              if ((controllers[currDevice].config) && ((controllers[currDevice].config.typeClass === 'mp3') || (controllers[currDevice].config.typeClass === 'clientMp3'))) {
                runCommand.runCommand(currDevice, 'text-doorbell');
              }
            }
          }
        }, delay);
      }
    }
  };
}());
