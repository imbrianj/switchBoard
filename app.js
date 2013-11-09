/*jslint white: true */
/*global require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Interface for various hardware controllers.
 * @requires http, url, path, fs
 */

var http        = require('http'),
    url         = require('url'),
    path        = require('path'),
    fs          = require('fs'),
    settings    = require('./js/config'),
    controllers = {'device':'controller'};

// Only load controllers if they're configured.
(function() {
  var deviceName;

  for(deviceName in settings.config) {
    if(typeof(settings.config[deviceName]) === 'object') {
      controllers[deviceName] = require('./controllers/' + deviceName + 'Controller');
    }
  }
}());

// PS3 requires a lock file to determine if the daemon is running.
// If the server is just started up, we should assume it is not.
(function() {
  var exists = path.exists || fs.exists;

  exists('ps3.lock', function(exists) {
    if(exists) {
      fs.unlink('ps3.lock', function(error) {
        if(error) {
          console.log(error);
        }
      });
    }
  });
}());

http.createServer(function(request, response) {
  request.on('end', function () {
    var runCommand,
        directory,
        deviceController,
        output    = '',
        dynamic   = '',
        _get      = url.parse(request.url, true).query,
        device    = _get['device'] || settings.config.default,
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
                     '.woff' : 'application/x-font-woff'};

    switch(extension) {
      case '.css' :
        directory = 'css';
        break;
      case '.js' :
        directory = 'js';
        break;
      case '.ico' :
      case '.eot' :
      case '.svg' :
      case '.ttf' :
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
      runCommand = function(config) {
        var value          = 'bad',
            deviceSettings = settings.config[device] || {},
            command        = config.command          || '',
            macro          = config.macro            || '',
            text           = config.text             || '',
            list           = config.list             || '',
            launch         = config.launch           || '',
            endResponse    = config.endResponse      || false,
            singleCommand,
            runMacro;

        deviceSettings.serverIp  = settings.config.serverIp;
        deviceSettings.serverMac = settings.config.serverMac;
        deviceSettings.command   = '';
        deviceSettings.macro     = '';
        deviceSettings.text      = '';
        deviceSettings.list      = '';
        deviceSettings.launch    = '';

        singleCommand = function(command) {
          if(deviceController.keymap.indexOf(command) >= 0) {
            deviceSettings['cbConnect'] = function () {
              deviceSettings['status'] = 'connected';

              if(endResponse) {
                response.end('{"command":"' + command + '","cmdStatus":"ok"}');
              }
            };

            deviceSettings['cbError'] = function (errorMsg) {
              if(errorMsg === 'Device is off or unreachable') {
                deviceSettings['status'] = 'disconnected';
              }

              if(endResponse) {
                response.end('{"command":"' + command + '","cmdStatus":"' + errorMsg + '"}');
              }
            };

            console.log('Good Command: ' + command);
            deviceSettings['command'] = command;

            value = deviceController.send(deviceSettings);
          }

          else if(command) {
            console.log('Bad Command: ' + command);

            value = 'invalid';
          }

          return value;
        };

        runMacro = function(i, macro) {
          var command = macro[i];

          if(command) {
            value = value + singleCommand(command);

            setTimeout(function() {
              runMacro(i + 1, macro);
            }, 1000);
          }
        };

        if(text) {
          deviceSettings['cbConnect'] = function () {
            settings.status = 'connected';
            if(endResponse) {
              response.end('{"text":"' + text + '","cmdStatus":"ok"}');
            }
          };

          deviceSettings['cbError'] = function (errorMsg) {
            if(errorMsg === 'Device is off or unreachable') {
              deviceSettings.status = 'disconnected';
            }

            if(endResponse) {
              response.end('{"text":"' + text + '","cmdStatus":"' + errorMsg + '"}');
            }
          };

          console.log('Text inputted: ' + text);
          deviceSettings['text'] = text;

          value = deviceController.send(deviceSettings);
        }

        if(launch) {
          deviceSettings['cbConnect'] = function () {
            settings.status = 'connected';
            if(endResponse) {
              response.end('{"launch":"' + launch + '","cmdStatus":"ok"}');
            }
          };

          deviceSettings['cbError'] = function (errorMsg) {
            if(errorMsg === 'Device is off or unreachable') {
              deviceSettings.status = 'disconnected';
            }

            if(endResponse) {
              response.end('{"launch":"' + launch + '","cmdStatus":"' + errorMsg + '"}');
            }
          };

          console.log('Lauch: ' + launch);
          deviceSettings['launch'] = launch;

          value = deviceController.send(deviceSettings);
        }

        if(macro) {
          macro = macro.split(',');

          runMacro(0, macro);

          value = '{"macro":' + value + '}';
        }

        if(command) {
          value = singleCommand(command);
        }

        return value;
      };

      if(typeof(controllers[device]) === 'object') {
        deviceController = controllers[device][device + 'Controller'];
      }

      // If XHR, return JSON
      if(request.headers.ajax) {
        response.writeHead(200, { 'Content-Type': mimeTypes['.js'] });

        runCommand({ command: _get['command'], macro: _get['macro'], text: _get['text'], list: _get['list'], launch: _get['launch'], endResponse: true });
      }

      // Otherwise, show the markup
      else {
        fs.readFile('./markup.html', 'utf-8', function(error, data) {
          response.writeHead(200, {'Content-Type': mimeTypes['.html']});

          runCommand({ command: _get['command'], macro: _get['macro'], text: _get['text'], list: _get['list'], launch: _get['launch'], endResponse: false });

          // I'm not using mustache, but I can pretend.
          data = data.replace('{{DEVICE}}', device);

          // If you a device that is expecting dynamic content, let's find that.
          (function() {
            var deviceName,
                tempDevice,
                devices = [],
                i       = 0;

            for(deviceName in controllers) {
              tempDevice = controllers[deviceName][deviceName + 'Controller'];

              if(typeof(tempDevice) === 'object') {
                if(typeof(tempDevice.dynamicContent) !== 'undefined') {
                  devices[i] = { 'controller': tempDevice, 'config': settings.config[deviceName] };
                  i++;
                }
              }
            }

            if(i) {
              i--;

              devices[i]['controller']['dynamicContent'](data, devices, i, response);
            }

            else {
              response.end(data);
            }
          }());
        });
      }
    }
  });

  request.resume();
}).listen(settings.config.serverPort);