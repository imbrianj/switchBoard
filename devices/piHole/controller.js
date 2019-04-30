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
   * @fileoverview Displays simple Pi-Hole stats.
   * @requires http
   */
  return {
    version : 20190429,

    readOnly: true,

    inputs  : ['list'],

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (pihole) {
      var method  = pihole.method || 'GET';

      return {
        host    : pihole.host,
        port    : pihole.port,
        path    : pihole.path,
        method  : method,
        headers : {
          'Accept'         : 'application/json',
          'Accept-Charset' : 'utf-8',
          'User-Agent'     : 'node-switchBoard'
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
     * object of sanitized values.
     */
    getData : function (data) {
      var util = require(__dirname + '/../../lib/sharedUtil').util;

      return data ? {
        cached              : util.sanitize(data.queries_cached),
        domainsBlocked      : util.sanitize(data.domains_being_blocked),
        forwarded           : util.sanitize(data.queries_forwarded),
        lastUpdate          : new Date(data.gravity_last_updated.absolute).getTime() * 1000,
        percentBlockedToday : util.sanitize(data.ads_percentage_today),
        queriesBlockedToday : util.sanitize(data.ads_blocked_today),
        queriesToday        : util.sanitize(data.dns_queries_today)
      } : {};
    },

    send : function (config) {
      var http      = require('http'),
          that      = this,
          pihole    = {},
          dataReply = '',
          request;

      pihole.deviceId  = config.device.deviceId;
      pihole.host      = config.device.host || 'localhost';
      pihole.path      = '/admin/api.php?summary';
      pihole.port      = config.device.port || 80;
      pihole.callback  = config.callback    || function () {};

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

      request = http.request(this.postPrepare(pihole), function (response) {
        response.setEncoding('utf8');

        response.on('data', function (response) {
          dataReply += response;
        });

        response.once('end', function () {
          var data       = null,
              piholeData = [];

          if (dataReply) {
            try {
              data = JSON.parse(dataReply);
            }

            catch (catchErr) {
              pihole.callback('API returned an unexpected value');
            }
          }

          if (!dataReply || data) {
            piholeData = that.getData(data);

            pihole.callback(null, piholeData);
          }
        });
      });

      request.on('error', function() {
        pihole.callback('API failed to connect');
      });

      request.end();
    }
  };
}());
