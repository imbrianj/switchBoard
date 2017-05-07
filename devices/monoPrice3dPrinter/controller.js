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
   * @fileoverview Grabs 3d printer status details for MonoPrice and similar 3d
   *               printers.
   * @requires http
   */
  return {
    version : 20170507,

    inputs  : ['state'],


    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      return { host   : config.deviceIp,
               port   : config.devicePort,
               path   : config.path,
               method : 'GET' };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'state', controller.config.deviceId);
    },

    /**
     * Accept the CSV formatted API response and parse through and returning an
     * object of sanitized values.
     */
    getPrintStatus : function (reply) {
      var util   = require(__dirname + '/../../lib/sharedUtil').util,
          status = { extruderTemp : 0, extruderTarget : 0, bedTemp : 0, bedTarget : 0, percent : 0 },
          parts  = [];

      parts = reply.split('/');

      if (parts.length === 4) {
        status.extruderTemp   = util.sanitize(parts[0].split('T').join(''));
        status.extruderTarget = util.sanitize(parts[1].split('P')[0]);
        status.bedTemp        = util.sanitize(parts[1].split('P')[1]);
        status.bedTarget      = util.sanitize(parts[2]);
        status.percent        = util.sanitize(parts[3].split('P').join('').split('I').join(''));
      }

      return status;
    },

    send : function (config) {
      var http               = require('http'),
          that               = this,
          monoPrice3dPrinter = {},
          dataReply          = '',
          request;

      monoPrice3dPrinter.deviceId   = config.device.deviceId;
      monoPrice3dPrinter.deviceIp   = config.device.deviceIp;
      monoPrice3dPrinter.path       = config.device.path       || '/inquiry';
      monoPrice3dPrinter.devicePort = config.device.devicePort || 80;
      monoPrice3dPrinter.method     = config.device.method     || 'GET';
      monoPrice3dPrinter.callback   = config.callback          || function () {};

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

      request = http.request(this.postPrepare(monoPrice3dPrinter), function (response) {
        response.setEncoding('utf8');

        response.on('data', function (response) {
          dataReply += response;
        });

        response.once('end', function () {
          var printerData;

          if (dataReply) {
            printerData = that.getPrintStatus(dataReply);

            monoPrice3dPrinter.callback(null, printerData);
          }
        });
      });

      request.once('error', function (err) {
        var printerData = that.getPrintStatus('');

        monoPrice3dPrinter.callback(err, printerData);
      });

      request.end();
    }
  };
}());
