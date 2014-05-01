/*jslint white: true */
/*global module, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @requires fs, https
   * @fileoverview Basic control of SmartThings endpoint.
   */
  return {
    version : 20140430,

    inputs  : ['list', 'launch'],

    /**
     * Prepare a POST request for a command.
     */
    oauthPostPrepare : function(config) {
      return {
        host    : config.host,
        port    : config.port,
        path    : config.path,
        method  : config.method,
        headers : {
          'Accept'         : 'application/json',
          'Accept-Charset' : 'utf-8',
          'User-Agent'     : 'node-universal-controller'
        }
      };
    },

    /**
     * Use received OAuth2 code to query for access token to be used later.
     */
    oauthCode : function (oauthCode, deviceName, deviceConfig, config) {
      var https       = require('https'),
          smartthings = {},
          that        = this,
          postRequest = '',
          request;

      smartthings.host     = deviceConfig.host     || 'graph.api.smartthings.com';
      smartthings.port     = deviceConfig.port     || 443;
      smartthings.path     = deviceConfig.path     || '/oauth/token?grant_type=authorization_code&client_id=' + deviceConfig.clientId + '&client_secret=' + deviceConfig.clientSecret + '&redirect_uri=http://' + config.serverIp + ':' + config.serverPort + '/oauth/' + deviceName + '&code=' + oauthCode + '&scope=app';
      smartthings.method   = deviceConfig.method   || 'GET';
      smartthings.callback = deviceConfig.callback || function() {};

      request = https.request(this.oauthPostPrepare(smartthings), function(response) {
        response.setEncoding('utf8');

        response.on('data', function(response) {
          var fs       = require('fs'),
              authData = {},
              cache;

          console.log('SmartThings: Connected');

          response = JSON.parse(response);

          if(response.error) {
            console.log('SmartThings: ' + response.error_description);

            smartthings.callback(response.error);
          }

          else {
            authData.accessToken = response.access_token;
            authData.expire      = response.expires_in;

            that.oauthUrl(authData, { 'controller' : that, 'config' : deviceConfig });

            smartthings.callback(null, response);
          }
        });
      });

      request.on('error', function(err) {
        var errorMsg = '';

        if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
          errorMsg = 'SmartThings: API is unreachable';
        }

        else {
          errorMsg = 'SmartThings: ' + err.code;
        }

        console.log(errorMsg);

        smartthings.callback(errorMsg);
      });

      request.end();
    },

    oauthUrl : function (auth, controller) {
      var https       = require('https'),
          smartthings = {},
          devices     = {},
          that        = this,
          request;

      smartthings.host     = controller.config.host     || 'graph.api.smartthings.com';
      smartthings.port     = controller.config.port     || 443;
      smartthings.path     = controller.config.path     || '/api/smartapps/endpoints/' + controller.config.clientId + '?access_token=' + auth.accessToken;
      smartthings.method   = controller.config.method   || 'GET';
      smartthings.callback = controller.config.callback || function() {};

      console.log('SmartThings: Fetching device url');

      request = https.request(controller.controller.oauthPostPrepare(smartthings), function(response) {
        response.setEncoding('utf8');

        response.on('data', function(response) {
          var fs       = require('fs'),
              authData = {},
              cache;

          console.log('SmartThings: Connected');

          response = JSON.parse(response);

          if(response.error) {
            console.log('SmartThings: ' + response.message);

            smartthings.callback(response.error);
          }

          else {
            auth.url = response[0].url;

            cache = fs.createWriteStream(__dirname + '/../tmp/smartthingsAuth.json');
            cache.on('open', function() {
              console.log('SmartThings: Auth data cached with URL');

              that.oauthDeviceList(auth, controller);

              cache.write(JSON.stringify(auth));
            });

            smartthings.callback(null, response);
          }
        });
      });

      request.on('error', function(err) {
        var errorMsg = '';

        if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
          errorMsg = 'SmartThings: API is unreachable';
        }

        else {
          errorMsg = 'SmartThings: ' + err.code;
        }

        console.log(errorMsg);

        smartthings.callback(errorMsg);
      });

      request.end();
    },

    oauthDeviceList : function (auth, controller) {
      var https       = require('https'),
          smartthings = {},
          devices     = {},
          request     = {},
          that        = this;

      smartthings.host     = controller.config.host     || 'graph.api.smartthings.com';
      smartthings.port     = controller.config.port     || 443;
      smartthings.path     = controller.config.path     || auth.url + '/switches';
      smartthings.method   = controller.config.method   || 'GET';
      smartthings.callback = controller.config.callback || function() {};

      request = controller.controller.oauthPostPrepare(smartthings);

      request.headers.Authorization = 'Bearer ' + auth.accessToken;

      console.log('SmartThings: Fetching device info');

      request = https.request(request, function(response) {
        response.setEncoding('utf8');

        response.on('data', function(response) {
          var fs       = require('fs'),
              authData = {},
              devices  = {},
              i        = 0,
              cache;

          console.log('SmartThings: Connected');

          response = JSON.parse(response);

          if(response.error) {
            console.log('SmartThings: ' + response.message);

            smartthings.callback(response.error);
          }

          else {
            for(i; i < response.length; i += 1) {
              devices[i] = {
                label : response[i].label,
                type  : response[i].type
              };

              if(response[i].type === 'switch') {
                  devices[i].on     = 'https://graph.api.smartthings.com' + auth.url + '/switches/' + response[i].id + '/on?access_token=' + auth.accessToken;
                  devices[i].off    = 'https://graph.api.smartthings.com' + auth.url + '/switches/' + response[i].id + '/off?access_token=' + auth.accessToken;
                  devices[i].toggle = 'https://graph.api.smartthings.com' + auth.url + '/switches/' + response[i].id + '/toggle?access_token=' + auth.accessToken;
              }
            }

            cache = fs.createWriteStream(__dirname + '/../tmp/smartthingsDevices.json');
            cache.on('open', function() {
              console.log('SmartThings: Device data cached');

              cache.write(JSON.stringify(devices));
            });

            smartthings.callback(null, response);
          }
        });
      });

      request.on('error', function(err) {
        var errorMsg = '';

        if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
          errorMsg = 'SmartThings: API is unreachable';
        }

        else {
          errorMsg = 'SmartThings: ' + err.code;
        }

        console.log(errorMsg);

        smartthings.callback(errorMsg);
      });

      request.end();
    },

    init : function (controller, config) {
      var fs = require('fs');

      if(typeof controller.config.clientId !== 'undefined' && controller.config.clientSecret !== 'undefined') {
        fs.exists(__dirname + '/../tmp/smartthingsAuth.json', function(fileExists) {
          // If we have a presumed good auth token, we can populate the device list.
          if(fileExists) {
            fs.readFile(__dirname + '/../tmp/smartthingsAuth.json', function(err, auth) {
              auth = JSON.parse(auth.toString());

              controller.controller.oauthUrl(auth, controller);
            });
          }

          // Otherwise, we need to prompt the user to retrieve the auth token.
          else {
            console.log('=====================================================================');
            console.log('WARNING: SmartThings: Attempting to load controller that requires');
            console.log('WARNING: additional OAuth configuration!');
            console.log('WARNING: Visit this URL to authenticate:');
            console.log('https://graph.api.smartthings.com/oauth/authorize?response_type=code&client_id=' + controller.config.clientId + '&redirect_uri=http://' + config.serverIp + ':' + config.serverPort + '/oauth/' + controller.config.deviceId + '&scope=app');
            console.log('=====================================================================');
          }
        });
      }
    },

    send : function (config) {

    }
  };
}());