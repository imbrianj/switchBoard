/*jslint white: true */
/*global module, Buffer, String, require, console */

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
   * @fileoverview Basic control of XBMC
   * @requires http
   * @note Refernce docs:
   *       http://wiki.xbmc.org/index.php?title=JSON-RPC_API/Examples
   */
  return {
    version : 20140824,

    inputs  : ['command', 'text'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['UP', 'DOWN', 'LEFT', 'RIGHT', 'HOME', 'SELECT', 'BACK', 'POWEROFF'],

    /**
     * Map inputted commands to the values the device or API is expecting.
     */
    hashTable : { 'UP'       : 'Up',
                  'DOWN'     : 'Down',
                  'LEFT'     : 'Left',
                  'RIGHT'    : 'Right',
                  'HOME'     : 'Home',
                  'SELECT'   : 'Select',
                  'BACK'     : 'Back',
                  'POWEROFF' : 'Shutdown' },
    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      var request = { host    : config.deviceIp,
                      port    : config.devicePort,
                      path    : '/jsonrpc?' + config.command,
                      method  : config.method,
                      headers : {
                        'Accept'         : 'application/json',
                        'Accept-Charset' : 'utf-8',
                        'User-Agent'     : 'node-switchBoard',
                        'Content-Type'   : 'application/json'
                      }
                    };

      if(config.postRequest) {
        request.headers['Content-Length'] = config.postRequest.length;
      }

      return request;
    },

    /**
     * Prepare the POST data to be sent.
     */
    postData : function (xbmc) {
      var value;

      value = { id      : xbmc.appId || 1,
                jsonrpc : '2.0',
                method  : xbmc.command };

      if(xbmc.text) {
        value.id = 0;
        value.params = { text : xbmc.text, done : false };
      }

      return JSON.stringify(value);
    },

    /**
     * Prepares and calls send() to request the current state.
     */
    state : function (controller, config, callback) {
      var xbmc = { device : {}, config : {}};

      callback                 = callback || function() {};
      xbmc.command             = 'state';
      xbmc.device.deviceId     = controller.config.deviceId;
      xbmc.device.deviceIp     = controller.config.deviceIp;
      xbmc.device.devicePort   = controller.config.devicePort;
      xbmc.device.localTimeout = controller.config.localTimeout || config.localTimeout;

      xbmc.callback = function (err, reply) {
        if(reply) {
          callback(xbmc.device.deviceId, null, 'ok');
        }

        else if(err) {
          callback(xbmc.device.deviceId, err);
        }
      };

      this.send(xbmc);
    },

    send : function (config) {
      var http        = require('http'),
          xbmc        = {},
          dataReply   = '',
          request;

      xbmc.deviceIp   = config.device.deviceIp;
      xbmc.devicePort = config.device.devicePort;
      xbmc.command    = this.hashTable[config.command] || '';
      xbmc.text       = config.text                    || '';
      xbmc.devicePort = config.devicePort              || 8080;
      xbmc.method     = config.method                  || 'POST';
      xbmc.callback   = config.callback                || function () {};

      if(xbmc.text) {
        xbmc.command = 'SendText';
      }

      if(xbmc.command === 'state') {
        xbmc.command = 'Player.GetActivePlayers';
      }

      else {
        xbmc.command = 'Input.' + xbmc.command;
      }

      if(xbmc.method === 'POST') {
        xbmc.postRequest = this.postData(xbmc);
      }

      request = http.request(this.postPrepare(xbmc), function(response) {
                  response.on('data', function(response) {
                    dataReply += response;
                  });

                  response.once('end', function() {
                    xbmc.callback(null, dataReply);
                  });
                });

      request.once('error', function(err) {
        xbmc.callback(err);
      });

      if(xbmc.method === 'POST') {
        request.write(xbmc.postRequest);
      }

      request.end();

      return dataReply;
    }
  };
}());
