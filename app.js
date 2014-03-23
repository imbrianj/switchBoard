/*jslint white: true, nomen: true, indent: 2, sub: true */
/*global require, console, setTimeout, process */

/**
 * @author brian@bevey.org
 * @fileoverview Interface for various hardware controllers.
 * @requires http, url, path, nopt
 */

var version        = 20140322,
    http           = require('http'),
    url            = require('url'),
    path           = require('path'),
    nopt           = require('nopt'),
    staticAssets   = require('./lib/staticAssets'),
    loadController = require('./lib/loadController'),
    requestInit    = require('./lib/requestInit'),
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

  // Some commands can be accepted via POST - such as text inputs.
  if(request.method === 'POST') {
    console.log('POST command received');

    requestInit.requestInit(request, controllers, response);
  }

  else {
    request.on('end', function () {
      var deviceController,
          device    = url.parse(request.url, true).query.device || controllers[controllers.config.default].config.deviceId,
          filename  = path.basename(request.url),
          extension = path.extname(filename),
          directory = staticAssets.getDirectory(extension, request.url),
          contents;

      controllers.config.default = device;

      // Serve static assets
      if(directory) {
        staticAssets.writeFile(directory, filename, response, controllers.config);
      }

      // Or the remote controller
      else {
        requestInit.requestInit(request, controllers, response);
      }
    });

    request.resume();
  }
}).listen(settings.config.config.serverPort);

console.log('Listening on port ' + settings.config.config.serverPort);