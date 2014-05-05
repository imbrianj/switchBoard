/*jslint white: true */
/*global App, module, require, console */

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
          'User-Agent'     : 'twilio-node-universal-controller',
          'Content-Type'   : 'application/x-www-form-urlencoded',
          'Content-Length' : config.postRequest.length
        }
      };
    },

    /**
     * Prepare a POST data the request.
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

        response.on('data', function(response) {
          console.log('SMS: Connected');

          sms.callback(null, response);
        });
      });

      request.on('error', function(err) {
        var errorMsg = '';

        if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
          errorMsg = 'SMS: API is unreachable';
        }

        else {
          errorMsg = 'SMS: ' + err.code;
        }

        console.log(errorMsg);

        sms.callback(errorMsg);
      });

      request.write(sms.postRequest);

      request.end();
    }
  };
}());