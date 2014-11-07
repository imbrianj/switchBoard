/*jslint white: true */
/*global module, require, console */

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
   * @fileoverview Basic control of Twilio text messaging API.
   */
  return {
    version : 20140813,

    inputs  : ['text'],

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function(config) {
      return {
        auth    : config.twilioSid + ':' + config.twilioToken,
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
     * Prepare the POST data to be sent.
     */
    postData : function (sms) {
      var querystring = require('querystring');

      return querystring.stringify({
               From : sms.twilioPhone,
               To   : sms.phone,
               Body : sms.text
             });
    },

    /**
     * We should expect that Twilio won't be down, so we'll set it's initial
     * state to explicitly be "ok".
     */
    init : function (controller) {
      var deviceState = require(__dirname + '/../lib/deviceState');

      deviceState.updateState(controller.config.deviceId, controller.config.typeClass, { state : 'ok' });
    },

    send : function(config) {
      var https       = require('https'),
          sms         = {},
          postRequest = '',
          request;

      sms.phone       = config.phone       || config.device.phone;
      sms.twilioSid   = config.twilioSid   || config.device.twilioSid;
      sms.twilioToken = config.twilioToken || config.device.twilioToken;
      sms.twilioPhone = config.twilioPhone || config.device.twilioPhone || '';
      sms.host        = config.host        || 'api.twilio.com';
      sms.path        = config.path        || '/2010-04-01/Accounts/' + sms.twilioSid + '/Messages.json';
      sms.port        = config.port        || 443;
      sms.method      = config.method      || 'POST';
      sms.text        = config.text        || '';
      sms.callback    = config.callback    || function () {};
      sms.postRequest = this.postData(sms);

      request = https.request(this.postPrepare(sms), function(response) {
        response.setEncoding('utf8');

        response.once('data', function(response) {
          sms.callback(null, response);
        });
      });

      request.once('error', function(err) {
        sms.callback(err);
      });

      request.write(sms.postRequest);

      request.end();
    }
  };
}());
