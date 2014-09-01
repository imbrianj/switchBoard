/*jslint white: true */
/*global State, module, require, console */

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
 * @fileoverview Simple script to fire for each scheduled interval.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140901,

    /**
     * On poll, check the Travis build state.  If the latest build is failing,
     * send a Desktop Notification.  As build failures are not always terrible
     * (such as a pending pull request), we don't want to send an annoying
     * notification via SMS, push or text.
     */
    poll : function(deviceId, command, controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          translate  = require(__dirname + '/../lib/translate'),
          notify,
          callback;

      callback = function(err, travis) {
        if((travis) && (travis[0]) && (travis[0].state === 'finished') && (travis[0].status === 'err')) {
          notify = require(__dirname + '/../lib/notify');

          notify.sendNotification(null, translate.translate('{{i18n_BUILD_FAILURE}}', 'travis', controllers.config.language), deviceId);
        }
      };

      runCommand.runCommand(deviceId, 'list', deviceId, false, callback);
    }
  };
}());
