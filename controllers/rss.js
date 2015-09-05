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
   * @fileoverview Grabs RSS feeds for display.
   * @requires http, xml2js
   */
  return {
    version : 20150905,

    inputs  : ['list'],

    /**
     * Reference template fragment to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { item : fs.readFileSync(__dirname + '/../templates/fragments/rss.tpl').toString() };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (rss) {
      var path    = '/upnp/control/basicevent1',
          method  = 'GET';

      return {
        host   : rss.host,
        port   : rss.port,
        path   : rss.path,
        method : method
      };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller, config) {
      var runCommand = require(__dirname + '/../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    send : function (config) {
      var http      = require('http'),
          that      = this,
          rss       = {},
          dataReply = '',
          request;

      rss.deviceId = config.device.deviceId;
      rss.host     = config.device.host;
      rss.path     = config.device.path;
      rss.port     = config.device.port     || 80;
      rss.method   = config.method          || 'GET';
      rss.maxCount = config.device.maxCount || 3;
      rss.callback = config.callback        || function () {};

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

      request = http.request(this.postPrepare(rss), function(response) {
        response.setEncoding('utf8');

        response.on('data', function(response) {
          dataReply += response;
        });

        response.once('end', function() {
          var xml2js      = require('xml2js'),
              deviceState = require(__dirname + '/../lib/deviceState'),
              sharedUtil  = require(__dirname + '/../lib/sharedUtil').util,
              parser      = new xml2js.Parser(),
              data        = null,
              rssData     = [];

          if(dataReply) {
            parser.parseString(dataReply, function(err, reply) {
              var article,
                  i = 0,
                  j = 0;

              if(reply) {
                if(err) {
                  console.log('\x1b[31m' + config.device.title + '\x1b[0m: Unable to parse reply');
                }

                else {
                  for(i in reply.rss.channel[0].item) {
                    article = reply.rss.channel[0].item[i];

                    rssData[j] = { 'title'       : sharedUtil.stripTags(article.title[0]),
                                   'url'         : sharedUtil.stripTags(article.link[0]),
                                   'description' : sharedUtil.stripTags(article.description[0]),
                                   'text'        : sharedUtil.stripTags(article['content:encoded'][0])
                                 };

                    j += 1;

                    if(j >= rss.maxCount) {
                      break;
                    }
                  }

                  rss.callback(null, rssData);
                }
              }
            });
          }
        });
      });

      request.once('error', function(err) {
        rss.callback(err);
      });

      request.end();
    }
  };
}());
