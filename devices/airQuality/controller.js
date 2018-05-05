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
   * @requires fs, https
   * @fileoverview Basic air quality information, courtesy of OpenAQ.
   */
  return {
    version : 20180118,

    readOnly: true,

    inputs  : ['list'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { report : fs.readFileSync(__dirname + '/fragments/report.tpl', 'utf-8'),
               graph  : fs.readFileSync(__dirname + '/fragments/graph.tpl',  'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      return { host   : config.host,
               port   : config.port,
               path   : config.path.split(' ').join('%20'),
               method : config.method };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    maxQuality : { co : 100, no2 : 0.2, pm25 : 150 },

    /**
     * Accept a raw air quality report object.  Parse through, sanitizing values
     * as necessary.
     */
    formatReport : function (report) {
      var util      = require(__dirname + '/../../lib/sharedUtil').util,
          formatted = [],
          i         = 0,
          type;

      for (i; i < report.length; i += 1) {
        type = util.sanitize(report[i].parameter);
        formatted.push({
          type    : type,
          value   : Number(util.sanitize(report[i].value).toFixed(3)),
          units   : util.sanitize(report[i].unit),
          updated : new Date(util.sanitize(report[i].lastUpdated)).getTime(),
          max     : this.maxQuality[type],
          high    : Number((util.sanitize(this.maxQuality[type]) / 2).toFixed(3))
        });
      }

      return formatted;
    },

    send : function (config) {
      var that       = this,
          https      = require('https'),
          airQuality = {},
          dataReply  = '',
          request;

      airQuality.deviceId = config.device.deviceId;
      airQuality.location = config.device.location;
      airQuality.host     = config.host           || 'api.openaq.org';
      airQuality.path     = config.path           || '/v1/latest?location=' + airQuality.location;
      airQuality.port     = config.port           || 443;
      airQuality.method   = config.method         || 'GET';
      airQuality.callback = config.callback       || function () {};

      if (airQuality.location) {
        console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

        request = https.request(this.postPrepare(airQuality), function (response) {
                    response.setEncoding('utf8');

                    response.on('data', function (response) {
                      dataReply += response;
                    });

                    response.once('end', function () {
                      var util           = require(__dirname + '/../../lib/sharedUtil').util,
                          airQualityData = {},
                          errMessage     = 'err',
                          data;

                      if (dataReply) {
                        try {
                          data = JSON.parse(dataReply);
                        }

                        catch (catchErr) {
                          errMessage = 'API returned an unexpected value';
                        }

                        if (data && data.results && data.results[0].measurements) {
                          errMessage  = null;

                          airQualityData = {
                                          'location' : util.sanitize(data.results[0].location),
                                          'report'   : that.formatReport(data.results[0].measurements)
                                        };
                        }

                        else {
                          errMessage = 'No data returned from API';
                        }
                      }

                      else {
                        errMessage = 'No data returned from API';
                      }

                      airQuality.callback(errMessage, airQualityData);
                    });
                  });

        request.once('error', function (err) {
          airQuality.callback(err);
        });

        request.end();
      }

      else {
        airQuality.callback('No location specified');
      }
    }
  };
}());
