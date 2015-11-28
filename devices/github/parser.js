/*jslint white: true */
/*global module, console, require */

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

(function (exports){
  'use strict';

  var version = 20151127;

  exports.github = function (deviceId, markup, state, value, fragments, language) {
    var commit         = fragments.commit,
        message        = fragments.message,
        tempMarkup     = '',
        time           = '',
        i              = 0,
        hasLatest      = null,
        newerAvailable = null,
        messageText    = '',
        translate      = function (message) {
          var util;

          if((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'github');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'github', language);
          }

          return message;
        },
        displayTime = function (unix) {
          var util,
              time;

          if((typeof SB === 'object') && (typeof SB.util === 'object')) {
            time = SB.util.displayTime(unix, translate, 'long');
          }

          else {
            util = require(__dirname + '/../../lib/sharedUtil').util;
            time = util.displayTime(unix, translate, 'long');
          }

          return time;
        };

    if((state) && (value)) {
      for(i; i < value.length; i += 1) {
        time = displayTime(value[i].time);

        tempMarkup = tempMarkup + commit.split('{{GITHUB_URL}}').join(value[i].url);
        tempMarkup = tempMarkup.split('{{GITHUB_TITLE}}').join(time);
        tempMarkup = tempMarkup.split('{{GITHUB_DESCRIPTION}}').join(value[i].description);

        if(value[i].upToDate === false) {
          newerAvailable = 'NEWER';
        }

        else if(value[i].upToDate === true) {
          hasLatest = 'LATEST';
        }
      }
    }

    markup = markup.replace('{{GITHUB_DYNAMIC}}', tempMarkup);

    if(newerAvailable) {
      messageText = translate(newerAvailable);
    }

    else if (hasLatest) {
      messageText = translate(hasLatest);
    }

    tempMarkup = message.replace('{{GITHUB_MESSAGE}}', messageText);

    markup = markup.replace('{{GITHUB_MESSAGE}}', tempMarkup);

    return markup;
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
