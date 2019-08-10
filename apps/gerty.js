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
 * @fileoverview Execute Gerty commands.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20180207,

    gerty : function (deviceId, command, controllers, values, config, appParams) {
      var translate        = require(__dirname + '/../lib/translate'),
          gertyRunCommand  = require(__dirname + '/gerty/runCommand'),
          gertyMood        = require(__dirname + '/gerty/mood'),
          gertyAI,
          announceString   = translate.translate('{{i18n_ANNOUNCE}}', 'gerty', controllers.config.language),
          utterance        = translate.findSynonyms('gerty', controllers.config.language),
          deviceConfig     = ((controllers[deviceId]) && (controllers[deviceId].config)) || {},
          ignoreNegative   = deviceConfig.ignoreNegative,
          text             = '',
          acted            = false,
          getCorrectedText = function (text) {
            var textParts = text.split(' '),
                i         = 0;

            for (i; i < textParts.length; i += 1) {
              if ((textParts[i]) && (!isNaN(textParts[i])) && (textParts[i].indexOf('2') === 0) && (textParts[i].length > 2)) {
                text = text.split(textParts[i]).join(textParts[i].substring(1));
              }
            }

            return text;
          },
          gertyAnnounce    = function (controllers, utterance) {
            var runCommand = require(__dirname + '/../lib/runCommand'),
                tempDevice = '';

            for (tempDevice in controllers) {
              if (tempDevice !== 'config') {
                if ((controllers[tempDevice].config.typeClass === 'speech') || (controllers[tempDevice].config.typeClass === 'clientSpeech')) {
                  runCommand.runCommand(tempDevice, 'text-' + utterance);
                }
              }
            }
          };

      // If it's a command explicitly sent to Gerty to act on.
      if ((deviceConfig.typeClass === 'gerty') && (command.indexOf('text-') === 0) &&
          ((appParams.source === 'gerty') || (appParams.source === 'single') || (appParams.source === 'macro'))) {
        // You can configure Gerty to only act on inputted text that mention the
        // name you configure.
        if ((!deviceConfig.address) || ((deviceConfig.address) && (command.toUpperCase().indexOf(deviceConfig.title.toUpperCase()) !== -1))) {
          text = command.replace('text-', '').toUpperCase();

          if (text) {
            text = getCorrectedText(text);

            // If you prefix a command with an announce keyword, we won't
            // execute anything - we'll just use this as a sort of intercom.
            if (text.toUpperCase().indexOf(announceString.toUpperCase()) === 0) {
              gertyAnnounce(controllers, text.replace(announceString, ''));
            }

            else {
              gertyMood.setEmotion(text, deviceId, controllers.config.language);

              acted = gertyRunCommand.setDevice(text, controllers, deviceId, config.macros, controllers.config.language);

              if (acted === true) {
                utterance = utterance.AFFIRMATIVE[Math.floor(Math.random() * utterance.AFFIRMATIVE.length)];
              }

              else if ((acted === false) && (!ignoreNegative)) {
                utterance = utterance.NEGATIVE[Math.floor(Math.random() * utterance.NEGATIVE.length)];
              }

              else {
                utterance = acted || '';
              }

              if (utterance) {
                gertyAnnounce(controllers, utterance);
              }
            }
          }
        }
      }

      // Otherwise, see if it's a command that's sent to another controller that
      // Gerty is delegated on.
      else if (deviceConfig) {
        if (deviceConfig.typeClass !== 'gerty') {
          gertyAI = require(__dirname + '/gerty/ai');
          gertyAI.findIntent(deviceId, command, controllers);

          gertyRunCommand.setDeviceUpdate(deviceId, deviceConfig.typeClass, command, values, controllers);
        }
      }
    }
  };
}());
