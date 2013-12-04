/*jslint white: true */
/*global exports, String, Buffer, require, console */

exports.panasonicController = exports.panasonicController || (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control of Panasonic Smart TV
   * @requires http
   * @note This is a full-scale rip-off of the fine work done here:
   *       http://cocoontech.com/forums/topic/21266-panasonic-viera-plasma-ip-control/page-2
   */
  return {
    version : '0.0.0.0.1 alpha',
    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['30S_SKIP', '3D', 'BD', 'BLUE', 'CANCEL', 'CC', 'CHG_INPUT', 'CHG_NETWORK', 'CH_DOWN', 'CH_UP', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'DATA', 'DIGA_CTL', 'DISP_MODE', 'DMS_CH_DOWN', 'DMS_CH_UP', 'DOWN', 'DRIVE', 'ECO', 'ENTER', 'EPG', 'EZ_SYNC', 'FAVORITE', 'FF', 'GAME', 'GREEN', 'HOLD', 'INDEX', 'INFO', 'INTERNET', 'LEFT', 'MENU', 'MPX', 'MUTE', 'OFFTIMER', 'PAUSE', 'PICTAI', 'PLAY', 'POWER', 'PROG', 'P_NR', 'REC', 'RECLIST', 'RED', 'RETURN', 'REW', 'RIGHT', 'R_SCREEN', 'R_TUNE', 'R_TUNE', 'SAP', 'SD_CARD', 'SKIP_NEXT', 'SKIP_PREV', 'SPLIT', 'STOP', 'STTL', 'SUBMENU', 'SWAP', 'TEXT', 'TV', 'TV_MUTE_OFF', 'TV_MUTE_ON', 'UP', 'VIERA_LINK', 'VOD', 'VOLDOWN', 'VOLUP', 'VTOOLS', 'YELLOW'],

    /**
     * Prepare a POST request for a command.
     */
    postPrepare : function (that) {
      var path    = '/',
          method  = 'POST';

      if(that.command || that.text) {
        path += 'nrc/control_0';
      }

      else {
        path += 'dmr/control_0';
      }

      return {
        host    : that.deviceIp,
        port    : that.devicePort,
        path    : path,
        method  : method
      };
    },

    /**
     * Prepare a POST data the request.
     */
    postData : function (that) {
      var response = '',
          action   = 'X_SendKey',
          urn      = 'panasonic-com:service:p00NetworkControl:1',
          value    = '<X_KeyEvent>NRC_' + that.command + '</X_KeyEvent>';

      if(that.text) {
        action = 'X_SendString';
        urn    = 'panasonic-com:service:p00NetworkControl:1';
        value  = '<X_String>' + that.text + '</X_String>';
      }

      response += '<?xml version="1.0" encoding="utf-8"?>';
      response += '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">';
      response += '<s:Body>';
      response += '  <u:' + action + ' xmlns:u="urn:' + urn + '">';
      response += '    ' + value;
      response += '  </u:' + action + '>';
      response += '</s:Body>';
      response += '</s:Envelope>';

      return response;
    },

    send : function (config) {
      this.deviceIp   = config.deviceIp;
      this.command    = config.command    || '';
      this.text       = config.text       || '';
      this.devicePort = config.devicePort || 55000;
      this.cbConnect  = config.cbConnect  || function () {};
      this.cbError    = config.cbError    || function () {};

      var that        = this,
          http        = require('http'),
          dataReply   = '',
          request;

      request = http.request(this.postPrepare(that), function(response) {
                  response.on('data', function(response) {
                    console.log('connected');

                    dataReply += response;
                  });

                  response.on('end', function() {
                    that.cbConnect(dataReply);
                  });
                });


      request.on('error', function(error) {
        var errorMsg = '';

        if(error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
          errorMsg = 'Device is off or unreachable';
        }

        else {
          errorMsg = error.code;
        }

        console.log(errorMsg);

        that.cbError(errorMsg);
      });

      request.write(this.postData(that));
      request.end();

      return dataReply;
    }
  };
} ());