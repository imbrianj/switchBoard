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
   * @requires querystring, https
   * @fileoverview Basic control of Pushover notification API.
   */
  return {
    version : 20140813,

    inputs  : ['text'],

    /**
     * Prepare a POST request for a command.
     */
    postPrepare : function (config) {
      return {
        host    : config.host,
        port    : config.port,
        path    : config.path,
        method  : config.method,
        headers : {
          'Accept'         : 'application/json',
          'Accept-Charset' : 'utf-8',
          'User-Agent'     : 'node-switchBoard',
          'Content-Type'   : 'application/x-www-form-urlencoded',
          'Content-Length' : config.postRequest.length
        }
      };
    },

    /**
     * Prepare a POST data the request.
     */
    postData : function (pushover) {
      var querystring = require('querystring');

      return querystring.stringify({
               token   : pushover.token,
               user    : pushover.userKey,
               message : pushover.text
             });
    },

    init : function (controller) {
      var deviceState = require(__dirname + '/../lib/deviceState');

      deviceState.updateState(controller.config.deviceId, controller.config.typeClass, { state : 'ok' });
    },

    send : function (config) {
      var https       = require('https'),
          pushover    = {},
          postRequest = '',
          request;

      pushover.token       = config.token    || config.device.token;
      pushover.userKey     = config.userKey  || config.device.userKey;
      pushover.host        = config.host     || 'api.pushover.net';
      pushover.path        = config.path     || '/1/messages.json';
      pushover.port        = config.port     || 443;
      pushover.method      = config.method   || 'POST';
      pushover.text        = config.text     || '';
      pushover.callback    = config.callback || function () {};
      pushover.postRequest = this.postData(pushover);

      request = https.request(this.postPrepare(pushover), function(response) {
        response.setEncoding('utf8');

        response.once('data', function(response) {
          pushover.callback(null, response);
        });
      });

      request.once('error', function(err) {
        pushover.callback(err);
      });

      request.write(pushover.postRequest);

      request.end();
    }
  };
}());
