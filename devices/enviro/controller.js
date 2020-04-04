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
   * @requires fs, http
   * @fileoverview Basic air quality information, courtesy of OpenAQ.
   */
  return {
    version : 20200403,

    readOnly: true,

    inputs  : ['state'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { report  : fs.readFileSync(__dirname + '/fragments/report.tpl',  'utf-8'),
               graph   : fs.readFileSync(__dirname + '/fragments/graph.tpl',   'utf-8'),
               low     : fs.readFileSync(__dirname + '/fragments/low.tpl',     'utf-8'),
               optimum : fs.readFileSync(__dirname + '/fragments/optimum.tpl', 'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      return { host   : config.deviceIp,
               port   : config.port,
               path   : config.path,
               method : config.method,
               headers : {
                 'Accept'         : 'application/json',
                 'Accept-Charset' : 'utf-8',
                 'User-Agent'     : 'node-switchBoard'
               } };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'state', controller.config.deviceId);
    },

    qualityLevels : { TEMPERATURE : {
                        low     : 16,
                        optimum : 22,
                        high    : 29,
                        max     : 35
                      },
                      PRESSURE    : {
                        low     : 870,
                        optimum : 1013,
                        high    : 1040,
                        max     : 1084
                      },
                      HUMIDITY    : {
                        low     : 20,
                        optimum : 50,
                        high    : 60,
                        max     : 70
                      },
                      LIGHT       : {
                        low     : 0,
                        optimum : 20000,
                        high    : 30000,
                        max     : 100000
                      },
                      OXIDISED    : {
                        high    : 50,
                        optimum : 0,
                        max     : 200
                      },
                      REDUCED     : {
                        high    : 450,
                        optimum : 0,
                        max     : 550
                      },
                      NH3         : {
                        high    : 300,
                        optimum : 0,
                        max     : 1500
                      },
                      PM1         : {
                        high    : 50,
                        optimum : 0,
                        max     : 150
                      },
                      PM25        : {
                        optimum : 0,
                        high    : 50,
                        max     : 150
                      },
                      PM10        : {
                        optimum : 0,
                        high    : 50,
                        max     : 150
                      } },

    /**
     * Accept a raw air quality report object.  Parse through, sanitizing values
     * as necessary.
     */
    formatReport : function (data, config, title) {
      var util      = require(__dirname + '/../../lib/sharedUtil').util,
          formatted = [],
          i         = 0,
          type;

      if (data && data.readings && data.readings.length) {
        for (i; i < data.readings.length; i += 1) {
          type = util.sanitize(data.readings[i].name);

          if (this.qualityLevels[type]) {
            if (!config.celsius && type === 'TEMPERATURE') {
              formatted.push({
                type    : util.translate(type, 'enviro', config.language),
                value   : util.cToF(Number(util.sanitize(data.readings[i].value)).toFixed(3)),
                units   : 'F',
                low     : util.cToF(this.qualityLevels[type].low),
                high    : util.cToF(this.qualityLevels[type].high),
                optimum : this.qualityLevels[type].optimum && util.cToF(this.qualityLevels[type].optimum),
                max     : util.cToF(this.qualityLevels[type].max),
                updated : util.sanitize(data.unix) * 1000
              });
            }

            else {
              formatted.push({
                type    : util.translate(type, 'enviro', config.language),
                value   : Number(util.sanitize(data.readings[i].value)).toFixed(3),
                units   : util.sanitize(data.readings[i].units),
                low     : this.qualityLevels[type].low,
                optimum : this.qualityLevels[type].optimum,
                high    : this.qualityLevels[type].high,
                max     : this.qualityLevels[type].max,
                updated : util.sanitize(data.unix) * 1000
              });
            }
          }

          else {
            console.log('\x1b[31m' + title + '\x1b[0m: Unrecognized type: ' + type);
          }
        }
      }

      return formatted;
    },

    send : function (config) {
      var that      = this,
          http      = require('http'),
          enviro    = {},
          dataReply = '',
          request;

      enviro.deviceId = config.device.deviceId;
      enviro.deviceIp = config.device.deviceIp;
      enviro.celsius  = config.config.config || false;
      enviro.language = config.language      || 'en';
      enviro.path     = config.path          || '/';
      enviro.port     = config.device.port   || 8008;
      enviro.method   = config.method        || 'GET';
      enviro.callback = config.callback      || function () {};

      if (enviro.deviceIp) {
        console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

        request = http.request(this.postPrepare(enviro), function (response) {
                    response.setEncoding('utf8');

                    response.on('data', function (response) {
                      dataReply += response;
                    });

                    response.once('end', function () {
                      var enviroData = {},
                          errMessage = 'err',
                          data;

                      if (dataReply) {
                        try {
                          data = JSON.parse(dataReply);
                        }

                        catch (catchErr) {
                          errMessage = 'API returned an unexpected value';
                        }

                        if (data && data.readings) {
                          errMessage  = null;

                          enviroData = { 'report' : that.formatReport(data, enviro, config.device.title) };
                        }

                        else {
                          errMessage = 'No data returned from API';
                        }
                      }

                      else {
                        errMessage = 'No data returned from API';
                      }

                      enviro.callback(errMessage, enviroData);
                    });
                  });

        request.once('error', function (err) {
          enviro.callback(err);
        });

        request.end();
      }

      else {
        enviro.callback('No location specified');
      }
    }
  };
}());
