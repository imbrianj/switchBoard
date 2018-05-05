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
   * @fileoverview Basic viewing of Travis CI job states.
   */
  return {
    version : 20160204,

    readOnly: true,

    inputs  : ['list'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { build : fs.readFileSync(__dirname + '/fragments/travis.tpl', 'utf-8') };
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
        }
      };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    send : function (config) {
      var https     = require('https'),
          util      = require(__dirname + '/../../lib/sharedUtil').util,
          travis    = {},
          dataReply = '',
          request;

      travis.deviceId = config.device.deviceId;
      travis.owner    = config.device.travisOwner;
      travis.repo     = config.device.travisRepo;
      travis.host     = config.host            || 'api.travis-ci.org';
      travis.path     = config.path            || '/repositories/' + travis.owner + '/' + travis.repo + '/builds.json';
      travis.port     = config.port            || 443;
      travis.method   = config.method          || 'GET';
      travis.maxCount = config.device.maxCount || 3;
      travis.callback = config.callback        || function () {};

      if ((travis.owner) && (travis.repo)) {
        console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

        request = https.request(this.postPrepare(travis), function (response) {
          response.setEncoding('utf8');

          response.on('data', function (response) {
            dataReply += response;
          });

          response.once('end', function () {
            var data       = null,
                travisData = [],
                i          = 0;

            if (dataReply) {
              try {
                data = JSON.parse(dataReply);
              }

              catch (catchErr) {
                travis.callback('Invalid data returned from API');
              }
            }

            if (data) {
              for (i; i < data.length; i += 1) {
                if (i < travis.maxCount) {
                  travisData[i] = { 'label'    : util.sanitize(data[i].message),
                                    'url'      : util.sanitize('http://travis-ci.org/' + travis.owner + '/' + travis.repo + '/builds/' + data[i].id),
                                    'status'   : data[i].result === 0 ? 'ok' : 'err',
                                    'duration' : util.sanitize(data[i].duration),
                                    'state'    : util.sanitize(data[i].state) };

                  if ((i === (data.length - 1)) || (i === (travis.maxCount - 1))) {
                    travisData.status = travisData[0].status;
                  }
                }

                else {
                  break;
                }
              }

              travis.callback(null, travisData);
            }

            else {
              travis.callback('err', travisData);
            }
          });
        });

        request.once('error', function (err) {
          travis.callback(err);
        });

        request.end();
      }
    }
  };
}());
