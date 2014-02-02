/*jslint white: true, nomen: true, indent: 2, sub: true */
/*global require, console, setTimeout, process */

/**
 * @author brian@bevey.org
 * @fileoverview Interface for various hardware controllers.
 * @requires http, url, path, fs
 */

var version     = 0.300,
    http        = require('http'),
    url         = require('url'),
    path        = require('path'),
    fs          = require('fs'),
    nopt        = require('nopt'),
    knownOpts   = { 'config' : path },
    shortHands  = { 'c' : ['--config'] },
    parsed      = nopt(knownOpts, shortHands, process.argv, 2),
    controllers = {}, settings;

if(parsed.config) {
  settings = require(parsed.config);
}

else {
  settings = require('./config/config');
}

// Only load controllers if they're configured.
(function() {
  'use strict';

  var deviceName;

  for(deviceName in settings.config) {
    if((typeof settings.config[deviceName] === 'object') && (settings.config[deviceName]['disabled'] !== true)) {
      settings.config[deviceName]['deviceID'] = deviceName;

      controllers[deviceName] = require('./controllers/' + settings.config[deviceName]['typeClass'] + 'Controller');

      console.log('Loaded ' + settings.config[deviceName]['typeClass'] + ' controller for ' + settings.config[deviceName]['title']);

      if(controllers[deviceName][settings.config[deviceName]['typeClass'] + 'Controller']['init'] !== undefined) {
        controllers[deviceName][settings.config[deviceName]['typeClass'] + 'Controller']['init']();
      }
    }
  }
}());

