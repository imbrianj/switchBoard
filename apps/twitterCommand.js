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
 * @fileoverview Checks for new tweets to a given user.  If that tweet is
 *               authored by someone on our whitelist, pass the contents of the
 *               tweet to Gerty for plain language execution.
 */

module.exports = (function () {
  'use strict';

  var startup   = null;
  var completed = [];

  return {
    version : 20180107,

    twitterCommand : function (deviceId, command, controllers, values, config) {
      var senders = config.senders,
          i       = 0,
          value,
          message,
          translate,
          notify;

      // On first execution, log the time.  Any commands that preceed startup
      // time are not worth executing.
      if (!startup) {
        startup = new Date().getTime();
      }

      // If you don't have any whitelist of Tweet senders, there's nothing we
      // can safely do.
      if (senders) {
        for (i; i < values.value.length; i += 1) {
          value = values.value[i];

          // Tweets are provided in reverse chron.  Our first instance of one
          // that's too old implies that they are all too old.
          if (value.date < startup) {
            break;
          }

          // Only execute a tweet once - then add it to a completed list.
          else if (completed.indexOf(value.url) === -1) {
            // The sender is on our trusted whitelist.
            if (senders.indexOf(value.author) !== -1) {
              notify    = require(__dirname + '/../lib/notify');
              translate = require(__dirname + '/../lib/translate');

              // Add to the blacklist so this same message won't be executed
              // again.
              completed.push(value.url);

              message = translate.translate('{{i18n_FROM_TWITTER}}', 'twitter', controllers.config.language);
              message = message.split('{{MESSAGE}}').join(value.text);

              // Send the message to all controllers.  Let them sort out what
              // they want to do with them.
              notify.notify(message, controllers, 'macro');
            }
          }
        }
      }
    }
  };
}());
