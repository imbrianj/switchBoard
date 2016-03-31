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
 * @fileoverview If the API states that a Nest Protect smoke detector has gone
 *               off in any way (smoke, co or battery), we should raise the
 *               alarm via Desktop Notifications as well as any notification
 *               means defined in the config.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20151028,

    announceNest : function (device, command, controllers, values, config) {
      var runCommand  = require(__dirname + '/../lib/runCommand'),
          translate   = require(__dirname + '/../lib/translate'),
          notify      = require(__dirname + '/../lib/notify'),
          message     = '',
          tempMessage = '',
          subDevice,
          rawMacro,
          macro;

      if (values.protect) {
        for (subDevice in values.protect) {
          if (values.protect[subDevice].smoke !== 'ok') {
            tempMessage = translate.translate('{{i18n_SMOKE_DETECTED}}', 'nest', controllers.config.language).replace('{{LABEL}}', values.protect[subDevice].label);

            if (message) {
              message = message + ' ';
            }

            message = message + tempMessage;
          }

          if (values.protect[subDevice].co !== 'ok') {
            tempMessage = translate.translate('{{i18n_CO_DETECTED}}', 'nest', controllers.config.language).replace('{{LABEL}}', values.protect[subDevice].label);

            if (message) {
              message = message + ' ';
            }

            message = message + tempMessage;
          }
        }

        if (message) {
          notify.notify(message, controllers, device);

          // If you have a macro assigned to this specific Mode, we'll act upon
          // it.
          if (config.macro) {
            rawMacro = config.macro.split(';');

            for (macro in rawMacro) {
              runCommand.macroCommands(rawMacro[macro]);
            }
          }
        }
      }
    }
  };
}());