http.createServer(function(request, response) {
  'use strict';

  request.on('end', function () {
    var runCommand,
        assetPath,
        directory,
        deviceController,
        _get      = url.parse(request.url, true).query,
        device    = _get.device || settings.config[settings.config.default]['deviceID'],
        filename  = path.basename(request.url),
        extension = path.extname(filename),
        exists    = fs.exists || path.exists,
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
      assetPath = path.join(__dirname + '/' + directory + '/' + filename);

      exists(assetPath, function(exists) {
        if(exists) {
          fs.readFile(assetPath, 'utf-8', function(error, contents) {
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
            deviceSettings.cbConnect = function () {
              deviceSettings.status = 'connected';

              if(endResponse) {
                response.end('{"command":"' + command + '","device":"' + deviceSettings.title + '","cmdStatus":"ok"}');
              }
            };

            deviceSettings.cbError = function (errorMsg) {
              if(errorMsg === 'Device is off or unreachable') {
                deviceSettings.status = 'disconnected';
              }

              if(endResponse) {
                response.end('{"command":"' + command + '","device":"' + deviceSettings.title + '","cmdStatus":"' + errorMsg + '"}');
              }
            };

            console.log('Device: ' + deviceSettings.title + ', Good Command: ' + command);
            deviceSettings.command = command;

            value = deviceController.send(deviceSettings);
          }

          else if(command === 'sleep') {
            console.log('Sleep command sent');

            value = 'sleep';
          }

          else if(command) {
            console.log('Device: ' + deviceSettings.title + ', Bad Command: ' + command);

            value = 'invalid';
          }

          return value;
        };

        runMacro = function(i, macro) {
          var tempCommand = macro[i];

          if(tempCommand) {
            value = value + singleCommand(tempCommand);

            setTimeout(function() {
              runMacro(i + 1, macro);
            }, 1000);
          }
        };

        if(text) {
          deviceSettings.cbConnect = function () {
            settings.status = 'connected';
            if(endResponse) {
              response.end('{"text":"' + text + '","device":"' + deviceSettings.title + '", "cmdStatus":"ok"}');
            }
          };

          deviceSettings.cbError = function (errorMsg) {
            if(errorMsg === 'Device is off or unreachable') {
              deviceSettings.status = 'disconnected';
            }

            if(endResponse) {
              response.end('{"text":"' + text + '","device":"' + deviceSettings.title + '","cmdStatus":"' + errorMsg + '"}');
            }
          };

          console.log('Text inputted: ' + text);
          deviceSettings.text = text;

          value = deviceController.send(deviceSettings);
        }

        if(launch) {
          deviceSettings.cbConnect = function () {
            settings.status = 'connected';
            if(endResponse) {
              response.end('{"launch":"' + launch + '","device":"' + deviceSettings.title + '","cmdStatus":"ok"}');
            }
          };

          deviceSettings.cbError = function (errorMsg) {
            if(errorMsg === 'Device is off or unreachable') {
              deviceSettings.status = 'disconnected';
            }

            if(endResponse) {
              response.end('{"launch":"' + launch + '","device":"' + deviceSettings.title + '","cmdStatus":"' + errorMsg + '"}');
            }
          };

          console.log('Device: ' + deviceSettings.title + ', Launch: ' + launch);
          deviceSettings.launch = launch;

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

      if(typeof controllers[device] === 'object') {
        deviceController = controllers[device][settings.config[device]['typeClass'] + 'Controller'];
      }

      // If XHR, return JSON
      if(request.headers.ajax) {
        response.writeHead(200, { 'Content-Type': mimeTypes['.js'] });

// runCommand current does a response.end with a simple reply.
        runCommand({ command: _get.command, macro: _get.macro, text: _get.text, list: _get.list, launch: _get.launch, endResponse: true });

        // Check state of the world - which devices are configured and the
        // state of each (if supported).
        (function() {
          var deviceName,
              tempDevice,
              stateContent,
              staticDevices = [],
              stateDevices  = [],
              i = 0;

          stateContent = function (rawDevices, index, parsedDevices) {
            if(index >= 0) {
              parsedDevices[rawDevices[index]['config']['title']] = rawDevices[i];

              if(rawDevices[index]['controller']['findState'] !== undefined) {
                rawDevices[index]['controller']['findState'](rawDevices, index - 1, parsedDevices);
              }

              else {
                stateContent(rawDevices, index - 1, parsedDevices);
              }
            }

            else {
              if(index) {
                index -= 1;
                stateDevices[index]['controller']['findState'](rawDevices, index, parsedDevices);
              }

              else {
                response.end(parsedDevices);
              }
            }
          };

          for(deviceName in controllers) {
            tempDevice = controllers[deviceName][settings.config[deviceName]['typeClass'] + 'Controller'];

            if(typeof tempDevice === 'object') {
              staticDevices[i] = { 'controller': tempDevice, 'config': settings.config[deviceName] };
              i += 1;
            }
          }

          i -= 1;

          stateContent(staticDevices, i, {});
        }());
      }

      // Otherwise, show the markup
      else {
        fs.readFile(path.join(__dirname + '/templates/markup.html'), 'utf-8', function(error, markup) {
          response.writeHead(200, {'Content-Type': mimeTypes['.html']});

          runCommand({ command: _get.command, macro: _get.macro, text: _get.text, list: _get.list, launch: _get.launch, endResponse: false });

          // I'm not using mustache, but I can pretend.
          markup = markup.replace('{{DEVICE}}', device);

          markup = markup.replace('{{THEME}}', settings.config.theme || 'standard');

          // Load up content templates for each device type.
          (function() {
            var deviceName,
                tempDevice,
                staticContent,
                staticDevices = [],
                onloadDevices = [],
                i = 0,
                j = 0;

            staticContent = function (template, data, navTemplate, navData, staticDevices, index, dataResponse) {
              var config;

              // Continue loading static templates and appropriate nav
              // elements.
              if(index >= 0) {
                config  = staticDevices[index]['config'];
                navData = navData + navTemplate.split('{{DEVICE_ID}}').join(config.deviceID);
                navData = navData.split('{{DEVICE_TITLE}}').join(config.title);

                fs.readFile(path.join(__dirname + '/templates/' + config.typeClass + '.tpl'), 'utf-8', function(error, deviceData) {
                  deviceData = deviceData.split('{{DEVICE_ID}}').join(config.deviceID);

                  staticContent(template, data + deviceData, navTemplate, navData, staticDevices, index - 1, dataResponse);
                });
              }

              else {
                markup = markup.replace('{{NAVIGATION}}', navData);
                markup = markup.replace('{{DEVICE_INTERFACES}}', data);

                // Once we load each static template, we can see if a device
                // has anything we need to load onload
                if(j) {
                  j -= 1;
                  onloadDevices[j]['controller']['onload'](markup, onloadDevices, j, response);
                }

                else {
                  response.end(markup);
                }
              }
            };

            for(deviceName in controllers) {
              tempDevice = controllers[deviceName][settings.config[deviceName]['typeClass'] + 'Controller'];

              if(typeof tempDevice === 'object') {
                staticDevices[i] = { 'controller': tempDevice, 'config': settings.config[deviceName] };
                i += 1;

                if(tempDevice.onload !== undefined) {
                  onloadDevices[j] = { 'controller': tempDevice, 'config': settings.config[deviceName] };
                  j += 1;
                }
              }
            }

            i -= 1;

            fs.readFile(path.join(__dirname + '/templates/fragments/navigation.tpl'), 'utf-8', function(error, navTemplate) {
              staticContent(markup, '', navTemplate, '', staticDevices.reverse(), i, response);
            });
          }());
        });
      }
    }
  });

  request.resume();
}).listen(settings.config.serverPort, '0.0.0.0');
