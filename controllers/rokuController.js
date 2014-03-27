/*jslint white: true, indent: 2, sub: true */
/*global module, String, setTimeout, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control over Roku devices via TCP POST requests using
   *               Node.js.
   * @requires xml2js, http, fs, request
   */
  return {
    version : 20140316,

    inputs  : ['command', 'text', 'list', 'launch'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['Home', 'Rev', 'Fwd', 'Play', 'Select', 'Left', 'Right', 'Down', 'Up', 'Back', 'InstantReplay', 'Info', 'Backspace', 'Search', 'Enter'],

    /**
     * Prepare a POST request for a Roku command.
     */
    postPrepare : function (command) {
      var path    = '/',
          method  = 'POST',
          runText = function(i, text, ip) {
            var letter = text[i];

            if(letter) {
              roku.send({ letter: letter, deviceIp: ip });

              setTimeout(function() {
                runText(i + 1, text, ip);
              }, 200);
            }
          };

      if(command.command) {
        path += 'keypress/' + command.command;
      }

      if(command.letter) {
        path += 'keypress/Lit_' + command.letter;
      }

      if(command.text) {
        // Roku requires a string to be sent one char at a time.
        runText(0, roku.text, roku.deviceIp);
      }

      if(command.list) {
        method = 'GET';
        path  += 'query/apps';
      }

      if(command.launch) {
        path += 'launch/11?contentID=' + command.launch;
      }

      return {
        host   : command.deviceIp,
        port   : command.devicePort,
        path   : path,
        method : method
      };
    },

    cacheImage : function (appName, appId, config) {
      var fs       = require('fs'),
          filePath = __dirname + '/../images/roku/icon_' + appId + '.png';

      fs.exists(filePath, function(exists) {
        var request;

        if(!exists) {
          request = require('request');

          console.log('Roku: Saved image for ' + appName);
          request('http://' + config.deviceIp + ':8060/query/icon/' + appId).pipe(fs.createWriteStream(filePath));
        }

        else {
          console.log('Roku: Skipping ' + appName + ' image - already saved locally');
        }
      });
    },

    onload : function (controller) {
      var markup     = controller.markup,
          fs         = require('fs'),
          template   = fs.readFileSync(__dirname + '/../templates/fragments/roku.tpl').toString(),
          i          = 0,
          tempMarkup = '',
          apps;

      if(fs.existsSync(__dirname + '/../tmp/roku.json')) {
        apps = JSON.parse(fs.readFileSync(__dirname + '/../tmp/roku.json').toString());

        if(apps) {
          for(i in apps) {
            tempMarkup = tempMarkup + template.split('{{APP_ID}}').join(apps[i]['id']);
            tempMarkup = tempMarkup.split('{{APP_IMG}}').join(apps[i]['cache']);
            tempMarkup = tempMarkup.split('{{APP_NAME}}').join(apps[i]['name']);
          }
        }
      }

      return markup.replace('{{ROKU_DYNAMIC}}', tempMarkup);
    },

    init : function (controller) {
      var xml2js = require('xml2js'),
          fs     = require('fs'),
          path   = require('path'),
          parser = new xml2js.Parser(),
          config = controller.config,
          apps   = {};

      if(fs.existsSync(__dirname + '/../tmp/roku.json')) {
        console.log('Roku: App settings cached');
      }

      else {
        this.send({ deviceIp: config.deviceIp, list: true, callback: function(err, response) {
          if(err) {
            if(err === 'EHOSTUNREACH') {
              console.log('Roku: Device is off or unreachable');
            }

            else {
              console.log('Roku: ' + err);
            }
          }

          else {
            parser.parseString(response, function(err, reply) {
              var app;

              if(reply) {
                fs.readFile(path.join(__dirname + '/../templates/fragments/roku.tpl'), function(err, template) {
                  var cache,
                      i = 0;

                  if(err) {
                    console.log('Roku: Unable to read template fragment');
                  }

                  else {
                    for(i in reply.apps.app) {
                      app = reply.apps.app[i];

                      apps[app['$']['id']] = { 'name'  : app['_'],
                                               'id'    : app['$']['id'],
                                               'link'  : 'http://' + config.deviceIp + ':8060/launch/11?contentID=' + app['$']['id'],
                                               'image' : 'http://' + config.deviceIp + ':8060/query/icon/' + app['$']['id'],
                                               'cache' : '/images/roku/icon_' + app['$']['id'] + '.png'
                                             };

                      this.cacheImage(app['_'], app['$']['id'], config);
                    }

                    cache = fs.createWriteStream(__dirname + '/../tmp/roku.json');
                    cache.write(JSON.stringify(apps));
                    console.log('Roku: Wrote app settings to cache');
                  }
                });
              }
            });
          }
        }});
      }
    },

    send : function (config) {
      var http        = require('http'),
          roku        = {},
          dataReply   = '',
          request;

      roku.deviceIp   = config.deviceIp;
      roku.command    = config.command    || '';
      roku.text       = config.text       || '';
      roku.letter     = config.letter     || '';
      roku.list       = config.list       || '';
      roku.launch     = config.launch     || '';
      roku.devicePort = config.devicePort || 8060;
      roku.callback   = config.callback   || function () {};

      request = http.request(this.postPrepare(roku), function(response) {
                  response.on('data', function(response) {
                    console.log('Roku: Connected');

                    dataReply += response;
                  });

                  response.on('end', function() {
                    roku.callback(null, dataReply);
                  });
                });


      request.on('error', function(error) {
        var errorMsg = '';

        if(error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || error.code === 'EHOSTUNREACH') {
          errorMsg = 'Device is off or unreachable';
        }

        else {
          errorMsg = error.code;
        }

        console.log('Roku: ' + errorMsg);

        roku.callback(errorMsg);
      });

      request.end();

      return dataReply;
    }
  };
}());