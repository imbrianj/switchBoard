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

/**
 * @author brian@bevey.org
 * @fileoverview Handles any request init handling.
 * @requires fs, path
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140430,

    requestInit : function(request, controllers, response) {
      var url          = require('url'),
          runCommand   = require('./runCommand'),
          staticAssets = require('./staticAssets'),
          deviceState,
          loadMarkup,
          path,
          fs,
          oauthCode,
          device;

      // If XHR, return JSON
      if(request.headers.ajax) {
        console.log(request.connection.remoteAddress + ' AJAX request');

        response.writeHead(200, {'Content-Type' : staticAssets.mimeTypes['.js']});

        if(url.parse(request.url).pathname.indexOf('/state/') === 0) {
          deviceState = require('./deviceState');

          response.end(JSON.stringify(State));
        }

        else {
          runCommand.findCommands(request, controllers, response);
        }
      }

      // Otherwise, show markup
      else {
        loadMarkup = require('./loadMarkup');
        path       = require('path');
        fs         = require('fs');

        console.log(request.connection.remoteAddress + ' Client connected');

        // If an OAuth endpoint, grab the supplied code and store it.  Then
        // grab the access token.
        if(url.parse(request.url).pathname.indexOf('/oauth/') === 0) {
          console.log('OAuth request');

          device    = url.parse(request.url).pathname.replace('/oauth/', '');
          oauthCode = url.parse(request.url).query.split('code=').join('');

          if(typeof controllers[device] === 'object') {
            controllers[device].controller.oauthCode(oauthCode, device, controllers[device].config, controllers.config);
          }
        }

        else {
          runCommand.findCommands(request, controllers, response);
        }

        fs.readFile(path.join(__dirname + '/../templates/markup.html'), 'utf-8', function(err, template) {
          response.writeHead(200, {'Content-Type' : staticAssets.mimeTypes['.html']});

          if(template) {
            response.end(loadMarkup.loadMarkup(template, controllers, response));
          }
        });
      }
    }
  };
}());
