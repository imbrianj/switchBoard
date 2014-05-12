/*jslint white: true */
/*global State, module, require, console */

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
      var runCommand   = require('./runCommand'),
          staticAssets = require('./staticAssets'),
          loadMarkup,
          path,
          fs,
          url,
          oauthCode,
          device;

      // If XHR, return JSON
      if(request.headers.ajax) {
        console.log('AJAX request');

        response.writeHead(200, {'Content-Type' : staticAssets.mimeTypes['.js']});

        runCommand.findCommands(request, controllers, response);
      }

      // Otherwise, show markup
      else {
        loadMarkup = require('./loadMarkup');
        path       = require('path');
        fs         = require('fs');
        url        = require('url');

        console.log('Client connected');

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