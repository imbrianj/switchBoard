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
      runCommand = function (command, commands, text, endResponse) {
        var value       = 'bad',
            command     = command     || '',
            commands    = commands    || '',
            text        = text        || '',
            endResponse = endResponse || false,
            runCommand,
            runCommands;

        settings.config.text    = '';
        settings.config.command = '';

        runCommand = function(command) {
          if(remote.SamsungController.keymap.indexOf(command) >= 0) {
            settings.config.cbConnect = function () {
              settings.status = 'connected';
              if(endResponse) {
                response.end('{"command":"' + command + '","cmdStatus":"ok"}');
              }
            };

            settings.config.cbError = function (errorMsg) {
              if(errorMsg === 'TV is off or unreachable') {
                settings.status = 'disconnected';
              }

              if(endResponse) {
                response.end('{"command":"' + command + '","cmdStatus":"' + errorMsg + '"}');
              }
            };

            console.log('Good Command: ' + command);
            settings.config.command = command;

            value = remote.SamsungController.send(settings.config);
          }

          else if(command) {
            console.log('Bad Command: ' + command);

            value = 'invalid';
          }

          return value;
        };

        runCommands = function(i, commands) {
          var command = commands[i];

          if(command) {
            value = value + runCommand(command);

            setTimeout(function() {
              runCommands(i + 1, commands);
            }, 1000);
          }
        };

        if(text) {
          settings.config.cbConnect = function () {
            settings.status = 'connected';
            if(endResponse) {
              response.end('{"text":"' + text + '","cmdStatus":"ok"}');
            }
          };

          settings.config.cbError = function (errorMsg) {
            if(errorMsg === 'TV is off or unreachable') {
              settings.status = 'disconnected';
            }

            if(endResponse) {
              response.end('{"text":"' + text + '","cmdStatus":"' + errorMsg + '"}');
            }
          };

          console.log('Text inputted: ' + text);
          settings.config.text = text;

          value = remote.SamsungController.send(settings.config);
        }

        if(commands) {
          commands = commands.split(',');

          runCommands(0, commands);

          value = '{"commands":' + value + '}';
        }

        if(command) {
          value = runCommand(command);
        }

        return value;
      }

      // If XHR, return JSON
      if(request.headers.ajax) {
        response.writeHead(200, {'Content-Type': mimeTypes['.js']});

        runCommand(_get['command'], _get['commands'], _get['text'], true);
      }

      // Otherwise, show the markup
      else {
        fs.readFile('./markup.html', 'utf-8', function(error, data) {
          response.writeHead(200, {'Content-Type': mimeTypes['.html']});

          runCommand(_get['command'], _get['commands'], _get['text'], false);

          response.end(data);
        });
      }
    }
  });

  request.resume();
}).listen(settings.config.serverport);