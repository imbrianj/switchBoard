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
 * @fileoverview Gerty methods related to finding intended actions based on
 *               basic machine learning.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20170918,

    /**
     * Take in a typeClass and return the type of device it's categorized as.
     */
    findIntent : function (deviceId, command, controllers) {
      var ai,
          config = controllers.config,
          intent,
          runCommand,
          translate,
          tempDevice,
          utterance,
          i      = 0;

      if (!config.ai.disable) {
        ai     = require(__dirname + '/../../lib/ai');
        intent = ai.findActionConfidence(deviceId, command, config, controllers);

        if (intent.length) {
          for (tempDevice in controllers) {
            if ((tempDevice !== 'config') && (controllers[tempDevice].config.typeClass === 'gerty')) {
              runCommand = require(__dirname + '/../../lib/runCommand');
              translate  = require(__dirname + '/../../lib/translate');

              for (i; i < intent.length; i += 1) {
                utterance = translate.translate('{{i18n_AI_INTENT}}', 'gerty', config.language).replace('{{CONFIDENCE}}', intent[i].confidence).replace('{{DEVICE}}', intent[i].subdevice).replace('{{COMMAND}}', intent[i].command);
                runCommand.runCommand(tempDevice, 'text-' + utterance);
              }

              // Eventually fired intent should note that this was an AI command,
              // so the intended event doesn't cascade to others (?)
              break;
            }
          }
        }
      }
    }
  };
}());
