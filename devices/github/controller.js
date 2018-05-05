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
   * @fileoverview Grabs GitHub commit history for display.
   * @requires https
   */
  return {
    version : 20160204,

    readOnly: true,

    inputs  : ['list'],

    /**
     * Reference template fragment to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { commit  : fs.readFileSync(__dirname + '/fragments/commit.tpl', 'utf-8'),
               message : fs.readFileSync(__dirname + '/fragments/message.tpl', 'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (github) {
      var method  = github.method || 'GET';

      return {
        host    : github.host,
        port    : github.port,
        path    : github.path,
        method  : method,
        headers : {
          'Accept'         : 'application/vnd.github.v3+json',
          'Accept-Charset' : 'utf-8',
          'User-Agent'     : 'node-switchBoard'
        }
      };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller, config) {
      var runCommand = require(__dirname + '/../../lib/runCommand'),
          fs         = require('fs');

      if ((controller.config.checkVersion === true) &&
         (controller.config.owner === 'imbrianj') &&
         (controller.config.repo === 'switchboard')) {
        try {
          controller.config.version = fs.readFileSync(__dirname + '/../../cache/version.txt', 'utf-8');
        }

        catch (catchErr) {
          console.log('\x1b[35m' + config.device.title + '\x1b[0m: No version file found.');
        }
      }

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);

      return controller;
    },

    /**
     * Accept the JSON formatted API response and parse through, determining if
     * the data is versioned - and returning an array of sanitized values.
     */
    getCommits : function (data, maxCount, version) {
      var util       = require(__dirname + '/../../lib/sharedUtil').util,
          commit     = {},
          githubData = [],
          i          = 0;

      maxCount = maxCount || 3;

      for (i; i < data.length; i += 1) {
        if (i < maxCount) {
          commit = {
            url         : util.sanitize(data[i].html_url),
            time        : util.sanitize(new Date(data[i].commit.committer.date).getTime()),
            description : util.sanitize(data[i].commit.message)
          };

          if (version) {
            if (new Date(data[i].commit.committer.date).getTime() > version) {
              commit.upToDate = false;
            }

            else {
              commit.upToDate = true;
            }
          }

          githubData.push(commit);
        }

        else {
          break;
        }
      }

      return githubData;
    },

    send : function (config) {
      var https     = require('https'),
          that      = this,
          github    = {},
          dataReply = '',
          request;

      github.deviceId  = config.device.deviceId;
      github.host      = config.device.host     || 'api.github.com';
      github.path      = '/repos/' + config.device.owner + '/' + config.device.repo + '/commits';
      github.port      = config.device.port     || 443;
      github.maxCount  = config.device.maxCount || 3;
      github.version   = null;
      github.callback  = config.callback        || function () {};
      github.version   = config.device.version;

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

      request = https.request(this.postPrepare(github), function (response) {
        response.setEncoding('utf8');

        response.on('data', function (response) {
          dataReply += response;
        });

        response.once('end', function () {
          var data       = null,
              githubData = [];

          if (dataReply) {
            try {
              data = JSON.parse(dataReply);
            }

            catch (catchErr) {
              github.callback('API returned an unexpected value');
            }

            githubData = that.getCommits(data, github.maxCount, github.version);

            github.callback(null, githubData);
          }
        });
      });

      request.once('error', function (err) {
        github.callback(err);
      });

      request.end();
    }
  };
}());
