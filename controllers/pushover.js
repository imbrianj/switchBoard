/*jslint white: true */
/*global module, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @requires querystring, https
   * @fileoverview Basic control of Pushover notification API.
   */
  return {
    version : 20140401,

    inputs  : ['text'],

    /**
     * Prepare a POST request for a command.
     */
    postPrepare : function(config) {
      return {
        host    : config.host,
        port    : config.port,
        path    : config.path,
        method  : config.method,
        headers : {
          'Accept'         : 'application/json',
          'Accept-Charset' : 'utf-8',
          'User-Agent'     : 'pushover-node-universal-controller',
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

    send : function(config) {
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

        response.on('data', function(response) {
          console.log('Pushover: Connected');

          pushover.callback(null, response);
        });
      });

      request.on('error', function(err) {
        var errorMsg = '';

        if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
          errorMsg = 'Pushover: API is unreachable';
        }

        else {
          errorMsg = 'Pushover: ' + err.code;
        }

        console.log(errorMsg);

        pushover.callback(errorMsg);
      });

      request.write(pushover.postRequest);

      request.end();
    }
  };
}());