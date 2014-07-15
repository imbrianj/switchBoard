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
   * @requires http, fs, request
   * @fileoverview Basic control of Foscam IP camera.
   */
  return {
    version : 20140709,

    inputs  : ['command', 'list'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['Take'],

    postPrepare : function (config) {
      var path  = '',
          login = '?user=' + config.username + '&amp;pwd=' + config.password + '&amp;';

      switch(config.command) {
        case 'Take' :
          path = '/snapshot.cgi' + login;
        break;

        case 'Params' :
          path = '/get_params.cgi' + login;
        break;
      }

      return { host   : config.deviceIp,
               port   : config.devicePort,
               path   : path,
               method : 'GET' };
    },

    init : function (controller, config) {
      var callback = function(deviceId, err, state, params) {
        var deviceState = require('../lib/deviceState');

        params.state = state;

        deviceState.updateState(deviceId, 'foscam', params);
      };

      this.state(controller, callback);

      controller.markup = controller.markup.replace('{{FOSCAM_DYNAMIC}}', 'http://' + controller.config.deviceIp + '/videostream.cgi?user=' + controller.config.username + '&amp;pwd=' + controller.config.password);

      return controller;
    },

    state : function (controller, callback, config) {
      var foscam = { device : {}, config : {} };

      foscam.device.deviceId = controller.config.deviceId;
      foscam.device.deviceIp = controller.config.deviceIp;
      foscam.device.username = controller.config.username;
      foscam.device.password = controller.config.password;
      foscam.command         = 'Params';

      foscam.callback = function (err, reply) {
        var params  = { value : '' };

        if(reply) {
          if(reply.toString().indexOf('var alarm_motion_armed=0') !== -1) {
            params.value = 'off';
          }

          else if(reply.toString().indexOf('var alarm_motion_armed=1') !== -1) {
            params.value = 'on';
          }

          callback(foscam.device.deviceId, null, 'ok', params);
        }

        else if(err) {
          foscam.callback(foscam.device.deviceId, 'err', 'err');
        }
      };

      this.send(foscam);
    },

    onload : function (controller) {
      var parser = require(__dirname + '/../parsers/foscam').foscam;

      return parser(controller.deviceId, controller.markup, State[controller.config.deviceId].state, State[controller.config.deviceId].value);
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
            console.log('\x1b[35mFoscam\x1b[0m: Skipping image - already exists');
          }

          else {
            request    = require('request');
            controller = require('./foscam');
            postData   = controller.postPrepare(foscam);

            console.log('\x1b[35mFoscam\x1b[0m: Saved image');

            request('http://' + postData.host + ':' + postData.port + postData.path).pipe(fs.createWriteStream(filePath));
          }
        });
      }

      else {
        request = http.request(this.postPrepare(foscam), function(response) {
          response.on('data', function(response) {
            console.log('\x1b[32mFoscam\x1b[0m: Connected');

            dataReply += response;
          });

          response.once('end', function() {
            if(dataReply) {
              foscam.callback(null, dataReply);
            }
          });
        });

        request.once('error', function(err) {
          var errorMsg = '';

          if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
            errorMsg = '\x1b[31mFoscam\x1b[0m: Device is off or unreachable';
          }

          else {
            errorMsg = '\x1b[31mFoscam\x1b[0m: ' + err.code;
          }

          console.log(errorMsg);

          foscam.callback(errorMsg);
        });

        request.end();
      }
    }
  };
}());
