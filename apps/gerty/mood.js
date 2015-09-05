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
 * @fileoverview Gerty methods related to changing it's mood, emotion and
 *               managing internal state.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20150411,

    /**
     * Based on the different mood criteria (social, entertained, comfortable,
     * excited, scared), we'll set bounds and determine a distilled emotion for
     * display.
     */
    deriveMood : function(mood, controllers) {
      var runCommand  = require(__dirname + '/../../lib/runCommand'),
          deviceState = require(__dirname + '/../../lib/deviceState'),
          gertyState,
          oldEmotion,
          deviceId;

      // If you haven't explicitly changed emotion based on a devices input,
      // we'll try and derive one based on new info.
      if(!mood.emotion) {
        mood.emotion = 'HAPPY';

        if(mood.social < 1) {
          mood.emotion = 'INDIFFERENT';
        }

        if(mood.comfortable < 1) {
          mood.emotion = 'SAD';
        }

        if((mood.excited < 1) && (mood.entertained < 1)) {
          mood.emotion = 'INDIFFERENT';
        }

        if(mood.social < 0) {
          mood.emotion = 'INDIFFERENT';
        }

        if(mood.scared < -5) {
          mood.emotion = 'SCARED';
        }

        if(mood.entertained > 4) {
          mood.emotion = 'PLAYFUL';
        }

        if(mood.excited > 4) {
          mood.emotion = 'EXCITED';
        }

        if(mood.social > 7) {
          mood.emotion = 'LOVE';
        }

        if((mood.excited < -2) && (mood.scared < -2)) {
          mood.emotion = 'ANGRY';
        }

        if(mood.comfortable >= 10) {
          mood.emotion = 'SLEEP';
        }

        if(mood.scared <= -10) {
          mood.emotion = 'SCARED';
        }
      }

      for(deviceId in controllers) {
        if(deviceId !== 'config') {
          if(controllers[deviceId].config.typeClass === 'gerty') {
            gertyState = deviceState.getDeviceState(deviceId);

            if(gertyState.value.description !== mood.emotion) {
              runCommand.runCommand(deviceId, mood.emotion);
            }

// Check timestamps of mood.comment elements against stored state.  If anything
// is newer than a given minute threshhold, send that as a runCommand to gerty
// controller to update the chat log.
// In chat log - color code elements, make device name clickable.

            break;
          }
        }
      }

      return mood;
    },

    /**
     * You can explicitly set an emotion by passing that specific text.
     */
    setEmotion : function(text, device, language) {
      var translate  = require(__dirname + '/../../lib/translate'),
          runCommand = require(__dirname + '/../../lib/runCommand'),
          synonyms   = translate.findSynonyms('gerty', language),
          keyword    = '',
          command    = '',
          i;

      for(keyword in synonyms) {
        for(i = 0; i < synonyms[keyword].length; i += 1) {
          if(text.indexOf(synonyms[keyword][i].toUpperCase()) !== -1) {
            command = keyword;

            break;
          }
        }
      }

      if(command) {
        runCommand.runCommand(device, command);
      }

      return command !== '';
    }
  };
}());
