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
    version : 20140824,

    inputs : ['command'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap : ['POWERON', 'POWEROFF', 'VOLUP', 'VOLDOWN', 'MUTE', 'UNMUTE', 'INPUT_BLURAY', 'INPUT_MPLAYER', 'INPUT_CD', 'INPUT_NETWORK', 'INPUT_TV', 'INPUT_GAME', 'MENU', 'MENU_UP', 'MENU_DOWN', 'MENU_LEFT', 'MENU_RIGHT', 'MENU_RETURN', 'SOUND_MOVIE', 'SOUND_MCHSTEREO', 'SOUND_PURE', 'ZONE1_ON', 'ZONE1_OFF', 'ZONE2_ON', 'ZONE2_VOL_UP', 'ZONE2_VOL_DOWN', 'ZONE2_OFF', 'ZONE3_ON', 'ZONE3_VOL_UP', 'ZONE3_VOL_DOWN', 'ZONE3_OFF'],

    /**
     * Since I want to abstract commands, I'd rather deal with semi-readable
     * key names - so this hash table will convert the pretty names to numeric
     * values denon expects.
     */
    hashTable : { 'POWERON'         : 'PWON',
                  'POWEROFF'        : 'PWSTANDBY',
                  'VOLUP'           : 'MVUP',
                  'VOLDOWN'         : 'MVDOWN',
                  'MUTE'            : 'MUON',
                  'UNMUTE'          : 'MUOFF',
                  'INPUT_BLURAY'    : 'SIBD',
                  'INPUT_MPLAYER'   : 'SIMPLAY',
                  'INPUT_CD'        : 'SICD',
                  'INPUT_NETWORK'   : 'SINET',
                  'INPUT_TV'        : 'SISAT/CBL',
                  'INPUT_GAME'      : 'SIGAME',
                  'MENU'            : 'MNMEN ON',
                  'MENU_UP'         : 'MNCUP',
                  'MENU_DOWN'       : 'MNCDN',
                  'MENU_LEFT'       : 'MNCLT',
                  'MENU_RIGHT'      : 'MENCRT',
                  'MENU_RETURN'     : 'MNRTN',
                  'SOUND_MOVIE'     : 'MSMOVIE',
                  'SOUND_MCHSTEREO' : 'MSMCH STEREO',
                  'SOUND_PURE'      : 'MSPURE DIRECT',
                  'ZONE1_ON'        : 'ZMON',
                  'ZONE1_OFF'       : 'ZMOFF',
                  'ZONE2_ON'        : 'Z2ON',
                  'ZONE2_VOL_UP'    : 'Z2UP',
                  'ZONE2_VOL_DOWN'  : 'Z3DOWN',
                  'ZONE2_OFF'       : 'Z2OFF',
                  'ZONE3_ON'        : 'Z3ON',
                  'ZONE3_VOL_UP'    : 'Z3UP',
                  'ZONE3_VOL_DOWN'  : 'Z3DOWN',
                  'ZONE3_OFF'       : 'Z3OFF'
    },

    state : function (controller, config, callback) {
      var denon = { device : {}, config : {} };

      callback                  = callback || function() {};
      denon.command             = 'state';
      denon.device.deviceId     = controller.config.deviceId;
      denon.device.deviceIp     = controller.config.deviceIp;
      denon.device.localTimeout = controller.config.localTimeout || config.localTimeout;

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
      denon.timeout    = config.device.localTimeout     || config.config.localTimeout;
      denon.command    = this.hashTable[config.command] || '';
      denon.devicePort = config.devicePort              || 23;
      denon.callback   = config.callback                || function () {};

      if(denon.command) {
        client.connect(denon.devicePort, denon.deviceIp, function() {
          client.write(denon.command + "\r");
          client.end();
        });
      }

      denon.callback(null, 'ok');

      client.once('data', function(dataReply) {
        denon.callback(null, dataReply);
      });

      if(denon.command === 'state') {
        client.setTimeout(denon.timeout, function() {
          client.destroy();
          denon.callback({ code : 'ETIMEDOUT' });
        });
      }

      client.once('error', function(err) {
        if((err.code !== 'ETIMEDOUT') || (denon.command !== 'state')) {
          denon.callback(err);
        }
      });
    }
  };
}());
