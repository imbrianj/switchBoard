/*jslint white: true */
/*global State, module, require, console */

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

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @requires fs, https
   * @fileoverview Basic control of SmartThings endpoint.
   */
  return {
    version : 20140803,

    inputs  : ['list', 'subdevice'],

    /**
     * Prepare a POST request for a command.
     */
    postPrepare : function(config) {
      return {
        host    : config.host,
        port    : config.port,
        path    : config.path,
        method  : config.method,
        headers : {
          'Accept'         : 'application/json',
          'Accept-Charset' : 'utf-8',
          'User-Agent'     : 'node-switchBoard'
        }
      };
    },

    /**
     * Use received OAuth2 code to query for access token to be used later.
     */
    oauthCode : function (oauthCode, deviceId, deviceConfig, config) {
      var smartthings = {},
          that        = this;

      smartthings.path     = deviceConfig.path || '/oauth/token?grant_type=authorization_code&client_id=' + deviceConfig.clientId + '&client_secret=' + deviceConfig.clientSecret + '&redirect_uri=http://' + config.serverIp + ':' + config.serverPort + '/oauth/' + deviceId + '&code=' + oauthCode + '&scope=app';
      smartthings.callback = function(err, response) {
        var fs       = require('fs'),
            authData = {},
            cache;

        if(!err) {
          response = JSON.parse(response);

          if(response.error) {
            console.log('\x1b[31mSmartThings\x1b[0m: ' + response.error_description);
          }

          else {
            authData.accessToken = response.access_token;
            authData.expire      = response.expires_in;

            that.oauthUrl(authData, { 'controller' : that, 'config' : deviceConfig });
          }
        }
      };

      this.send(smartthings);
    },

    /**
     * Use received OAuth2 access token to query for endpoint URL to be used
     * later.  Once we have all auth data, cache for future use.
     */
    oauthUrl : function (auth, controller) {
      var smartthings = {},
          that        = this;

      console.log('\x1b[35mSmartThings\x1b[0m: Fetching device url');

      smartthings.path     = controller.config.path || '/api/smartapps/endpoints/' + controller.config.clientId + '?access_token=' + auth.accessToken;
      smartthings.callback = function(err, response) {
        var fs = require('fs'),
            i  = 0,
            cache;

        if(!err) {
          response = JSON.parse(response);

          if(response.error) {
            console.log('\x1b[31mSmartThings\x1b[0m: ' + response.message);
          }

          else {
            auth.url = response[0].url;

            controller.config.auth = auth;

            cache = fs.createWriteStream(__dirname + '/../tmp/smartthingsAuth.json');
            cache.once('open', function() {
              console.log('\x1b[35mSmartThings\x1b[0m: Auth data cached with URL');

              that.oauthDeviceList(auth, controller);

              cache.write(JSON.stringify(auth));
            });
          }
        }
      };

      this.send(smartthings);
    },

    /**
     * Query for current device list.
     */
    oauthDeviceList : function (auth, controller) {
      var smartthings = { device : {} },
          request     = {},
          that        = this;

      console.log('\x1b[35mSmartThings\x1b[0m: Fetching device info');

      smartthings.device.deviceId = controller.config.deviceId;
      smartthings.path            = controller.config.path   || auth.url + '/list';
      smartthings.device.auth     = auth;
      smartthings.device.groups   = controller.config.groups || {};

      this.send(smartthings);
    },

    updateState : function (smartthings, response) {
      var subDevices  = {},
          deviceState = require(__dirname + '/../lib/deviceState'),
          state       = 'err',
          mode        = '',
          i           = 0,
          device;

      if((response) && (response.mode) && (response.devices)) {
        mode  = response.mode;
        state = 'ok';

        for(i; i < response.devices.length; i += 1) {
          device = response.devices[i];

          if(device.values) {
            subDevices[i] = {
              id    : device.id,
              label : device.label
            };

            // SmartThings supports multi-role devices - meaning a single device
            // may report temp as well as be a contact sensor.  For now, we're
            // only concerned with the primary role - and take priority over
            // those functions that seem most valuable.
            if(device.values.switch) {
              // You're a switch
              subDevices[i].type  = 'switch';
              subDevices[i].state = device.values.switch.value;
            }

            else if(device.values.lock) {
              // You're a lock
              subDevices[i].type  = 'lock';
              subDevices[i].state = device.values.lock.value;
            }

            else if(device.values.contact) {
              // You're a contact sensor
              subDevices[i].type  = 'contact';
              subDevices[i].state = device.values.contact.value === 'open' ? 'on' : 'off';
            }

            else if(device.values.water) {
              // You're a moisture sensor
              subDevices[i].type  = 'water';
              subDevices[i].state = device.values.water.value === 'wet' ? 'on' : 'off';
            }

            else if(device.values.motion) {
              // You're a motion sensor
              subDevices[i].type  = 'motion';
              subDevices[i].state = device.values.motion.value === 'active' ? 'on' : 'off';
            }

            else if(device.values.presence) {
              // You're a presence sensor
              subDevices[i].type  = 'presence';
              subDevices[i].state = device.values.presence.value === 'present' ? 'on' : 'off';
            }

            // These are commonly secondary sensors for a given device.
            if(device.values.temperature) {
              // If you have a proper state, temp is peripheral sensor.
              if(subDevices[i].state) {
                subDevices[i].peripheral = subDevices[i].peripheral || {};
                subDevices[i].peripheral.temp = device.values.temperature.value;
              }

              // If you have no proper state, you're just a temperature sensor.
              else {
                subDevices[i].state = device.values.temperature.value;
              }
            }
          }
        }

        deviceState.updateState(smartthings.deviceId, 'smartthings', { state : state, value : { devices : subDevices, mode : mode, groups : response.groups } });
      }
    },

    /**
     * As devices can have the same names - but I assume they all want to be
     * interacted with in concert, we'll not use a hash table - and return an
     * object of applicable sub devices to act upon.
     */
    findSubDevices : function (subDeviceLabel, subDevices) {
      var subDevice = {},
          collected = [],
          i         = 0,
          j         = 0;

      for(i in subDevices) {
        subDevice = subDevices[i];

        if(subDevice.label === subDeviceLabel) {
          collected[j] = subDevice;
          j += 1;
        }
      }

      return collected;
    },

    getDevicePath : function(command, config) {
      var deviceState      = require(__dirname + '/../lib/deviceState'),
          smartThingsState = deviceState.getDeviceState(config.device.deviceId),
          subDevices       = {},
          commandType      = '',
          subDevice        = {},
          path             = '',
          i                = 1,
          value            = '';

      if((smartThingsState.value) && (smartThingsState.value.devices)) {
        subDevices = JSON.parse(JSON.stringify(smartThingsState.value.devices));
      }

      if(command.indexOf('mode-') === 0) {
        command = command.replace('mode-', '');
        path    = config.device.auth.url + '/mode/' + command + '?access_token=' + config.device.auth.accessToken;
      }

      else if(command.indexOf('toggle-') === 0) {
        commandType = 'toggle';
      }

      else if(command.indexOf('on-') === 0) {
        commandType = 'on';
      }

      else if(command.indexOf('off-') === 0) {
        commandType = 'off';
      }

      else if(command.indexOf('lock-') === 0) {
        commandType = 'lock';
      }

      else if(command.indexOf('unlock-') === 0) {
        commandType = 'unlock';
      }

      else if(command.indexOf('state-mode-') === 0) {
        command = command.replace('state-mode-', '');

        deviceState.updateState(config.device.deviceId, 'smartthings', { state : 'ok', value : { devices : subDevices, mode : command, groups : config.device.groups } });
      }

      else if(command.indexOf('state-switch-') === 0) {
        commandType = 'switch';
      }

      else if(command.indexOf('state-lock-') === 0) {
        commandType = 'lock';
      }

      else if(command.indexOf('state-temp-') === 0) {
        commandType = 'temp';
      }

      else if(command.indexOf('state-contact-') === 0) {
        commandType = 'contact';
      }

      else if(command.indexOf('state-moisture-') === 0) {
        commandType = 'moisture';
      }

      else if(command.indexOf('state-motion-') === 0) {
        commandType = 'motion';
      }

      else if(command.indexOf('state-presence-') === 0) {
        commandType = 'presence';
      }

      if(commandType === 'temp') {
        command = command.replace('state-temp-', '');
        value   = command.split('-');
        command = value[0];
        value   = value[1];

        if(!isNaN(value)) {
          for(i in subDevices) {
            subDevice = subDevices[i];

            if(subDevice.label === command) {
              // If you have a proper state, temp is peripheral sensor.
              if(subDevice.state) {
                subDevices[i].peripheral = subDevices[i].peripheral || {};
                subDevices[i].peripheral.temp = value;
              }

              // If you have no proper state, you're just a temperature sensor.
              else {
                subDevices[i].state = value;
              }

              deviceState.updateState(config.device.deviceId, 'smartthings', { state : 'ok', value : { devices : subDevices, mode : smartThingsState.value.mode, groups : config.device.groups } });
            }
          }
        }
      }

      else if((command.indexOf('state-') === 0) && (commandType)) {
        command = command.replace('state-' + commandType + '-', '');
        value   = command.split('-');
        command = value[0];
        value   = value[1];

        for(i in subDevices) {
          subDevice = subDevices[i];

          if(subDevice.label === command) {
            subDevices[i].state = value;

            deviceState.updateState(config.device.deviceId, 'smartthings', { state : 'ok', value : { devices : subDevices, mode : smartThingsState.value.mode, groups : config.device.groups } });
          }
        }
      }

      else if(commandType) {
        command   = command.replace(commandType + '-', '');
        subDevice = this.findSubDevices(command, subDevices);

        if((subDevice) && (subDevice[0])) {
          if(subDevice[0].type === 'switch') {
            path = config.device.auth.url + '/switches/' + subDevice[0].id + '/' + commandType + '?access_token=' + config.device.auth.accessToken;
          }

          else if(subDevice[0].type === 'lock') {
            path = config.device.auth.url + '/locks/' + subDevice[0].id + '/' + commandType + '?access_token=' + config.device.auth.accessToken;
          }

          // For same-named devices, we want them to operate in concert, so
          // we'll send along the same command to each of them.
          if(subDevice.length > 1) {
            for(i; i < subDevice.length; i += 1) {
              config.subdevice = '';

              if(subDevice[i].type === 'switch') {
                config.path = config.device.auth.url + '/switches/' + subDevice[i].id + '/' + commandType + '?access_token=' + config.device.auth.accessToken;
              }

              else if(subDevice[i].type === 'lock') {
                config.path = config.device.auth.url + '/locks/' + subDevice[i].id + '/' + commandType + '?access_token=' + config.device.auth.accessToken;
              }

              this.send(config);
            }
          }
        }
      }

      return path;
    },

    init : function (controller, config) {
      var fs     = require('fs'),
          auth   = {},
          groups = config.groups || {};

      if(typeof controller.config.clientId !== 'undefined' && controller.config.clientSecret !== 'undefined') {
        fs.exists(__dirname + '/../tmp/smartthingsAuth.json', function(fileExists) {
          // If we have a presumed good auth token, we can populate the device list.
          if(fileExists) {
            fs.readFile(__dirname + '/../tmp/smartthingsAuth.json', function(err, auth) {
              auth = JSON.parse(auth.toString());

              if(typeof auth.url === 'string') {
                controller.config.auth = auth;

                controller.controller.oauthDeviceList(auth, controller);
              }

              else {
                controller.controller.oauthUrl(auth, controller);
              }
            });
          }

          // Otherwise, we need to prompt the user to retrieve the auth token.
          else {
            console.log('\x1b[31m=====================================================================\x1b[0m');
            console.log('\x1b[31mWARNING\x1b[0m: SmartThings: Attempting to load controller that requires');
            console.log('\x1b[31mWARNING\x1b[0m: additional OAuth configuration!');
            console.log('\x1b[31mWARNING\x1b[0m: Visit this URL to authenticate:');
            console.log('https://graph.api.smartthings.com/oauth/authorize?response_type=code&client_id=' + controller.config.clientId + '&redirect_uri=http://' + config.serverIp + ':' + config.serverPort + '/oauth/' + controller.config.deviceId + '&scope=app');
            console.log('\x1b[31m=====================================================================\x1b[0m');
          }
        });
      }

      return controller;
    },

    onload : function (controller) {
      var fs               = require('fs'),
          parser           = require(__dirname + '/../parsers/smartthings').smartthings,
          deviceState      = require(__dirname + '/../lib/deviceState'),
          smartThingsState = deviceState.getDeviceState(controller.config.deviceId),
          switchFragment   = fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListSwitch.tpl').toString(),
          lockFragment     = fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListLock.tpl').toString(),
          contactFragment  = fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListContact.tpl').toString(),
          waterFragment    = fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListWater.tpl').toString(),
          motionFragment   = fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListMotion.tpl').toString(),
          presenceFragment = fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListPresence.tpl').toString(),
          groupFragment    = fs.readFileSync(__dirname + '/../templates/fragments/smartthingsGroups.tpl').toString();

      return parser(controller.deviceId,
                    controller.markup,
                    smartThingsState.state,
                    smartThingsState.value,
                    { switch   : switchFragment,
                      lock     : lockFragment,
                      contact  : contactFragment,
                      water    : waterFragment,
                      motion   : motionFragment,
                      presence : presenceFragment,
                      group    : groupFragment });
    },

    send : function (config) {
      var https       = require('https'),
          smartthings = {},
          devices     = {},
          request     = {},
          dataReply   = '',
          that        = this;

      config.device        = config.device          || {};
      smartthings.deviceId = config.device.deviceId || '';
      smartthings.auth     = config.device.auth     || '';
      smartthings.command  = config.subdevice       || '';
      smartthings.list     = config.list            || '';
      smartthings.host     = config.host            || 'graph.api.smartthings.com';
      smartthings.port     = config.port            || 443;
      smartthings.path     = config.path            || '';
      smartthings.method   = config.method          || 'GET';
      smartthings.callback = config.callback        || function() {};

      request = this.postPrepare(smartthings);

      if(smartthings.auth) {
        request.headers.Authorization = 'Bearer ' + smartthings.auth.accessToken;
      }

      if(smartthings.command) {
        request.path = this.getDevicePath(smartthings.command, config);
      }

      if(smartthings.list) {
        this.oauthDeviceList(smartthings.auth, { config : { deviceId : config.device.deviceId, groups : config.device.groups } });
      }

      else if(request.path) {
        request = https.request(request, function(response) {
                    console.log('\x1b[32mSmartThings\x1b[0m: Connected');

                    response.on('data', function(response) {
                      dataReply += response;
                    });

                    response.once('end', function() {
                      var deviceState     = require('../lib/deviceState'),
                          smartthingsData = {};

                      if(dataReply) {
                        smartthingsData = JSON.parse(dataReply);

                        smartthingsData.groups = config.device.groups;

                        that.updateState(smartthings, smartthingsData);

                        smartthings.callback(null, dataReply, true);
                      }

                      else {
                        console.log('\x1b[31mSmartThings\x1b[0m: No data returned from API');

                        smartthings.callback('err');
                      }
                    });
                  });

        request.once('error', function(err) {
          var errorMsg = '';

          if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
            errorMsg = '\x1b[31mSmartThings\x1b[0m: Device is off or unreachable';
          }

          else {
            errorMsg = '\x1b[31mSmartThings\x1b[0m: ' + err.code;
          }

          console.log(errorMsg);

          smartthings.callback(errorMsg);
        });

        request.end();

        return dataReply;
      }
    }
  };
}());
