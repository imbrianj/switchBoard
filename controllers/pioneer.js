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
   * @requires net.js
   * @note Big thanks to the base javascript from:
   *  https://github.com/Vmaxence/SARAH-Plugin-ampliVSX
   * And documentation here:
   *  http://raymondjulin.com/2012/07/15/remote-control-your-pioneer-vsx-receiver-over-telnet/
   *       
   */
  return {
    version : 20140607,

    inputs  : ['command'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['MUTE', 'POWER', 'VOL_DOWN', 'VOL_UP', 'BD', 'DVD', 'TV', 'ROKU', 'VIDEO','DVR/BDR', 'IPOD/USB','DVR/BDR','HDMI_1', 'HDMI_2','HDMI_3', 'HDMI_4','HDMI_5','HDMI_6','INTERNET RADIO','SIRIUSXM','PANDORA'],

    /**
     * Since I want to abstract commands, I'd rather deal with semi-readable
     * key names - so this hash table will convert the pretty names to numeric
     * values pioneer expects.
     */
    hashTable : { 'POWER'         : 'PZ',
                  'VOL_UP'        : 'VU',
                  'VOL_DOWN'      : 'VD',
                  'MUTE'          : 'MZ',
                  'CD'            : '01FN',
                  'TUNER'         : '02FN',
                  'CD-R/TAPE'     : '03FN',
                  'DVD'           : '04FN',
                  'TV'            : '05FN',
                  'ROKU'          : '06FN',
                  'VIDEO'         : '10FN',
                  'IPOD/USB'      : '17FN',
                  'DVR/BDR'       : '15FN',
                  'HDMI_1'        : '19FN',
                  'HDMI_2'        : '20FN',
                  'HDMI_3'        : '21FN',
                  'HDMI_4'        : '22FN',
                  'HDMI_5'        : '23FN',
                  'HDMI_6'        : '24FN',
                  'BD'            : '25FN',
                  'INTERNET RADIO': '39FN',
                  'SIRIUSXM'      : '40FN',
                  'PANDORA'       : '41FN',

 },

    translateCommand : function (command) {
      return this.hashTable[command];
    },

    send : function (config) {

      var tts = ""; var saut = "\r\n";
      var pioneerCommand = this.translateCommand(config.command) || '';

      if(pioneerCommand) {
        var net = require('net');
        var client = new net.Socket();
        client.connect(config.device.devicePort, config.device.deviceIp, function() {
            console.log('Connected');
            console.log(pioneerCommand);
            client.write(pioneerCommand+saut);
          });
          client.on('data', function(data) {
          console.log('Received: ' + data);
            client.destroy();
          });
            client.on('close', function() {
            console.log('Connection closed');
          });
        }
      else {
        tts = "Command Error";
      }
      console.log(tts);
      //callback({'tts': tts});
      return;
    }
  };
}());