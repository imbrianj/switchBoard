/*jslint white: true */
/*global exports, String, Buffer, require, console, setTimeout */

exports.rokuController = exports.rokuController || (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control over Roku devices via TCP POST requests using
   *               Node.js.
   * @requires xml2js, http, fs
   */
  return {
    version : '0.0.0.0.1 alpha',
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
        host    : that.deviceIp,
        port    : that.devicePort,
        path    : path,
        method  : method
      };
    },

    findState : function () {
    },

    dynamicContent : function (data, devices, index, dataResponse) {
      var xml2js = require('xml2js'),
          fs     = require('fs'),
          parser = new xml2js.Parser(),
          config = devices[index],
          apps   = {};

      exports.rokuController.send({ deviceIp: config.config.deviceIp, list: true, cbConnect: function(response) {
        parser.parseString(response, function(error, reply) {
          var markup = '',
              app,
              i;

          if(reply) {
            fs.readFile('templates/fragments/roku.tpl', 'utf-8', function(error, template) {
              for(i in reply.apps.app) {
                app = reply.apps.app[i];

                apps[app['$']['id']] = { 'name' : app['_'],
                                         'id'   : app['$']['id'],
                                         'link' : 'http://' + config.config.deviceIp + ':8060/launch/11?contentID=' + app['$']['id'],
                                         'image': 'http://' + config.config.deviceIp + ':8060/query/icon/' + app['$']['id']
                                       };

                markup = markup + template.replace('{{APP_ID}}', apps[app['$']['id']]['id']);
                markup = markup.replace('{{APP_IMG}}', apps[app['$']['id']]['image']);
                markup = markup.replace('{{APP_NAME}}', apps[app['$']['id']]['name']);
              }

              data = data.replace('{{ROKU_DYNAMIC}}', markup);

              if(index > 0) {
                devices[index - 1]['controller']['dynamicContent'](data, devices, index - 1, dataResponse);
              }

              else {
                dataResponse.end(data);
              }
            });
          }
        });
      }});
    },

    send : function (config) {
      this.deviceIp   = config.deviceIp;
      this.command    = config.command    || '';
      this.text       = config.text       || '';
      this.letter     = config.letter     || '';
      this.list       = config.list       || '';
      this.launch     = config.launch     || '';
      this.devicePort = config.devicePort || 8060;
      this.cbConnect  = config.cbConnect  || function () {};
      this.cbError    = config.cbError    || function () {};

      var that        = this,
          http        = require('http'),
          dataReply   = '',
          request;

      request = http.request(this.postPrepare(that), function(response) {
                  response.on('data', function(response) {
                    console.log('connected');

                    dataReply += response;
                  });

                  response.on('end', function() {
                    that.cbConnect(dataReply);
                  });
                });


      request.on('error', function(error) {
        var errorMsg = '';

        if(error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
          errorMsg = 'Device is off or unreachable';
        }

        else {
          errorMsg = error.code;
        }

        console.log(errorMsg);

        that.cbError(errorMsg);
      });

      request.end();

      return dataReply;
    }
  };
} ());