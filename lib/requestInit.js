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

/**
 * @author brian@bevey.org
 * @fileoverview Handles any request init handling.
 * @requires url, fs, path
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20141203,

    /**
     * Accepts every command request, regardless of source (GET, POST, REST,
     * WebSockets).  It then normalizes these requests, sends them to to be run
     * and handles any return headers or content.
     */
    requestInit : function (request, controllers, response) {
      var url          = require('url'),
          runCommand   = require(__dirname + '/runCommand'),
          staticAssets = require(__dirname + '/staticAssets'),
          deviceState  = require(__dirname + '/deviceState'),
          allStates,
          loadMarkup,
          path,
          fs,
          oauthCode,
          device;

      // If Websocket, just fire commands.
      if(request.webSocketVersion) {
        runCommand.findCommands(request, response);
      }

      // If XHR, return JSON
      else if(request.headers.rest) {
        console.log('\x1b[36m' + request.connection.remoteAddress + ' REST request\x1b[0m');

        response.writeHead(200, { 'Content-Type' : staticAssets.mimeTypes['.js'], 'Cache-Control' : 'no-cache' });

        if(url.parse(request.url).pathname.indexOf('/state/') === 0) {
          allStates = deviceState.getDeviceState();

          response.end(JSON.stringify(allStates));
        }

        else if(url.parse(request.url).pathname.indexOf('/templates/') === 0) {
          loadMarkup = require(__dirname + '/loadMarkup');

          response.end(JSON.stringify(loadMarkup.loadTemplates(controllers)));
        }

        else {
          runCommand.findCommands(request, response, true);
        }
      }

      // Otherwise, show markup
      else {
        loadMarkup = require(__dirname + '/loadMarkup');
        path       = require('path');
        fs         = require('fs');

        console.log('\x1b[36m' + request.connection.remoteAddress + ' Client connected\x1b[0m');

        // If an OAuth endpoint, grab the supplied code and store it.  Then
        // grab the access token.
        if(url.parse(request.url).pathname.indexOf('/oauth/') === 0) {
          console.log('\x1b[36mOAuth request\x1b[0m');

          device    = url.parse(request.url).pathname.replace('/oauth/', '');
          oauthCode = url.parse(request.url, true).query.code;

          if(typeof controllers[device] === 'object') {
            controllers[device].controller.oauthCode(oauthCode, device, controllers[device].config, controllers.config);
          }
        }

        else {
          runCommand.findCommands(request, response, false);
        }

        fs.readFile(path.join(__dirname + '/../templates/markup.html'), 'utf-8', function (err, template) {
          response.writeHead(200, { 'Content-Type' : staticAssets.mimeTypes['.html'], 'Cache-Control' : 'no-cache' });

          if(template) {
            response.end(loadMarkup.loadMarkup(template, controllers, response));
          }
        });
      }
    }
  };
}());
