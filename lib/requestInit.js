/*jslint white: true */
/*global module, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Handles any request init handling.
 * @requires fs, path
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140322,

    requestInit : function(request, controllers, response) {
      var runCommand   = require('./runCommand'),
          staticAssets = require('./staticAssets'),
          loadMarkup,
          path,
          fs;

      // If XHR, return JSON
      if(request.headers.ajax) {
        console.log('AJAX request');

        response.writeHead(200, {'Content-Type' : staticAssets.mimeTypes['.js']});

        runCommand.findCommands(request, controllers, response);
      }

      // Otherwise, show the markup
      else {
        loadMarkup = require('./loadMarkup');
        path       = require('path');
        fs         = require('fs');

        console.log('Client connected');

        runCommand.findCommands(request, controllers, response);

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