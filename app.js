/*jslint white: true, nomen: true, indent: 2, sub: true */
/*global require, console, setTimeout, process */

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
 * @fileoverview Interface for various hardware controllers.
 * @requires fs, http, https, url, path, nopt, websocket
 */

State = {};

var version         = 20150331,
    fs              = require('fs'),
    http            = require('http'),
    https           = require('https'),
    url             = require('url'),
    path            = require('path'),
    nopt            = require('nopt'),
    webSocketServer = require('websocket').server,
    staticAssets    = require(__dirname + '/lib/staticAssets'),
    loadController  = require(__dirname + '/lib/loadController'),
    requestInit     = require(__dirname + '/lib/requestInit'),
    webSockets      = require(__dirname + '/lib/webSockets'),
    knownOpts       = { 'config' : path },
    shortHands      = { 'c' : ['--config'] },
    parsed          = nopt(knownOpts, shortHands, process.argv, 2),
    controllers,
    server,
    wsServer,
    settings,
    options,
    connection,
    startup;

if(parsed.config) {
  settings = require(parsed.config);
}

else {
  settings = require(__dirname + '/config/config');
}

controllers = loadController.loadController(settings.config);

if(settings.config.config.ssl.disabled !== true) {
  if((fs.existsSync('cache/key.pem')) && (fs.existsSync('cache/server.crt'))) {
    options = {
      key  : fs.readFileSync('cache/key.pem'),
      cert : fs.readFileSync('cache/server.crt')
    };
  }

  else if(process.platform === 'linux') {
    staticAssets.buildCerts(settings.config.config.ssl);
  }
}

if(controllers) {
  connection = function(request, response) {
    'use strict';

    // Accept commands via POST as well.
    if(request.method === 'POST') {
      console.log('\x1b[36mPOST command received\x1b[0m');

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
  };

  startup = function() {
    'use strict';

    console.log('\x1b[36mListening on port ' + settings.config.config.serverPort + '\x1b[0m');

    if(settings.config.config.appCaching === true) {
      staticAssets.freshenManifest();
    }
  };

  if(options) {
    console.log('\x1b[36mSSL\x1b[0m: Enabled');
    server = https.createServer(options, connection).listen(settings.config.config.serverPort, startup);
  }

  else {
    console.log('\x1b[31mSSL\x1b[0m: Disabled');
    server = http.createServer(connection).listen(settings.config.config.serverPort, startup);
  }

  // Or you're connecting with Web Sockets
  wsServer = new webSocketServer({ httpServer : server }, 'echo-protocol');

  wsServer.on('request', function(request) {
    'use strict';

    webSockets.newConnection(request, controllers);
  });
}
