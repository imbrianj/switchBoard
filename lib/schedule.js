/*jslint white: true */
/*global State, module, setInterval, require, console */

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
    version : 20140503,

    scheduleInit : function(controllers) {
      var schedEvent       = require(__dirname + '/../events/schedule'),
          longPollMinutes  = controllers.config.pollMinutes || 15,
          shortPollSeconds = controllers.config.pollSeconds || 15;

      setInterval(function() {
        var now = new Date();

        console.log('\x1b[35mSchedule\x1b[0m: Long interval elapsed (' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ')');

        schedEvent.fire(controllers, 'long');
      }, (longPollMinutes * 60000));

      setInterval(function() {
        var now = new Date();

        console.log('\x1b[35mSchedule\x1b[0m: Short interval elapsed (' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ')');

        schedEvent.fire(controllers, 'short');
      }, (shortPollSeconds * 1000));
    }
  };
}());
