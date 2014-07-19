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
   * @fileoverview Basic control of Twilio text messaging API.
   */
  return {
    version : 20140329,

    inputs  : ['text'],

    /**
     * Prepare a POST request for a command.
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
     * Prepare a POST data for the request.
     */
    postData : function (sms) {
      var querystring = require('querystring');

      return querystring.stringify({
               From : sms.twilioPhone,
               To   : sms.phone,
               Body : sms.text
             });
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
          console.log('\x1b[35mSMS\x1b[0m: Connected');

          sms.callback(null, response);
        });
      });

      request.once('error', function(err) {
        var errorMsg = '';

        if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
          errorMsg = '\x1b[31mSMS\x1b[0m: API is unreachable';
        }

        else {
          errorMsg = '\x1b[31mSMS\x1b[0m: ' + err.code;
        }

        console.log(errorMsg);

        sms.callback(errorMsg);
      });

      request.write(sms.postRequest);

      request.end();
    }
  };
}());
