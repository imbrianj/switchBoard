/*jslint white: true */
/*global module, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control of Panasonic Smart TV
   * @requires http
   * @note This is a full-scale rip-off of the fine work done here:
   *       http://cocoontech.com/forums/topic/21266-panasonic-viera-plasma-ip-control/page-2
   */
  return {
    version : 20140312,

    inputs  : ['command', 'text'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['30S_SKIP', '3D', 'BD', 'BLUE', 'CANCEL', 'CC', 'CHG_INPUT', 'CHG_NETWORK', 'CH_DOWN', 'CH_UP', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'DATA', 'DIGA_CTL', 'DISP_MODE', 'DMS_CH_DOWN', 'DMS_CH_UP', 'DOWN', 'DRIVE', 'ECO', 'ENTER', 'EPG', 'EZ_SYNC', 'FAVORITE', 'FF', 'GAME', 'GREEN', 'HOLD', 'INDEX', 'INFO', 'INTERNET', 'LEFT', 'MENU', 'MPX', 'MUTE', 'OFFTIMER', 'PAUSE', 'PICTAI', 'PLAY', 'POWER', 'PROG', 'P_NR', 'REC', 'RECLIST', 'RED', 'RETURN', 'REW', 'RIGHT', 'R_SCREEN', 'R_TUNE', 'R_TUNE', 'SAP', 'SD_CARD', 'SKIP_NEXT', 'SKIP_PREV', 'SPLIT', 'STOP', 'STTL', 'SUBMENU', 'SWAP', 'TEXT', 'TV', 'TV_MUTE_OFF', 'TV_MUTE_ON', 'UP', 'VIERA_LINK', 'VOD', 'VOLDOWN', 'VOLUP', 'VTOOLS', 'YELLOW'],

    /**
     * Prepare a POST request for a command.
     */
    postPrepare : function (panasonic) {
      var path    = '/',
          method  = 'POST';

      if(panasonic.command || panasonic.text) {
        path += 'nrc/control_0';
      }

      else {
        path += 'dmr/control_0';
      }

      return {
        host    : panasonic.deviceIp,
        port    : panasonic.devicePort,
        path    : path,
        method  : method,
        headers : {
                    'content-type'  : 'text/xml',
                    'accept'        : 'text/xml',
                    'cache-control' : 'no-cache',
                    'pragma'        : 'no-cache',
                    'soapaction'    : '"urn:panasonic-com:service:p00NetworkControl:1#X_SendKey"'
                  }
      };
    },

    /**
     * Prepare a POST data the request.
     */
    postData : function (panasonic) {
      var response = '',
          action   = 'X_SendKey',
          urn      = 'panasonic-com:service:p00NetworkControl:1',
          value    = '<X_KeyEvent>NRC_' + panasonic.command + '-ONOFF</X_KeyEvent>';

      if(panasonic.text) {
        action = 'X_SendString';
        urn    = 'panasonic-com:service:p00NetworkControl:1';
        value  = '<X_String>' + panasonic.text + '</X_String>';
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
      var http             = require('http'),
          panasonic        = {},
          dataReply        = '',
          request;

      panasonic.deviceIp   = config.device.deviceIp;
      panasonic.command    = config.command    || '';
      panasonic.text       = config.text       || '';
      panasonic.devicePort = config.devicePort || 55000;
      panasonic.callback   = config.callback   || function () {};

      request = http.request(this.postPrepare(panasonic), function(response) {
                  response.on('data', function(response) {
                    console.log('connected');

                    dataReply += response;
                  });

                  response.on('end', function() {
                    panasonic.callback(null, dataReply);
                  });
                });


      request.on('error', function(error) {
        var errorMsg = '';

        if(error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
          errorMsg = 'Panasonic: Device is off or unreachable';
        }

        else {
          errorMsg = 'Panasonic: ' + error.code;
        }

        console.log(errorMsg);

        panasonic.callback(errorMsg);
      });

      request.write(this.postData(panasonic));
      request.end();

      return dataReply;
    }
  };
}());