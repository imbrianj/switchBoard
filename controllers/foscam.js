/*jslint white: true */
/*global module, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control of Foscam IP camera.
   */
  return {
    version : 20140329,

    inputs  : ['command', 'list'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['AlarmOff', 'AlarmOn', 'Down', 'Left', 'Preset1', 'Preset2', 'Preset3', 'Right', 'Stop', 'Up', 'Take'],

    postPrepare : function (config) {
      var path  = '',
          login = '?user=' + config.username + '&pwd=' + config.password + '&';

      switch(config.command) {
        case 'AlarmOff' :
          path = '/set_alarm.cgi' + login + 'motion_armed=1';
        break;

        case 'AlarmOn' :
          path = '/set_alarm.cgi' + login + 'motion_armed=0';
        break;

        case 'Down' :
          path = '/decoder_control.cgi' + login + 'command=2';
        break;

        case 'Left' :
          path = '/decoder_control.cgi' + login + 'command=6';
        break;

        case 'Preset1' :
          path = '/decoder_control.cgi' + login + 'command=31';
        break;

        case 'Preset2' :
          path = '/decoder_control.cgi' + login + 'command=33';
        break;

        case 'Preset3' :
          path = '/decoder_control.cgi' + login + 'command=35';
        break;

        case 'Right' :
          path = '/decoder_control.cgi' + login + 'command=4';
        break;

        case 'Stop' :
          path = '/decoder_control.cgi' + login + 'command=1';
        break;

        case 'Up' :
          path = '/decoder_control.cgi' + login + 'command=0';
        break;

        case 'Take' :
          path = '/snapshot.cgi' + login;
        break;
      }

      return { host   : config.deviceIp,
               port   : config.devicePort,
               path   : path,
               method : 'GET' };
    },

    onload : function (controller) {
      return controller.markup.replace('{{FOSCAM_DYNAMIC}}', 'http://' + controller.config.deviceIp + '/videostream.cgi?user=' + controller.config.username + '&pwd=' + controller.config.password);
    },

    send : function (config) {
      var http      = require('http'),
          fs        = require('fs'),
          filePath  = __dirname + '/../images/foscam/' + Date.now() + '.jpg',
          foscam    = {},
          dataReply = '',
          request;

      foscam.deviceIp   = config.device.deviceIp;
      foscam.username   = config.device.username;
      foscam.password   = config.device.password;
      foscam.command    = config.command           || '';
      foscam.devicePort = config.device.devicePort || 80;
      foscam.callback   = config.callback          || function () {};

      if(config.command === 'Take') {
        fs.exists(filePath, function(exists) {
          var request,
              controller,
              postData;

          if(exists) {
            console.log('Foscam: Skipping image - already exists');
          }

          else {
            request    = require('request');
            controller = require('./foscam');
            postData   = controller.postPrepare(foscam);

            console.log('Foscam: Saved image');

            request('http://' + postData.host + ':' + postData.port + postData.path).pipe(fs.createWriteStream(filePath));
          }
        });
      }

      else {
        request = http.request(this.postPrepare(foscam), function(response) {
          response.on('data', function(response) {
            console.log('Foscam: Connected');

            foscam.callback(null, dataReply);
          });
        });

        request.on('error', function(err) {
          var errorMsg = '';

          if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
            errorMsg = 'Foscam: Device is off or unreachable';
          }

          else {
            errorMsg = 'Foscam: ' + err.code;
          }

          console.log(errorMsg);

          foscam.callback(errorMsg);
        });

        request.end();
      }
    }
  };
}());