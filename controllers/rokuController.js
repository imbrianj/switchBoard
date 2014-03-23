/*jslint white: true, indent: 2, sub: true */
/*global rokuController, module, String, setTimeout, require, console */

var rokuController = module.exports = (function () {
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
    postPrepare : function (that) {
      var path    = '/',
          method  = 'POST',
          runText = function(i, text, ip) {
            var letter = text[i];

            if(letter) {
              that.send({ letter: letter, deviceIp: ip });

              setTimeout(function() {
                runText(i + 1, text, ip);
              }, 200);
            }
          };

      if(this.command) {
        path += 'keypress/' + that.command;
      }

      if(that.letter) {
        path += 'keypress/Lit_' + that.letter;
      }

      if(this.text) {
        // Roku requires a string to be sent one char at a time.
        runText(0, that.text, that.deviceIp);
      }

      if(this.list) {
        method = 'GET';
        path  += 'query/apps';
      }

      if(this.launch) {
        path += 'launch/11?contentID=' + that.launch;
      }

      return {
        host   : that.deviceIp,
        port   : that.devicePort,
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
        rokuController.send({ deviceIp: config.deviceIp, list: true, callback: function(err, response) {
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

                      rokuController.cacheImage(app['_'], app['$']['id'], config);
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
      this.deviceIp   = config.deviceIp;
      this.command    = config.command    || '';
      this.text       = config.text       || '';
      this.letter     = config.letter     || '';
      this.list       = config.list       || '';
      this.launch     = config.launch     || '';
      this.devicePort = config.devicePort || 8060;
      this.callback   = config.callback   || function () {};

      var that        = this,
          http        = require('http'),
          dataReply   = '',
          request;

      request = http.request(this.postPrepare(that), function(response) {
                  response.on('data', function(response) {
                    console.log('Roku: Connected');

                    dataReply += response;
                  });

                  response.on('end', function() {
                    that.callback(null, dataReply);
                  });
                });


      request.on('error', function(error) {
        var errorMsg = '';

        if(error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
          errorMsg = 'Roku: Device is off or unreachable';
        }

        else {
          errorMsg = error.code;
        }

        console.log(errorMsg);

        that.callback(errorMsg);
      });

      request.end();

      return dataReply;
    }
  };
}());