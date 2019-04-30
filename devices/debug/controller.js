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

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Register uptime, runtime and find memory usage and CPU load
   *               for debugging and curiosity.
   * @requires os, fs
   */
  return {
    version : 20171030,

    readOnly: true,

    inputs  : ['list'],

    startup : null,

    /**
     * Log the Unix timestamp for when SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      this.startup = new Date().getTime();

      runCommand.runCommand(controller.config.deviceId, 'state', controller.config.deviceId);
    },

    /**
     * Prepares and calls send() to request the current state.
     */
    state : function (controller, config, callback) {
      var debug = { device : {}, config : {} };

      callback      = callback || function () {};
      debug.command = 'state';
      debug.config  = { celsius : !!config.celsius };

      debug.callback = function (err, reply) {
        if (reply) {
          callback(controller.config.deviceId, null, 'ok', reply);
        }

        else if (err) {
          callback(controller.config.deviceId, 'err', 'err');
        }
      };

      this.send(debug);
    },

    send : function (config) {
      var os         = require('os'),
          webSockets = require(__dirname + '/../../lib/webSockets'),
          util       = require(__dirname + '/../../lib/sharedUtil').util,
          celsius    = !!config.config.celsius,
          debug      = {},
          callback   = config.callback || function () {},
          tempPath   = '/sys/class/thermal/thermal_zone0/temp',
          fs,
          temp;

      debug.platform      = os.platform();
      // Memory is measured in bytes, so we'll divide by 1024*1024 to grab MB.
      debug.freeMemory    = Math.round(os.freemem()  / 1048576);
      debug.totalMemory   = Math.round(os.totalmem() / 1048576);
      debug.memoryUsed    = (debug.totalMemory - debug.freeMemory);
      debug.percentMemory = Math.round(debug.memoryUsed * 100 / debug.totalMemory);
      debug.cpuLoad       = os.loadavg();
      debug.uptime        = (Math.round(os.uptime()) * 1000);
      debug.startup       = this.startup;
      debug.clientCount   = webSockets.connectionCount();

      if (debug.platform === 'freebsd' ||
          debug.platform === 'linux'   ||
          debug.platform === 'openbsd') {
        fs = require('fs');

        try {
          temp = fs.readFileSync(tempPath, 'utf-8');
        }

        catch (catchErr) {
          console.log('\x1b[32m' + config.config.title + '\x1b[0m: Failed to read temperature for ' + config.config.typeClass);
        }

        if (temp) {
          temp = temp / 1000;
          temp = parseInt(celsius ? temp : util.cToF(temp), 10);
          debug.temperature = temp + '&deg;';
        }
      }

      callback(null, { value : debug });
    }
  };
}());
