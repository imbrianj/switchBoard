var http     = require('http'),
    url      = require('url'),
    path     = require('path'),
    fs       = require('fs'),
    remote   = require('./samsungController'),
    settings = require('./js/config');

http.createServer(function(request, response) {
  request.on('end', function () {
    var runCommand,
        directory,
        output    = '',
        _get      = url.parse(request.url, true).query,
        filename  = path.basename(request.url),
        extension = path.extname(filename),
        exists    = path.exists || fs.exists,
        mimeTypes = {'.html' : 'text/html',
                     '.css'  : 'text/css',
                     '.js'   : 'application/javascript',
                     '.ico'  : 'image/x-icon',
                     '.eot'  : 'application/vnd.ms-fontobject',
                     '.svg'  : 'image/svg+xml',
                     '.ttf'  : 'application/x-font-ttf',
                     '.otf'  : 'application/x-font-otf',
                     '.woff' : 'application/x-font-woff'};

    switch(extension) {
      case '.css' :
        directory = 'css';
        break;
      case '.js' :
        directory = 'js';
        break;
      case '.ico' :
      case '.otf' :
      case '.eot' :
      case '.svg' :
      case '.ttf' :
      case '.otf' :
      case '.woff' :
        directory = 'font';
        break;
    }

    /* Serve static assets */
    if(directory) {
      exists(directory + '/' + filename, function(exists) {
        if(exists) {
          fs.readFile(directory + '/' + filename, function(error, contents) {
            if(!error) {
              response.writeHead(200, {'Content-Type': mimeTypes[extension], 'Content-Length': contents.length});
              response.end(contents);
            }
          });
        }
      });
    }

    /* Or the remote controller */
    else {
      runCommand = function (command, text) {
        var value   = 'bad',
            command = command || '',
            text    = text    || '';

        if(_get['text']) {
          settings.config.cbConnect = function () {
            response.end('{"text":"' + text + '","cmdStatus":"ok"}');
          };

          settings.config.cbError = function (errorMsg) {
            response.end('{"text":"' + text + '","cmdStatus":"' + errorMsg + '"}');
          };

          console.log('Text inputted: ' + text);
          settings.config.text = text;

          value = remote.SamsungController.send(settings.config);
        }

        if(remote.SamsungController.keymap.indexOf(command) >= 0) {
          settings.config.cbConnect = function () {
            response.end('{"command":"' + command + '","cmdStatus":"ok"}');
          };

          settings.config.cbError = function (errorMsg) {
            response.end('{"command":"' + command + '","cmdStatus":"' + errorMsg + '"}');
          };

          console.log('Good Command: ' + command);
          settings.config.command = command;

          value = remote.SamsungController.send(settings.config);
        }

        else if(command) {
          console.log('Bad Command: ' + _get['command']);

          value = 'invalid';
        }

        return value;
      }

      // If XHR, return JSON
      if(request.headers.ajax) {
        response.writeHead(200, {'Content-Type': mimeTypes['.js']});

        runCommand(_get['command'], _get['text']);
      }

      else {
        fs.readFile('./markup.html', 'utf-8', function(error, data) {
          response.writeHead(200, {'Content-Type': mimeTypes['.html']});

          runCommand();

          response.end(data);
        });
      }
    }
  });

  request.resume();
}).listen(settings.config.serverport);