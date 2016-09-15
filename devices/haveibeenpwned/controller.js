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
   * @fileoverview Grabs any pages a given account may have been pwned on.
   * @requires https
   * @note https://haveibeenpwned.com/API/v2
   */
  return {
    version : 20160904,

    inputs  : ['list'],

    /**
     * Reference template fragment to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { allClear : fs.readFileSync(__dirname + '/fragments/allClear.tpl', 'utf-8'),
               pwns     : fs.readFileSync(__dirname + '/fragments/pwns.tpl',     'utf-8'),
               pwn      : fs.readFileSync(__dirname + '/fragments/pwn.tpl',      'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (haveibeenpwned) {
      var method  = haveibeenpwned.method || 'GET';

      return {
        host    : haveibeenpwned.host,
        port    : haveibeenpwned.port,
        path    : haveibeenpwned.path,
        method  : method,
        headers : {
          'Accept'         : 'application/vnd.haveibeenpwned.v2+json',
          'Accept-Charset' : 'utf-8',
          'User-Agent'     : 'node-switchBoard',
          'api-version'    : 2
        }
      };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);

      return controller;
    },

    /**
     * Accept the JSON formatted API response and parse through and returning an
     * array of sanitized values.
     */
    getPwns : function (data) {
      var util = require(__dirname + '/../../lib/sharedUtil').util,
          pwns = [],
          i    = 0;

      if (data) {
        for (i; i < data.length; i += 1) {
          pwns.push({
            title       : util.sanitize(data[i].Title),
            domain      : util.sanitize(data[i].Domain),
            date        : util.sanitize(data[i].BreachDate),
            description : util.sanitize(data[i].Description),
            data        : util.sanitize(data[i].DataClasses.join (', '))
          });
        }
      }

      return pwns;
    },

    send : function (config) {
      var https          = require('https'),
          that           = this,
          haveibeenpwned = {},
          dataReply      = '',
          request;

      haveibeenpwned.deviceId  = config.device.deviceId;
      haveibeenpwned.host      = config.device.host || 'haveibeenpwned.com';
      haveibeenpwned.path      = '/api/v2/breachedaccount/' + config.device.username;
      haveibeenpwned.port      = config.device.port || 443;
      haveibeenpwned.callback  = config.callback    || function () {};

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

      request = https.request(this.postPrepare(haveibeenpwned), function (response) {
        response.setEncoding('utf8');

        response.on('data', function (response) {
          dataReply += response;
        });

        response.once('end', function () {
          var data               = null,
              haveibeenpwnedData = [];

          if (dataReply) {
            try {
              data = JSON.parse(dataReply);
            }

            catch (err) {
              haveibeenpwned.callback('API returned an unexpected value');
            }
          }

          if (!dataReply || data) {
            haveibeenpwnedData = that.getPwns(data);

            haveibeenpwned.callback(null, haveibeenpwnedData);
          }
        });
      });

      request.on('error', function() {
        haveibeenpwned.callback('API failed to connect');
      });

      request.end();
    }
  };
}());
