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
 * @fileoverview Handles any scheduled events.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20180428,

    /**
     * Calls the appropriate methods from controllers at the intervals expected.
     * For long intervals, they will "poll", for short intervals, they will grab
     * "state".
     */
    fire : function (controllers, type) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          deviceId;

      for (deviceId in controllers) {
        if (deviceId !== 'config') {
          // If the long poller fired this, we'll only run for controllers that
          // have "poll".
          if (type === 'long') {
            if ((controllers[deviceId]) && (typeof controllers[deviceId].poll === 'function')) {
              try {
                controllers[deviceId].poll(deviceId, controllers);
              }

              catch (catchErr) {
                console.log('\x1b[31mSchedule\x1b[0m: Exception in scheudled ' + deviceId + ' long-poll command.');
              }
            }
          }

          // If the short poller fired this, we'll only run for controllers that
          // have "state".
          else if (type === 'short') {
            if ((controllers[deviceId].controller) && (controllers[deviceId].controller.inputs) && (controllers[deviceId].controller.inputs.indexOf('state') !== -1)) {
              try {
                runCommand.runCommand(deviceId, 'state', 'single', false);
              }

              catch (catchErr) {
                console.log('\x1b[31mSchedule\x1b[0m: Exception in scheudled ' + deviceId + 'short-poll command.');
              }
            }
          }
        }
      }

      return true;
    },

    /**
     * Initialize timers to hit APIs.  There are two timers: "long poller" and
     * "short poller".  Long Poller is used for remote APIs that shouldn't be
     * hammered too quickly (be nice!).  Short Poller is for devices within your
     * own network that we can hammer very often without issue.
     */
    scheduleInit : function (controllers) {
      var db               = require(__dirname + '/../lib/db'),
          that             = this,
          longPollMinutes  = controllers.config.pollMinutes || 15,
          shortPollSeconds = controllers.config.pollSeconds || 30;

      setInterval(function () {
        var now = new Date();

        console.log('\x1b[35mSchedule\x1b[0m: Long interval elapsed (' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ')');

        that.fire(controllers, 'long');

        db.writeDb();
      }, (longPollMinutes * 60000));

      setInterval(function () {
        var now = new Date();

        console.log('\x1b[35mSchedule\x1b[0m: Short interval elapsed (' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ')');

        that.fire(controllers, 'short');
      }, (shortPollSeconds * 1000));
    }
  };
}());
