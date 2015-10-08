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
 * @fileoverview Execute Gerty commands.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20151008,

    gerty : function(device, command, controllers, values, config) {
      var translate       = require(__dirname + '/../lib/translate'),
          runCommand      = require(__dirname + '/../lib/runCommand'),
          gertyRunCommand = require(__dirname + '/gerty/runCommand'),
          gertyMood       = require(__dirname + '/gerty/mood'),
          utterance       = translate.findSynonyms('gerty', controllers.config.language),
          text            = '',
          acted           = false;

      // If it's a command explicitly sent to Gerty to act on.
      if((controllers[device]) && (controllers[device].config) && (controllers[device].config.typeClass === 'gerty') && (command.indexOf('text-') === 0)) {
        text = command.replace('text-', '').toUpperCase();

        gertyMood.setEmotion(text, device, controllers.config.language);

        acted = gertyRunCommand.setDevice(text, controllers, device, config.macros, controllers.config.language);

        if(acted === true) {
          utterance = utterance.AFFIRMATIVE[Math.floor(Math.random() * utterance.AFFIRMATIVE.length)];
        }

        else if(acted === false) {
          utterance = utterance.NEGATIVE[Math.floor(Math.random() * utterance.NEGATIVE.length)];
        }

        else {
          utterance = acted || '';
        }

// Send text to gerty as comment

        for(device in controllers) {
          if(device !== 'config') {
            if((controllers[device].config.typeClass === 'speech') || (controllers[device].config.typeClass === 'clientSpeech')) {
              runCommand.runCommand(device, 'text-' + utterance);
            }
          }
        }
      }

      // Otherwise, see if it's a command that's sent to another controller
      // that Gerty is delegated on.
      else if((controllers[device]) && (controllers[device].config)) {
        if(controllers[device].config.typeClass !== 'gerty') {
          gertyRunCommand.setDeviceUpdate(device, controllers[device].config.typeClass, command, values, controllers);
        }
      }
    }
  };
}());
