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
   * @fileoverview Grabs geiger counter data provided by a GQ brand geiger
   *               counter firing against this API endpoint:
   *               https://github.com/imbrianj/switchboard-phpServer
   * @requires http, https
   */
  return {
    version : 20200322,

    readOnly: true,

    inputs  : ['list'],

    /**
     * Reference template fragment to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { report : fs.readFileSync(__dirname + '/fragments/report.tpl', 'utf-8'),
               graph  : fs.readFileSync(__dirname + '/fragments/graph.tpl', 'utf-8') };
    },

    /**
     * Prepare a request for command execution.
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
     * Prepare the POST data to be sent.
     */
    postData : function (geiger) {
      var value;

      if (geiger.args) {
        value = JSON.stringify(geiger.args);
      }

      else {
        value = 'type=geiger&user=' + geiger.username + '&pass=' + geiger.password + '&count=' + geiger.maxCount;
      }

      return value;
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    maxQuality : { cpm : 50,    acpm : 3000,     usv : 0.30 },
    units      : { cpm : 'cpm', acpm : 'acpm', usv : 'μSv/h' },

    /**
     * Accept the JSON formatted API response and parse through and returning an
     * array of sanitized values.
     */
    getReadings : function (reply, maxCount) {
      var util       = require(__dirname + '/../../lib/sharedUtil').util,
          geiger     = {},
          geigerData = [],
          i          = 0,
          type;

      maxCount = maxCount || 10;

      for (i; i < reply.length; i += 1) {
        if (reply.hasOwnProperty(i)) {
          if (i >= maxCount) {
            break;
          }

          geiger        = reply[i];
          geigerData[i] = [];

          for (type in this.maxQuality) {
            if (geiger[type]) {
              geigerData[i].push({
                gid   : util.sanitize(geiger.gid),
                name  : util.sanitize(geiger.user),
                time  : util.sanitize(geiger.time * 1000),
                type  : type,
                value : util.sanitize(geiger[type]),
                units : util.sanitize(this.units[type]),
                max   : util.sanitize(this.maxQuality[type]),
                high  : Number((util.sanitize(this.maxQuality[type]) / 2).toFixed(3))
              });
            }
          }
        }
      }

      return { report : geigerData };
    },

    send : function (config) {
      var http      = config.device.port === 443 ? require('https') : require('http'),
          that      = this,
          geiger    = {},
          dataReply = '',
          request;

      geiger.deviceId = config.device.deviceId;
      geiger.host     = config.device.host;
      geiger.path     = config.device.path     || '/geiger.php';
      geiger.port     = config.device.port     || 80;
      geiger.method   = config.device.method   || 'POST';
      geiger.username = config.device.username || '';
      geiger.password = config.device.password || '';
      geiger.maxCount = config.device.maxCount || 10;
      geiger.callback = config.callback        || function () {};

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

      if (geiger.method === 'POST') {
        geiger.postRequest = this.postData(geiger);
      }

      request = http.request(this.postPrepare(geiger), function (response) {
        response.setEncoding('utf8');

        response.on('data', function (response) {
          dataReply += response;
        });

        response.once('end', function () {
          var geigerData;

          if (dataReply) {
            try {
              geigerData = JSON.parse(dataReply);
            }

            catch (catchErr) {
              geiger.callback('API returned an unexpected value');
            }

            if (geigerData) {
              geigerData = that.getReadings(geigerData, geiger.maxCount);

              geiger.callback(null, geigerData);
            }
          }
        });
      });

      request.once('error', function (err) {
        geiger.callback(err);
      });

      if (geiger.method === 'POST') {
        request.write(geiger.postRequest);
      }

      request.end();
    }
  };
}());
