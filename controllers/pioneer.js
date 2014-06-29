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

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control of LG Smart TV
   * @requires http
   * @note Huge thanks for the unofficial documentation found here:
   *       http://forum.loxone.com/enen/software/4876-lg-tv-http-control.html#post32692
   */
  return {
    version : 20140607,

    inputs  : ['command'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['0', '1', '2', '3', '3D_LR', '3D_VID', '4', '5', '6', '7', '8', '9', 'AUD_DESC', 'AV_MODE', 'BACK', 'BLUE', 'CH_DOWN', 'CH_UP', 'DASH', 'DOWN', 'ENERGY', 'EPG', 'EXIT', 'EXTERNAL', 'FAV', 'FF', 'FLASH_BACK', 'GREEN', 'HOME', 'INFO', 'LEFT', 'LIST', 'LIVE', 'MARK', 'MENU', 'MUTE', 'MY_APPS', 'NETCAST', 'NEXT', 'OK', 'PAUSE', 'PIP', 'PIP_DOWN', 'PIP_UP', 'PLAY', 'POWER', 'PREV', 'QUICK_MENU', 'RATIO', 'REC', 'REC_LIST', 'RED', 'REPEAT', 'RES_PROG_LIST', 'REW', 'RIGHT', 'SIMPLINK', 'STOP', 'SUBTITLE', 'TEXT_OPTION', 'TTL', 'UP', 'VID_SWITCH', 'VOL_DOWN', 'VOL_UP', 'YELLOW'],

    /**
     * Since I want to abstract commands, I'd rather deal with semi-readable
     * key names - so this hash table will convert the pretty names to numeric
     * values LG expects.
     */
    hashTable : { 'POWER'         : 'PO',
                  '0'             : 2,
                  '1'             : 3,
                  '2'             : 4,
                  '3'             : 5,
                  '4'             : 6,
                  '5'             : 7,
                  '6'             : 8,
                  '7'             : 9,
                  '8'             : 10,
                  '9'             : 11,
                  'UP'            : 12,
                  'DOWN'          : 13,
                  'LEFT'          : 14,
                  'RIGHT'         : 15,
                  // Nothing documented from 15 - 20
                  'OK'            : 20,
                  'HOME'          : 21,
                  'MENU'          : 22,
                  'BACK'          : 23,
                  'VOL_UP'        : 'VU',
                  'VOL_DOWN'      : 'VD',
                  'MUTE'          : 'M0',
                  'CH_UP'         : 27,
                  'CH_DOWN'       : 28,
                  'BLUE'          : 29,
                  'GREEN'         : 30,
                  'RED'           : 31,
                  'YELLOW'        : 32,
                  'PLAY'          : 33,
                  'PAUSE'         : 34,
                  'STOP'          : 35,
                  'FF'            : 36,
                  'REW'           : 37,
                  'NEXT'          : 38,
                  'PREV'          : 39,
                  'REC'           : 40,
                  'REC_LIST'      : 41,
                  'REPEAT'        : 42,
                  'LIVE'          : 43,
                  'EPG'           : 44,
                  'INFO'          : 45,
                  'RATIO'         : 46,
                  'EXTERNAL'      : 47,
                  'PIP'           : 48,
                  'SUBTITLE'      : 49,
                  'LIST'          : 50,
                  'TTL'           : 51,
                  'MARK'          : 52,
                  // Nothing from 52 - 400
                  '3D_VID'        : 400,
                  '3D_LR'         : 401,
                  'DASH'          : 402,
                  'FLASH_BACK'    : 403,
                  'FAV'           : 404,
                  'QUICK_MENU'    : 405,
                  'TEXT_OPTION'   : 406,
                  'AUD_DESC'      : 407,
                  'NETCAST'       : 408,
                  'ENERGY'        : 409,
                  'AV_MODE'       : 410,
                  'SIMPLINK'      : 411,
                  'EXIT'          : 412,
                  'RES_PROG_LIST' : 413,
                  'PIP_UP'        : 414,
                  'PIP_DOWN'      : 415,
                  'VID_SWITCH'    : 416,
                  'MY_APPS'       : 417 },

    translateCommand : function (command) {
      return this.hashTable[command];
    },

    send : function (config) {

      //pioneer.deviceIp   = config.device.deviceIp;
      //pioneer.command    = this.translateCommand(config.command) || '';
      //pioneer.devicePort = config.device.devicePort;
      //pioneer.callback   = config.callback   || function () {};

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