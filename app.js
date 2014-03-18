/*jslint white: true, nomen: true, indent: 2, sub: true */
/*global require, console, setTimeout, process */

/**
 * @author brian@bevey.org
 * @fileoverview Interface for various hardware controllers.
 * @requires http, url, path, nopt, fs
 */

var version        = 20140316,
    http           = require('http'),
    url            = require('url'),
    path           = require('path'),
    nopt           = require('nopt'),
    fs             = require('fs'),
    staticAssets   = require('./js/staticAssets'),
    loadController = require('./js/loadController'),
    loadMarkup     = require('./js/loadMarkup'),
    runCommand     = require('./js/runCommand'),
    knownOpts      = { 'config' : path },
    shortHands     = { 'c' : ['--config'] },
    parsed         = nopt(knownOpts, shortHands, process.argv, 2),
    controllers,
    settings;

if(parsed.config) {
  settings = require(parsed.config);
}

else {
  settings = require('./config/config');
}

controllers = this.controllers = loadController.loadController(settings.config);

http.createServer(function(request, response) {
  'use strict';

  request.on('end', function () {
    var deviceController,
        device    = url.parse(request.url, true).query.device || controllers[controllers.config.default].config.deviceId,
        filename  = path.basename(request.url),
        extension = path.extname(filename),
        directory = staticAssets.getDirectory(extension, request.url),
        contents;

    controllers.config.default = device;

    /* Serve static assets */
    if(directory) {
      staticAssets.writeFile(directory, filename, response, controllers.config);
    }

    /* Or the remote controller */
    else {
      // If XHR, return JSON
      if(request.headers.ajax) {
        console.log('AJAX request');

        response.writeHead(200, {'Content-Type' : staticAssets.mimeTypes['.js']});

        runCommand.findCommands(request, controllers, response);
      }

      // Otherwise, show the markup
      else {
        console.log('Client connected');

        runCommand.findCommands(request, controllers, response);

        fs.readFile(path.join(__dirname + '/templates/markup.html'), 'utf-8', function(err, template) {
          response.writeHead(200, {'Content-Type' : staticAssets.mimeTypes['.html']});

          if(template) {
            response.end(loadMarkup.loadMarkup(template, controllers, response));
          }
        });
      }
    }
  });

  request.resume();
}).listen(settings.config.config.serverPort);

console.log('Listening on port ' + settings.config.config.serverPort);