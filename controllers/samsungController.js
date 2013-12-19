/*jslint white: true */
/*global exports, String, Buffer, require, console */

exports.samsungController = exports.samsungController || (function () {
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
    version : '0.0.0.0.1 alpha',
    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['0', '1', '16_9', '2', '3', '3SPEED', '4', '5', '6', '7', '8', '9', '11', '12', '4_3', 'AD', 'ADDDEL', 'ALT_MHP', 'ANGLE', 'ANTENA', 'ANYNET', 'ANYVIEW', 'APP_LIST', 'ASPECT', 'AUTO_ARC_ANTENNA_AIR', 'AUTO_ARC_ANTENNA_CABLE', 'AUTO_ARC_ANTENNA_SATELLITE', 'AUTO_ARC_ANYNET_AUTO_START', 'AUTO_ARC_ANYNET_MODE_OK', 'AUTO_ARC_AUTOCOLOR_FAIL', 'AUTO_ARC_AUTOCOLOR_SUCCESS', 'AUTO_ARC_CAPTION_ENG', 'AUTO_ARC_CAPTION_KOR', 'AUTO_ARC_CAPTION_OFF', 'AUTO_ARC_CAPTION_ON', 'AUTO_ARC_C_FORCE_AGING', 'AUTO_ARC_JACK_IDENT', 'AUTO_ARC_LNA_OFF', 'AUTO_ARC_LNA_ON', 'AUTO_ARC_PIP_CH_CHANGE', 'AUTO_ARC_PIP_DOUBLE', 'AUTO_ARC_PIP_LARGE', 'AUTO_ARC_PIP_LEFT_BOTTOM', 'AUTO_ARC_PIP_LEFT_TOP', 'AUTO_ARC_PIP_RIGHT_BOTTOM', 'AUTO_ARC_PIP_RIGHT_TOP', 'AUTO_ARC_PIP_SMALL', 'AUTO_ARC_PIP_SOURCE_CHANGE', 'AUTO_ARC_PIP_WIDE', 'AUTO_ARC_RESET', 'AUTO_ARC_USBJACK_INSPECT', 'AUTO_FORMAT', 'AUTO_PROGRAM', 'AV1', 'AV2', 'AV3', 'BACK_MHP', 'BOOKMARK', 'CALLER_ID', 'CAPTION', 'CATV_MODE', 'CHDOWN', 'CHUP', 'CH_LIST', 'CLEAR', 'CLOCK_DISPLAY', 'COMPONENT1', 'COMPONENT2', 'CONTENTS', 'CONVERGENCE', 'CONVERT_AUDIO_MAINSUB', 'CUSTOM', 'CYAN', 'DEVICE_CONNECT', 'DISC_MENU', 'DMA', 'DNET', 'DNIe', 'DNSe', 'DOOR', 'DOWN', 'DSS_MODE', 'DTV', 'DTV_LINK', 'DTV_SIGNAL', 'DVD_MODE', 'DVI', 'DVR', 'DVR_MENU', 'DYNAMIC', 'ENTER', 'ENTERTAINMENT', 'ESAVING', 'EXT1', 'EXT10', 'EXT11', 'EXT12', 'EXT13', 'EXT14', 'EXT15', 'EXT16', 'EXT17', 'EXT18', 'EXT19', 'EXT2', 'EXT20', 'EXT21', 'EXT22', 'EXT23', 'EXT24', 'EXT25', 'EXT26', 'EXT27', 'EXT28', 'EXT29', 'EXT3', 'EXT30', 'EXT31', 'EXT32', 'EXT33', 'EXT34', 'EXT35', 'EXT36', 'EXT37', 'EXT38', 'EXT39', 'EXT4', 'EXT40', 'EXT41', 'EXT5', 'EXT6', 'EXT7', 'EXT8', 'EXT9', 'FACTORY', 'FAVCH', 'FF', 'FF_', 'FM_RADIO', 'GAME', 'GREEN', 'GUIDE', 'HDMI', 'HDMI1', 'HDMI2', 'HDMI3', 'HDMI4', 'HELP', 'HOME', 'ID_INPUT', 'ID_SETUP', 'INFO', 'INSTANT_REPLAY', 'LEFT', 'LINK', 'LIVE', 'MAGIC_BRIGHT', 'MAGIC_CHANNEL', 'MDC', 'MENU', 'MIC', 'MORE', 'MOVIE1', 'MS', 'MTS', 'MUTE', 'NINE_SEPERATE', 'OPEN', 'PANNEL_CHDOWN', 'PANNEL_CHUP', 'PANNEL_ENTER', 'PANNEL_MENU', 'PANNEL_POWER', 'PANNEL_SOURCE', 'PANNEL_VOLDOW', 'PANNEL_VOLUP', 'PANORAMA', 'PAUSE', 'PCMODE', 'PERPECT_FOCUS', 'PICTURE_SIZE', 'PIP_CHDOWN', 'PIP_CHUP', 'PIP_ONOFF', 'PIP_SCAN', 'PIP_SIZE', 'PIP_SWAP', 'PLAY', 'PLUS100', 'PMODE', 'POWER', 'POWEROFF', 'POWERON', 'PRECH', 'PRINT', 'PROGRAM', 'QUICK_REPLAY', 'REC', 'RED', 'REPEAT', 'RESERVED1', 'RETURN', 'REWIND', 'REWIND_', 'RIGHT', 'RSS', 'RSURF', 'SCALE', 'SEFFECT', 'SETUP_CLOCK_TIMER', 'SLEEP', 'SOURCE', 'SRS', 'STANDARD', 'STB_MODE', 'STILL_PICTURE', 'STOP', 'SUB_TITLE', 'SVIDEO1', 'SVIDEO2', 'SVIDEO3', 'TOOLS', 'TOPMENU', 'TTX_MIX', 'TTX_SUBFACE', 'TURBO', 'TV', 'TV_MODE', 'UP', 'VCHIP', 'VCR_MODE', 'VOLDOWN', 'VOLUP', 'WHEEL_LEFT', 'WHEEL_RIGHT', 'W_LINK', 'YELLOW', 'ZOOM1', 'ZOOM2', 'ZOOM_IN', 'ZOOM_MOVE', 'ZOOM_OUT'],

    findState : function () {
    },

    base64_encode : function (string) {
      return new Buffer(string).toString('base64');
    },

    /**
     * Once the connection has been established, this chunk seems to validate
     * input source.
     * "This is who I am."
     */
    chunkOne : function () {
      var ipencoded  = this.base64_encode(this.serverIp),
          macencoded = this.base64_encode(this.serverMac),
          message    = String.fromCharCode(0x64) + String.fromCharCode(0x00) + String.fromCharCode(ipencoded.length) + String.fromCharCode(0x00) + ipencoded + String.fromCharCode(macencoded.length) + String.fromCharCode(0x00) + macencoded + String.fromCharCode(this.base64_encode(this.remoteName).length) + String.fromCharCode(0x00) + this.base64_encode(this.remoteName);

      return String.fromCharCode(0x00) + String.fromCharCode(this.appString.length) + String.fromCharCode(0x00) + this.appString + String.fromCharCode(message.length) + String.fromCharCode(0x00) + message;
    },

    /**
     * This chunk seems to tell the TV which command to execute - or, text to
     * be inputted into fields.
     * "Will you please do this for me?"
     */
    chunkTwo : function () {
      var command = 'KEY_' + this.command,
          message = '';

      if(this.command) {
        message = String.fromCharCode(0x00) + String.fromCharCode(0x00) + String.fromCharCode(0x00) + String.fromCharCode(this.base64_encode(command).length) + String.fromCharCode(0x00) + this.base64_encode(command);

        console.log('Executing: ' + this.command);

        return String.fromCharCode(0x00) + String.fromCharCode(this.tvAppString.length) + String.fromCharCode(0x00) + this.tvAppString + String.fromCharCode(message.length) + String.fromCharCode(0x00) + message;
      }

      if(this.text) {
        message = String.fromCharCode(0x01) + String.fromCharCode(0x00) + String.fromCharCode(this.base64_encode(this.text).length) + String.fromCharCode(0x00) + this.base64_encode(this.text);

        console.log('Text: ' + this.text);

        return String.fromCharCode(0x01) + String.fromCharCode(this.appString.length) + String.fromCharCode(0x00) + this.appString + String.fromCharCode(message.length) + String.fromCharCode(0x00) + message;
      }
    },

    send : function (config) {
      this.deviceIp    = config.deviceIp;
      this.serverIp    = config.serverIp;
      this.serverMac   = config.serverMac;
      this.command     = config.command     || '';
      this.text        = config.text        || '';
      this.devicePort  = config.devicePort  || 55000;
      this.appString   = config.appString   || "iphone..iapp.samsung";
      this.tvAppString = config.tvAppString || "iphone.UN60ES8000.iapp.samsung";
      this.remoteName  = config.remoteName  || "Node.js Samsung Remote";
      this.cbConnect   = config.cbConnect   || function () {};
      this.cbError     = config.cbError     || function () {};

      var that         = this,
          net          = require('net'),
          socket       = net.connect(this.devicePort, this.deviceIp);

      socket.on('connect', function() {
        socket.write(that.chunkOne());
        socket.write(that.chunkTwo());

        socket.end();

        that.cbConnect();
      });

      socket.on('error', function(error) {
        var errorMsg = '';

        if(error.code === 'EHOSTUNREACH' || error.code === 'ECONNREFUSED') {
          errorMsg = 'Device is off or unreachable';
        }

        else {
          errorMsg = error.code;
        }

        console.log(errorMsg);

        that.cbError(errorMsg);
      });
    }
  };
} ());