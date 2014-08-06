/*jslint white: true */
/*global State, module, require, console */

/**
 * Copyright (c) 2014 markewest@gmail.com
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
   * @author markewest@gmail.com
   * @fileoverview Basic control of Denon x4000 Receiver
   * @requires net
   */
  return {
    version : 20140805,

    inputs : ['command'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap : ['POWER_ON', 'POWER_OFF', 'VOL_UP', 'VOL_DOWN', 'MUTE'],

    /**
     * Since I want to abstract commands, I'd rather deal with semi-readable
     * key names - so this hash table will convert the pretty names to numeric
     * values denon expects.
     */
    hashTable : { 'POWER_ON'  : 'POWN',
                  'POWER_OFF' : 'PWSTANDBY',
                  'VOL_UP'    : 'MVVU',
                  'VOL_DOWN'  : 'MVDOWN',
                  'MUTE'      : 'MUON'
    },

    translateCommand : function (command) {
      return this.hashTable[command];
    },

    state : function (controller, callback, config) {
      var denon = { device : {}, config : {} };

      denon.device.deviceId = controller.config.deviceId;
      denon.device.deviceIp = controller.config.deviceIp;

      denon.callback = function (err, reply) {
        if(reply) {
          callback(denon.device.deviceId, null, 'ok');
        }

        else if(err) {
          callback(denon.device.deviceId, 'err');
        }
      };

      this.send(denon);
    },

    send : function (config) {
      var net    = require('net'),
          denon  = {},
          client = new net.Socket();

      denon.deviceIp   = config.device.deviceIp;
      denon.command    = this.translateCommand(config.command) || '';
      denon.devicePort = config.devicePort || 23;
      denon.callback   = config.callback   || function () {};

      client.connect(denon.devicePort, denon.deviceIp, function() {
        console.log('\x1b[32mDenon\x1b[0m: Connected');

        if(denon.command) {
          client.write(denon.command + "\r\n");
        }

        denon.callback(null, 'ok');
      });

      client.once('data', function(dataReply) {
        denon.callback(null, dataReply);

        client.destroy();
      });

      client.once('error', function(err) {
        var errorMsg = '\x1b[31mDenon\x1b[0m: ' + err.code;

        if((err.code === 'ECONNRESET') || (err.code === 'ECONNREFUSED') || (err.code === 'EHOSTUNREACH')) {
          errorMsg = '\x1b[31mDenon\x1b[0m: Device is off or unreachable';
        }

        console.log(errorMsg);

        denon.callback(errorMsg);
      });
    }
  };
}());
