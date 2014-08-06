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
   * @fileoverview Basic control of Pioneer VSX-XXXX Amps
   * @requires net
   * @note Big thanks to the base javascript from:
   *  https://github.com/Vmaxence/SARAH-Plugin-ampliVSX
   * And documentation here:
   *  http://raymondjulin.com/2012/07/15/remote-control-your-pioneer-vsx-receiver-over-telnet/
   *
   */
  return {
    version : 20140607,

    inputs : ['command'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap : ['POWER', 'VOL_UP', 'VOL_DOWN', 'MUTE', 'CD', 'TUNER', 'CD_R_TAPE', 'DVD', 'TV', 'ROKU', 'VIDEO', 'IPOD_USB', 'DVR_BDR', 'HDMI_1', 'HDMI_2', 'HDMI_3', 'HDMI_4', 'HDMI_5', 'HDMI_6', 'BD', 'INTERNET_RADIO', 'SIRIUSXM', 'PANDORA'],

    /**
     * Since I want to abstract commands, I'd rather deal with semi-readable
     * key names - so this hash table will convert the pretty names to numeric
     * values pioneer expects.
     *
     * NOTE: Not all capabilities are on all VSX models
     */
    hashTable : { 'POWER'          : 'PZ',
                  'VOL_UP'         : 'VU',
                  'VOL_DOWN'       : 'VD',
                  'MUTE'           : 'MZ',
                  'CD'             : '01FN',
                  'TUNER'          : '02FN',
                  'CD_R_TAPE'      : '03FN',
                  'DVD'            : '04FN',
                  'TV'             : '05FN',
                  'ROKU'           : '06FN',
                  'VIDEO'          : '10FN',
                  'IPOD_USB'       : '17FN',
                  'DVR_BDR'        : '15FN',
                  'HDMI_1'         : '19FN',
                  'HDMI_2'         : '20FN',
                  'HDMI_3'         : '21FN',
                  'HDMI_4'         : '22FN',
                  'HDMI_5'         : '23FN',
                  'HDMI_6'         : '24FN',
                  'BD'             : '25FN',
                  'INTERNET_RADIO' : '39FN',
                  'SIRIUSXM'       : '40FN',
                  'PANDORA'        : '41FN'
    },

    translateCommand : function (command) {
      return this.hashTable[command];
    },

    state : function (controller, callback, config) {
      var pioneer = { device : {}, config : {} };

      pioneer.device.deviceId  = controller.config.deviceId;
      pioneer.device.deviceIp  = controller.config.deviceIp;

      pioneer.callback = function (err, reply) {
        if(reply) {
          callback(pioneer.device.deviceId, null, 'ok');
        }

        else if(err) {
          callback(pioneer.device.deviceId, 'err');
        }
      };

      this.send(pioneer);
    },

    send : function (config) {
      var net     = require('net'),
          pioneer = {},
          client  = new net.Socket();

      pioneer.deviceIp   = config.device.deviceIp;
      pioneer.command    = this.translateCommand(config.command) || '';
      pioneer.devicePort = config.devicePort || 8102;
      pioneer.callback   = config.callback   || function () {};

      client.connect(pioneer.devicePort, pioneer.deviceIp, function() {
        console.log('\x1b[32mPioneer\x1b[0m: Connected');

        if(pioneer.command) {
          client.write(pioneer.command + "\r\n");
        }

        pioneer.callback(null, 'ok');
      });

      client.once('data', function(dataReply) {
        pioneer.callback(null, dataReply);

        client.destroy();
      });

      client.once('error', function(err) {
        var errorMsg = '\x1b[31mPioneer\x1b[0m: ' + err.code;

        if((err.code === 'ECONNRESET') || (err.code === 'ECONNREFUSED') || (err.code === 'EHOSTUNREACH')) {
          errorMsg = '\x1b[31mPioneer\x1b[0m: Device is off or unreachable';
        }

        console.log(errorMsg);

        pioneer.callback(errorMsg);
      });
    }
  };
}());
