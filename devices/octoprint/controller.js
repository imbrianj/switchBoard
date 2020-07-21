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
   * @fileoverview Grabs 3d print status and temperature details from Octoprint.
   * @requires http
   */
  return {
    version : 20200314,

    readOnly: true,

    inputs  : ['state'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { video : fs.readFileSync(__dirname + '/fragments/video.tpl', 'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      return { host    : config.deviceIp,
               port    : config.devicePort,
               path    : config.path,
               method  : 'GET',
               headers : {
                 'Accept'         : 'application/json',
                 'Accept-Charset' : 'utf-8',
                 'User-Agent'     : 'node-switchBoard',
                 'X-Api-Key'      : config.key
              }
            };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'state', controller.config.deviceId);
    },

    /**
     * Accept the raw API JSON of the current printer status and returns a
     * format that's more useful to us.
     */
    getPrintStatus : function (reply, config, celsius) {
      var util   = require(__dirname + '/../../lib/sharedUtil').util,
          status = { extruderTemp : 0, extruderTarget : 0, bedTemp : 0, bedTarget : 0 },
          parsed;

      try {
        parsed = JSON.parse(reply);
      }

      catch (catchErr) {
        console.log('\x1b[31m' + config.device.title + '\x1b[0m: Failed to parse printer info');
        return status;
      }

      if (parsed.temperature.tool0 && parsed.temperature.bed) {
        status.extruderTemp   = parseInt(util.sanitize(parsed.temperature.tool0.actual), 10);
        status.extruderTarget = parseInt(util.sanitize(parsed.temperature.tool0.target), 10);
        status.bedTemp        = parseInt(util.sanitize(parsed.temperature.bed.actual), 10);
        status.bedTarget      = parseInt(util.sanitize(parsed.temperature.bed.target), 10);

        if (!celsius) {
          status.extruderTemp   = status.extruderTemp   ? util.cToF(status.extruderTemp)   : 0;
          status.extruderTarget = status.extruderTarget ? util.cToF(status.extruderTarget) : 0;
          status.bedTemp        = status.bedTemp        ? util.cToF(status.bedTemp)        : 0;
          status.bedTarget      = status.bedTarget      ? util.cToF(status.bedTarget)      : 0;
        }
      }

      return status;
    },

    /**
    * Accept the raw API JSON of the current printer job status and returns a
    * format that's more useful to us.
    */
    getJobStatus : function (reply, config) {
      var util   = require(__dirname + '/../../lib/sharedUtil').util,
          status = { percent : 0, printTime: 0, timeRemaining: 0 },
          parsed;

      try {
        parsed = JSON.parse(reply);
      }

      catch (catchErr) {
        console.log('\x1b[31m' + config.device.title + '\x1b[0m: Failed to parse job info');
        return status;
      }

      status.percent       = parseInt(util.sanitize(parsed.progress.completion), 10);
      status.printTime     = parseInt(util.sanitize(parsed.progress.printTime), 10);
      status.timeRemaining = parseInt(util.sanitize(parsed.progress.printTimeLeft), 10);

      return status;
    },

    /**
    * Accept the formatted printStatus and formatted jobStatus and combines them
    * into one object.
    */
    getPrinterSummary : function (printStatus, jobStatus) {
      var printerSummary = JSON.parse(JSON.stringify(printStatus));

      for (var property in jobStatus) {
        if (property) {
          printerSummary[property] = jobStatus[property];
        }
      }

      return printerSummary;
    },

    send : function (config) {
      var http             = require('http'),
          celsius          = !!config.config.celsius,
          that             = this,
          octoprint        = {},
          dataPrinterReply = '',
          dataJobReply     = '',
          printerRequest,
          jobRequest;

      octoprint.deviceId   = config.device.deviceId;
      octoprint.deviceIp   = config.device.deviceIp;
      octoprint.styles     = config.device.styles;
      octoprint.key        = config.device.key;
      octoprint.path       = config.device.path       || '/api/printer';
      octoprint.devicePort = config.device.devicePort || 80;
      octoprint.method     = config.device.method     || 'GET';
      octoprint.callback   = config.callback          || function () {};

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching printer info');

      printerRequest = http.request(this.postPrepare(octoprint), function (response) {
        response.setEncoding('utf8');

        response.on('data', function (response) {
          dataPrinterReply += response;
        });

        response.once('end', function () {
          var printerData;

          if (dataPrinterReply) {
            printerData = that.getPrintStatus(dataPrinterReply, config, celsius);

            octoprint.path = '/api/job';

            console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching print job info');

            jobRequest = http.request(that.postPrepare(octoprint), function (response) {
              response.setEncoding('utf8');

              response.on('data', function (response) {
                dataJobReply += response;
              });

              response.once('end', function () {
                var jobData,
                    unix          = new Date().getTime(),
                    printerStatus = {};

                if (dataJobReply) {
                  jobData       = that.getJobStatus(dataJobReply, config);
                  printerStatus = that.getPrinterSummary(printerData, jobData);

                  printerStatus.imagePath = 'https://' + octoprint.deviceIp + '/webcam/?action=stream&' + unix;

                  if (octoprint.styles) {
                    printerStatus.styles = 'transform: ' + octoprint.styles;
                  }

                  octoprint.callback(null, printerStatus);
                }
              });
            });

            jobRequest.once('error', function (err) {
              var printerData = that.getJobStatus('', config);

              octoprint.callback(err, printerData);
            });

            jobRequest.end();
          }
        });
      });

      printerRequest.once('error', function (err) {
        var printerData = that.getPrintStatus('', config, celsius);

        octoprint.callback(err, printerData);
      });

      printerRequest.end();
    }
  };
}());
