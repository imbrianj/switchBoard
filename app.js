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
 * @requires http, url, path, nopt, websocket
 */

State       = {};
Connections = [];

var version         = 20140626,
    http            = require('http'),
    url             = require('url'),
    path            = require('path'),
    nopt            = require('nopt'),
    webSocketServer = require('websocket').server,
    staticAssets    = require('./lib/staticAssets'),
    loadController  = require('./lib/loadController'),
    requestInit     = require('./lib/requestInit'),
    knownOpts       = { 'config' : path },
    shortHands      = { 'c' : ['--config'] },
    parsed          = nopt(knownOpts, shortHands, process.argv, 2),
    controllers,
    server,
    wsServer,
    settings;

if(parsed.config) {
  settings = require(parsed.config);
}

else {
  settings = require('./config/config');
}

controllers = this.controllers = loadController.loadController(settings.config);

if(controllers) {
  server = http.createServer(function(request, response) {
    'use strict';

    // Some commands can be accepted via POST - such as text inputs.
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
  }).listen(settings.config.config.serverPort, function() {
    'use strict';

    console.log('\x1b[36mListening on port ' + settings.config.config.serverPort + '\x1b[0m');
  });

  // Or you're connecting with Web Sockets
  wsServer = new webSocketServer({ httpServer : server }, 'echo-protocol');

  wsServer.on('request', function(request) {
    'use strict';

    var loadMarkup = require('./lib/loadMarkup'),
        connection = request.accept('echo-protocol', request.origin);

    console.log('\x1b[36m' + connection.remoteAddress + ' WebSocket connected\x1b[0m');

    Connections.push(connection);

    connection.sendUTF(JSON.stringify(loadMarkup.loadTemplates(controllers)));

    connection.on('message', function(message) {
      var response = { end : function(message) {} };

      if(message.utf8Data === 'Reconnect') {
        console.log('\x1b[36m' + connection.remoteAddress + ' Requested State\x1b[0m');

        connection.sendUTF(JSON.stringify(State));
      }

      else {
        request.url = message.utf8Data;

        requestInit.requestInit(request, controllers, response);
      }
    });

    connection.on('close', function(code, desc) {
      var i = 0;

      console.log('\x1b[36m' + connection.remoteAddress + ' WebSocket disconnected\x1b[0m');

      connection.close();

      for(i; i < Connections.length; i += 1) {
        if(Connections[i] === connection) {
          Connections.splice(i, 1);

          break;
        }
      }
    });
  });
}
