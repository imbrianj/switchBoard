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
 * @requires fs, http, https, url, path, websocket
 */

var fs              = require('fs'),
    http            = require('http'),
    https           = require('https'),
    url             = require('url'),
    path            = require('path'),
    webSocketServer = require('websocket').server,
    staticAssets    = require(__dirname + '/lib/staticAssets'),
    loadController  = require(__dirname + '/lib/loadController'),
    requestInit     = require(__dirname + '/lib/requestInit'),
    ai              = require(__dirname + '/lib/ai'),
    db              = require(__dirname + '/lib/db'),
    webSockets      = require(__dirname + '/lib/webSockets'),
    controllers,
    sslServer,
    server,
    wsServer,
    sslWsServer,
    settings,
    configFile      = __dirname + '/config/config.js',
    arg,
    options,
    connection,
    startup,
    sslStartup;

for (arg in process.argv) {
  if (process.argv.hasOwnProperty(arg)) {
    switch (process.argv[arg]) {
      case '-c' :
      case '--config' :
        configFile = process.argv[parseInt(arg, 10) + 1];
      break;
    }
  }
}

connection = function (request, response) {
  'use strict';

  // Accept commands via POST as well.
  if (request.method === 'POST') {
    console.log('\x1b[36mPOST command received\x1b[0m');

    requestInit.requestInit(request, controllers, response);
  }

  else {
    request.on('end', function () {
      var device    = url.parse(request.url, true).query.device || controllers[controllers.config.default].config.deviceId,
          filename  = path.basename(request.url),
          extension = path.extname(filename),
          directory = staticAssets.getDirectory(extension, request.url);

      controllers.config.default = device;

      // Serve static assets
      if (directory) {
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

startup = function () {
  'use strict';

  console.log('\x1b[36mListening on port ' + settings.config.config.serverPort + '\x1b[0m');

  if (settings.config.config.appCaching === true) {
    staticAssets.freshenManifest();
  }
};

sslStartup = function () {
  'use strict';

  console.log('\x1b[36mListening on port ' + settings.config.config.ssl.serverPort + ' for SSL\x1b[0m');
};

fs.stat(configFile, function (err, data) {
  'use strict';

  var key,
      cert;

  if (err) {
    console.log('\x1b[31mError\x1b[0m: Config file could not be read.  Ensure you edit the config/config.js or provide the correct path.');
    process.exit(1);
  }

  if (data.isFile()) {
    settings = require(configFile);

    controllers = loadController.loadController(settings.config);

    if (settings.config.config.ssl && settings.config.config.ssl.disabled !== true) {
      try {
        key = fs.statSync(__dirname + '/cache/key.pem');
      }

      catch (catchErr) {
        console.log('\x1b[31mError\x1b[0m: Invalid SSL key provided.');
      }

      try {
        cert = fs.statSync(__dirname + '/cache/server.crt');
      }

      catch (catchErr) {
        console.log('\x1b[31mError\x1b[0m: Invalid SSL cert provided.');
      }

      if ((key) && (cert)) {
        options = {
          key  : fs.readFileSync(__dirname + '/cache/key.pem'),
          cert : fs.readFileSync(__dirname + '/cache/server.crt')
        };
      }

      else if (process.platform === 'linux') {
        staticAssets.buildCerts(settings.config.config.ssl);
      }

      if (options) {
        console.log('\x1b[36mSSL\x1b[0m: Enabled');
        sslServer = https.createServer(options, connection).listen(settings.config.config.ssl.serverPort, sslStartup);

        // SSL will need it's own Web Sockets server.
        if (sslServer) {
          sslWsServer = new webSocketServer({ httpServer : sslServer }, 'echo-protocol');

          sslWsServer.on('request', function (request) {
            webSockets.newConnection(request, controllers);
          });
        }
      }
    }

    if (settings.config.config.serverPort) {
      server = http.createServer(connection).listen(settings.config.config.serverPort, startup);

      // Or you're connecting with Web Sockets
      wsServer = new webSocketServer({ httpServer : server }, 'echo-protocol');

      wsServer.on('request', function (request) {
        webSockets.newConnection(request, controllers);
      });
    }

    if ((!sslServer) && (!server)) {
      console.log('\x1b[31mError\x1b[0m: No server started.  Do you have a serverPort configured?');
    }

    ai.processFiles();
    db.readDb();
  }

  else {
    console.log('\x1b[31mError\x1b[0m: Config file looks invalid.');
  }
});
