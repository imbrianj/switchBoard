/*jslint white: true */
/*global State, module, Buffer, String, require, console */

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
   * @fileoverview Basic control over Samsung SmartTVs from 2011 onward via TCP
   *               web sockets using Node.js.
   * @requires net
   * @note This is a full-scale rip-off of the fine work done here:
   *       http://forum.samygo.tv/viewtopic.php?f=12&t=1792
   */
  return {
    version : 20140619,

    inputs  : ['command', 'text'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['0', '1', '16_9', '2', '3', '3SPEED', '4', '5', '6', '7', '8', '9', '11', '12', '4_3', 'AD', 'ADDDEL', 'ALT_MHP', 'ANGLE', 'ANTENA', 'ANYNET', 'ANYVIEW', 'APP_LIST', 'ASPECT', 'AUTO_ARC_ANTENNA_AIR', 'AUTO_ARC_ANTENNA_CABLE', 'AUTO_ARC_ANTENNA_SATELLITE', 'AUTO_ARC_ANYNET_AUTO_START', 'AUTO_ARC_ANYNET_MODE_OK', 'AUTO_ARC_AUTOCOLOR_FAIL', 'AUTO_ARC_AUTOCOLOR_SUCCESS', 'AUTO_ARC_CAPTION_ENG', 'AUTO_ARC_CAPTION_KOR', 'AUTO_ARC_CAPTION_OFF', 'AUTO_ARC_CAPTION_ON', 'AUTO_ARC_C_FORCE_AGING', 'AUTO_ARC_JACK_IDENT', 'AUTO_ARC_LNA_OFF', 'AUTO_ARC_LNA_ON', 'AUTO_ARC_PIP_CH_CHANGE', 'AUTO_ARC_PIP_DOUBLE', 'AUTO_ARC_PIP_LARGE', 'AUTO_ARC_PIP_LEFT_BOTTOM', 'AUTO_ARC_PIP_LEFT_TOP', 'AUTO_ARC_PIP_RIGHT_BOTTOM', 'AUTO_ARC_PIP_RIGHT_TOP', 'AUTO_ARC_PIP_SMALL', 'AUTO_ARC_PIP_SOURCE_CHANGE', 'AUTO_ARC_PIP_WIDE', 'AUTO_ARC_RESET', 'AUTO_ARC_USBJACK_INSPECT', 'AUTO_FORMAT', 'AUTO_PROGRAM', 'AV1', 'AV2', 'AV3', 'BACK_MHP', 'BOOKMARK', 'CALLER_ID', 'CAPTION', 'CATV_MODE', 'CHDOWN', 'CHUP', 'CH_LIST', 'CLEAR', 'CLOCK_DISPLAY', 'COMPONENT1', 'COMPONENT2', 'CONTENTS', 'CONVERGENCE', 'CONVERT_AUDIO_MAINSUB', 'CUSTOM', 'CYAN', 'DEVICE_CONNECT', 'DISC_MENU', 'DMA', 'DNET', 'DNIe', 'DNSe', 'DOOR', 'DOWN', 'DSS_MODE', 'DTV', 'DTV_LINK', 'DTV_SIGNAL', 'DVD_MODE', 'DVI', 'DVR', 'DVR_MENU', 'DYNAMIC', 'ENTER', 'ENTERTAINMENT', 'ESAVING', 'EXT1', 'EXT10', 'EXT11', 'EXT12', 'EXT13', 'EXT14', 'EXT15', 'EXT16', 'EXT17', 'EXT18', 'EXT19', 'EXT2', 'EXT20', 'EXT21', 'EXT22', 'EXT23', 'EXT24', 'EXT25', 'EXT26', 'EXT27', 'EXT28', 'EXT29', 'EXT3', 'EXT30', 'EXT31', 'EXT32', 'EXT33', 'EXT34', 'EXT35', 'EXT36', 'EXT37', 'EXT38', 'EXT39', 'EXT4', 'EXT40', 'EXT41', 'EXT5', 'EXT6', 'EXT7', 'EXT8', 'EXT9', 'FACTORY', 'FAVCH', 'FF', 'FF_', 'FM_RADIO', 'GAME', 'GREEN', 'GUIDE', 'HDMI', 'HDMI1', 'HDMI2', 'HDMI3', 'HDMI4', 'HELP', 'HOME', 'ID_INPUT', 'ID_SETUP', 'INFO', 'INSTANT_REPLAY', 'LEFT', 'LINK', 'LIVE', 'MAGIC_BRIGHT', 'MAGIC_CHANNEL', 'MDC', 'MENU', 'MIC', 'MORE', 'MOVIE1', 'MS', 'MTS', 'MUTE', 'NINE_SEPERATE', 'OPEN', 'PANNEL_CHDOWN', 'PANNEL_CHUP', 'PANNEL_ENTER', 'PANNEL_MENU', 'PANNEL_POWER', 'PANNEL_SOURCE', 'PANNEL_VOLDOW', 'PANNEL_VOLUP', 'PANORAMA', 'PAUSE', 'PCMODE', 'PERPECT_FOCUS', 'PICTURE_SIZE', 'PIP_CHDOWN', 'PIP_CHUP', 'PIP_ONOFF', 'PIP_SCAN', 'PIP_SIZE', 'PIP_SWAP', 'PLAY', 'PLUS100', 'PMODE', 'POWER', 'POWEROFF', 'POWERON', 'PRECH', 'PRINT', 'PROGRAM', 'QUICK_REPLAY', 'REC', 'RED', 'REPEAT', 'RESERVED1', 'RETURN', 'REWIND', 'REWIND_', 'RIGHT', 'RSS', 'RSURF', 'SCALE', 'SEFFECT', 'SETUP_CLOCK_TIMER', 'SLEEP', 'SOURCE', 'SRS', 'STANDARD', 'STB_MODE', 'STILL_PICTURE', 'STOP', 'SUB_TITLE', 'SVIDEO1', 'SVIDEO2', 'SVIDEO3', 'TOOLS', 'TOPMENU', 'TTX_MIX', 'TTX_SUBFACE', 'TURBO', 'TV', 'TV_MODE', 'UP', 'VCHIP', 'VCR_MODE', 'VOLDOWN', 'VOLUP', 'WHEEL_LEFT', 'WHEEL_RIGHT', 'W_LINK', 'YELLOW', 'ZOOM1', 'ZOOM2', 'ZOOM_IN', 'ZOOM_MOVE', 'ZOOM_OUT'],

    base64Encode : function (string) {
      return new Buffer(string).toString('base64');
    },

    /**
     * Once the connection has been established, this chunk seems to validate
     * input source.
     * "This is who I am."
     */
    chunkOne : function (samsung) {
      var ipencoded  = this.base64Encode(samsung.serverIp),
          macencoded = this.base64Encode(samsung.serverMac),
          message    = String.fromCharCode(0x64) + String.fromCharCode(0x00) + String.fromCharCode(ipencoded.length) + String.fromCharCode(0x00) + ipencoded + String.fromCharCode(macencoded.length) + String.fromCharCode(0x00) + macencoded + String.fromCharCode(this.base64Encode(samsung.remoteName).length) + String.fromCharCode(0x00) + this.base64Encode(samsung.remoteName);

      return String.fromCharCode(0x00) + String.fromCharCode(samsung.appString.length) + String.fromCharCode(0x00) + samsung.appString + String.fromCharCode(message.length) + String.fromCharCode(0x00) + message;
    },

    /**
     * This chunk seems to tell the TV which command to execute - or, text to
     * be inputted into fields.
     * "Will you please do this for me?"
     */
    chunkTwo : function (samsung) {
      var command = 'KEY_' + samsung.command,
          message = '';

      if(samsung.command) {
        message = String.fromCharCode(0x00) + String.fromCharCode(0x00) + String.fromCharCode(0x00) + String.fromCharCode(this.base64Encode(command).length) + String.fromCharCode(0x00) + this.base64Encode(command);

        return String.fromCharCode(0x00) + String.fromCharCode(samsung.tvAppString.length) + String.fromCharCode(0x00) + samsung.tvAppString + String.fromCharCode(message.length) + String.fromCharCode(0x00) + message;
      }

      else if(samsung.text) {
        message = String.fromCharCode(0x01) + String.fromCharCode(0x00) + String.fromCharCode(this.base64Encode(samsung.text).length) + String.fromCharCode(0x00) + this.base64Encode(samsung.text);

        return String.fromCharCode(0x01) + String.fromCharCode(samsung.appString.length) + String.fromCharCode(0x00) + samsung.appString + String.fromCharCode(message.length) + String.fromCharCode(0x00) + message;
      }
    },

    state : function (controller, callback, config) {
      var samsung = { device : {}, config : {}};

      samsung.device.deviceId  = controller.config.deviceId;
      samsung.device.deviceIp  = controller.config.deviceIp;
      samsung.config.serverIp  = config.serverIp;
      samsung.config.serverMac = config.serverMac;

      samsung.callback = function (err, reply) {
        if(reply) {
          callback(samsung.device.deviceId, null, 'ok');
        }

        else if(err) {
          callback(samsung.device.deviceId, 'err');
        }
      };

      this.send(samsung);
    },

    onload : function (controller) {
      var parser = require(__dirname + '/../parsers/samsung').samsung;

      return parser(controller.deviceId, controller.markup, State[controller.config.deviceId].state, State[controller.config.deviceId].value);
    },

    send : function (config) {
      var net             = require('net'),
          samsung         = {},
          that            = this,
          socket;

      samsung.deviceIp    = config.device.deviceIp;
      samsung.serverIp    = config.config.serverIp;
      samsung.serverMac   = config.config.serverMac;
      samsung.command     = config.command     || '';
      samsung.text        = config.text        || '';
      samsung.devicePort  = config.devicePort  || 55000;
      samsung.appString   = config.appString   || "iphone..iapp.samsung";
      samsung.tvAppString = config.tvAppString || "iphone.UN60ES8000.iapp.samsung";
      samsung.remoteName  = config.remoteName  || "Node.js Samsung Remote";
      samsung.callback    = config.callback    || function() {};

      socket = net.connect(samsung.devicePort, samsung.deviceIp);

      socket.once('connect', function() {
        console.log('Samsung: Connected');

        if((samsung.command) || (samsung.text)) {
          socket.write(that.chunkOne(samsung));
          socket.write(that.chunkTwo(samsung));
        }

        socket.end();

        samsung.callback(null, 'ok');
      });

      socket.once('error', function(err) {
        var errorMsg = '';

        if(err.code === 'EHOSTUNREACH' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
          errorMsg = 'Samsung: Device is off or unreachable';
        }

        else {
          errorMsg = 'Samsung: ' + err.code;
        }

        console.log(errorMsg);

        samsung.callback(errorMsg);
      });
    }
  };
}());
