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
   * @fileoverview Grabs location data provided by Tasker firing against this
   *               API endpoint:
   *               https://github.com/imbrianj/switchboard-phpServer
   * @requires http, https
   */
  return {
    version : 20151010,

    inputs  : ['list'],

    /**
     * Reference template fragment to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { item : fs.readFileSync(__dirname + '/fragments/location.tpl', 'utf-8') };
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
    postData : function (location) {
      var value;

      if(location.args) {
        value = JSON.stringify(location.args);
      }

      else {
        value = 'user=' + location.username + '&pass=' + location.password + '&count=' + location.maxCount;
      }

      return value;
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller, config) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    /**
     * Accept the JSON formatted API response and parse through and returning an
     * array of sanitized values.
     */
    getLocations : function (reply, maxCount) {
      var sharedUtil   = require(__dirname + '/../../lib/sharedUtil').util,
          location     = {},
          locationData = [],
          i            = 0,
          j            = 0;

      maxCount = maxCount || 10;

      for(i in reply) {
        location = reply[i];

        if((location.lat) && (location.long)) {
          locationData[j] = { lat   : sharedUtil.sanitize(location.lat),
                              long  : sharedUtil.sanitize(location.long),
                              alt   : sharedUtil.sanitize(location.alt),
                              url   : sharedUtil.sanitize(location.link),
                              speed : sharedUtil.sanitize(location.speed),
                              name  : sharedUtil.sanitize(location.user),
                              time  : sharedUtil.sanitize(location.time * 1000) };

          j += 1;
        }

        if(j >= maxCount) {
          break;
        }
      }

      return locationData;
    },

    send : function (config) {
      var http      = config.device.port === 443 ? require('https') : require('http'),
          that      = this,
          location  = {},
          dataReply = '',
          request;

      location.deviceId = config.device.deviceId;
      location.host     = config.device.host;
      location.path     = config.device.path     || '/location/';
      location.port     = config.device.port     || 80;
      location.method   = config.device.method   || 'POST';
      location.username = config.device.username || '';
      location.password = config.device.password || '';
      location.maxCount = config.device.maxCount || 10;
      location.callback = config.callback        || function () {};

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

      if(location.method === 'POST') {
        location.postRequest = this.postData(location);
      }

      request = http.request(this.postPrepare(location), function (response) {
        response.setEncoding('utf8');

        response.on('data', function (response) {
          dataReply += response;
        });

        response.once('end', function () {
          var deviceState  = require(__dirname + '/../../lib/deviceState'),
              data         = null,
              locationData;

          if(dataReply) {
            try {
              locationData = JSON.parse(dataReply);
            }

            catch(err) {
              location.callback('API returned an unexpected value');
            }

            if(locationData) {
              locationData = that.getLocations(locationData, location.maxCount);

              location.callback(null, locationData);
            }
          }
        });
      });

      request.once('error', function (err) {
        location.callback(err);
      });

      if(location.method === 'POST') {
        request.write(location.postRequest);
      }

      request.end();
    }
  };
}());
