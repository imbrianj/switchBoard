/*jslint white: true */
/*global State, module, require, console */

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
   * @requires querystring, https
   * @fileoverview Basic viewing of Travis CI job states.
   */
  return {
    version : 20140726,

    inputs  : ['list'],

    /**
     * Prepare a GET request.
     */
    postPrepare : function(config) {
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

    init : function (controller) {
      this.send({ device : { deviceId: controller.config.deviceId, travisOwner: controller.config.travisOwner, travisRepo: controller.config.travisRepo } });
    },

    onload : function (controller) {
      var fs       = require('fs'),
          parser   = require(__dirname + '/../parsers/travis').travis,
          fragment = fs.readFileSync(__dirname + '/../templates/fragments/travis.tpl').toString();

      return parser(controller.deviceId, controller.markup, State[controller.config.deviceId].state, State[controller.config.deviceId].value, { build : fragment });
    },

    send : function(config) {
      var https     = require('https'),
          travis    = {},
          dataReply = '',
          request;

      travis.deviceId = config.device.deviceId;
      travis.host     = config.host     || 'api.travis-ci.org';
      travis.path     = config.path     || '/repos/' + config.device.travisOwner + '/' + config.device.travisRepo + '/cc.json';
      travis.port     = config.port     || 443;
      travis.method   = config.method   || 'GET';
      travis.callback = config.callback || function () {};

      request = https.request(this.postPrepare(travis), function(response) {
        response.setEncoding('utf8');

        console.log('\x1b[32mTravis\x1b[0m: Connected');

        response.on('data', function(response) {
          dataReply += response;
        });

        response.once('end', function() {
          var deviceState = require('../lib/deviceState'),
              travisData  = {};

          if((dataReply) && (dataReply[0] === '{')) {
            dataReply = JSON.parse(dataReply);

            travisData = { 'description' : dataReply.description,
                           'url'         : 'http://travis-ci.org/' + dataReply.slug,
                           'status'      : dataReply.last_build_result === 0 ? 'ok' : 'err',
                           'duration'    : dataReply.last_build_duration };

            deviceState.updateState(travis.deviceId, 'travis', { state : travisData.status, value : travisData });
          }

          if(travisData.status === 'ok') {
            travis.callback(null, travisData);
          }

          else {
            travis.callback(travisData);
          }
        });
      });

      request.once('error', function(err) {
        var errorMsg = '';

        if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
          errorMsg = '\x1b[31mTravis\x1b[0m: API is unreachable';
        }

        else {
          errorMsg = '\x1b[31mTravis\x1b[0m: ' + err.code;
        }

        console.log(errorMsg);

        travis.callback(errorMsg);
      });

      request.end();
    }
  };
}());
