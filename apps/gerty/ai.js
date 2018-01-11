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
    version : 20180109,

    /**
     * Take in a deviceId, command and set of controllers.  Determines if
     * there's reasonable intent for a given action and will notify or act on
     * that implied command.
     */
    findIntent : function (deviceId, command, controllers) {
      var config         = controllers.config,
          trainingWheels = config.ai.trainingWheels      || false,
          delay          = config.ai.executeDelaySeconds || 1;

      if (!config.ai.disable) {
        setTimeout(function() {
          var ai     = require(__dirname + '/../../lib/ai'),
              intent = ai.findActionConfidence(deviceId, command, config, controllers),
              runCommand,
              translate,
              tempDevice,
              utterance,
              i      = 0,
              j      = 0;

          if (intent.length) {
            runCommand = require(__dirname + '/../../lib/runCommand');

            for (tempDevice in controllers) {
              if ((tempDevice !== 'config') && (controllers[tempDevice].config.typeClass === 'gerty')) {
                translate  = require(__dirname + '/../../lib/translate');

                for (i; i < intent.length; i += 1) {
                  utterance = translate.translate('{{i18n_AI_INTENT}}', 'gerty', config.language).replace('{{INPUT}}', command).replace('{{CONFIDENCE}}', intent[i].confidence).replace('{{DEVICE}}', intent[i].subdevice).replace('{{COMMAND}}', intent[i].command);
                  runCommand.runCommand(tempDevice, 'text-' + utterance);
                }

                break;
              }
            }

            if (!trainingWheels) {
              for (j; j < intent.length; j += 1) {
                runCommand.runCommand(intent[j].device, 'subdevice-' + intent[j].subdevice + '-' + intent[j].command);
              }
            }
          }
        }, delay * 1000);
      }
    }
  };
}());
