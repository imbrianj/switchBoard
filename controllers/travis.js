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
    version : 20140813,

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
      var runCommand = require(__dirname + '/../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    onload : function (controller) {
      var fs          = require('fs'),
          deviceState = require(__dirname + '/../lib/deviceState'),
          travisState = deviceState.getDeviceState(controller.config.deviceId),
          parser      = require(__dirname + '/../parsers/travis').travis,
          fragment    = fs.readFileSync(__dirname + '/../templates/fragments/travis.tpl').toString();

      return parser(controller.deviceId, controller.markup, travisState.state, travisState.value, { build : fragment });
    },

    send : function(config) {
      var https     = require('https'),
          travis    = {},
          dataReply = '',
          request;

      travis.deviceId = config.device.deviceId;
      travis.host     = config.host     || 'api.travis-ci.org';
      travis.path     = config.path     || '/repositories/' + config.device.travisOwner + '/' + config.device.travisRepo + '/builds.json';
      travis.port     = config.port     || 443;
      travis.method   = config.method   || 'GET';
      travis.callback = config.callback || function () {};

      request = https.request(this.postPrepare(travis), function(response) {
        response.setEncoding('utf8');

        response.on('data', function(response) {
          dataReply += response;
        });

        response.once('end', function() {
          var deviceState = require(__dirname + '/../lib/deviceState'),
              travisData  = [],
              i           = 0;

          // Stupid check to see if it's JSON and not HTML.
          if((dataReply) && (dataReply[0] === '[')) {
            dataReply = JSON.parse(dataReply);

            for(i; i < dataReply.length; i += 1) {
              travisData[i] = { 'label'       : dataReply[i].message,
                                'url'         : 'http://travis-ci.org/' + config.device.travisOwner + '/' + config.device.travisRepo + '/builds/' + dataReply[i].id,
                                'status'      : dataReply[i].result === 0 ? 'ok' : 'err',
                                'duration'    : dataReply[i].duration,
                                'state'       : dataReply[i].state
                              };

              if(i === (dataReply.length - 1)) {
                travisData.status = travisData[0].status;

                deviceState.updateState(travis.deviceId, 'travis', { state : travisData.status, value : travisData });
              }
            }
          }

          if(travisData.status === 'ok') {
            travis.callback(null, travisData);
          }

          else {
            travis.callback('err', travisData);
          }
        });
      });

      request.once('error', function(err) {
        travis.callback(err);
      });

      request.end();
    }
  };
}());
