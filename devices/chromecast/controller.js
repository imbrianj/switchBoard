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
   * @fileoverview Grab what little useful data we can from Chromecast
   *               (is it on?).  Allow sending a YouTube ID through to remotely
   *               play a given video.
   * @requires http
   * @note This is wouldn't be possible without the fine work done here:
   *       http://fiquett.com/2013/07/chromecast-traffic-sniffing/
   */
  return {
    version : 20171031,

    readOnly: true,

    inputs  : ['state', 'text'],

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      var headers = { host    : config.deviceIp,
                      port    : config.devicePort,
                      path    : config.path,
                      method  : config.method,
                      headers : {
                        'Accept'         : 'application/json',
                        'Accept-Charset' : 'utf-8',
                        'User-Agent'     : 'node-switchBoard'
                      }
                    };

      if (config.method === 'POST') {
        headers.headers['Content-Type']   = 'application/x-www-form-urlencoded';
        headers.headers['Content-Length'] = config.postRequest.length;
      }

      return headers;
    },

    /**
     * Prepare the POST data to be sent.
     */
    postData : function (chromecast) {
      var util    = require(__dirname + '/../../lib/sharedUtil').util,
          videoId = null;

      if ((chromecast.text) && (chromecast.text.length === 11)) {
        videoId = 'v=' + util.sanitize(chromecast.text);
      }

      return videoId;
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'state', controller.config.deviceId);
    },

    send : function (config) {
      var http       = require('http'),
          chromecast = {},
          dataReply  = '',
          request;

      chromecast.deviceId    = config.device.deviceId;
      chromecast.deviceIp    = config.device.deviceIp;
      chromecast.path        = config.device.path       || '/setup/eureka_info?options=detail';
      chromecast.devicePort  = config.device.devicePort || 8008;
      chromecast.method      = config.device.method     || 'GET';
      chromecast.text        = config.text              || '';
      chromecast.callback    = config.callback          || function () {};
      chromecast.postRequest = null;

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

      if (config.text) {
        chromecast.path        = '/apps/YouTube';
        chromecast.method      = 'POST';
        chromecast.postRequest = this.postData(chromecast);
      }

      request = http.request(this.postPrepare(chromecast), function (response) {
        response.setEncoding('utf8');

        response.on('data', function (response) {
          dataReply += response;
        });

        response.once('end', function () {
          var chromecastData;

          if (dataReply) {
            chromecastData = JSON.parse(dataReply);

            chromecast.callback(null, chromecastData.uptime);
          }
        });
      });

      request.once('error', function (err) {
        chromecast.callback(err);
      });

      request.end(chromecast.postRequest);
    }
  };
}());
