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
    version : 20140622,

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
          'User-Agent'     : 'node-universal-controller'
        }
      };
    },

    /**
     * Use received OAuth2 code to query for access token to be used later.
     */
    oauthCode : function (oauthCode, deviceName, deviceConfig, config) {
      var smartthings = {},
          that        = this;

      smartthings.path     = deviceConfig.path || '/oauth/token?grant_type=authorization_code&client_id=' + deviceConfig.clientId + '&client_secret=' + deviceConfig.clientSecret + '&redirect_uri=http://' + config.serverIp + ':' + config.serverPort + '/oauth/' + deviceName + '&code=' + oauthCode + '&scope=app';
      smartthings.callback = function(err, response) {
        var fs       = require('fs'),
            authData = {},
            cache;

        if(!err) {
          response = JSON.parse(response);

          if(response.error) {
            console.log('SmartThings: ' + response.error_description);
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

      console.log('SmartThings: Fetching device url');

      smartthings.path     = controller.config.path || '/api/smartapps/endpoints/' + controller.config.clientId + '?access_token=' + auth.accessToken;
      smartthings.callback = function(err, response) {
        var fs = require('fs'),
            i  = 0,
            cache;

        if(!err) {
          response = JSON.parse(response);

          if(response.error) {
            console.log('SmartThings: ' + response.message);
          }

          else {
            auth.url = response[0].url;

            State[controller.config.deviceId].auth = auth;

            cache = fs.createWriteStream(__dirname + '/../tmp/smartthingsAuth.json');
            cache.once('open', function() {
              console.log('SmartThings: Auth data cached with URL');

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

      console.log('SmartThings: Fetching device info');

      smartthings.device.deviceId = controller.config.deviceId;
      smartthings.path            = controller.config.path || auth.url + '/switches';
      smartthings.device.auth     = auth;

      this.send(smartthings);
    },

    updateState : function (smartthings, response) {
      var subDevices  = {},
          deviceState = require('../lib/deviceState'),
          mode        = '',
          i           = 0;

      if((response) && (response.mode) && (response.devices)) {
        mode = response.mode;

        for(i; i < response.devices.length; i += 1) {
          subDevices[i] = {
            id    : response.devices[i].id,
            label : response.devices[i].label,
            type  : response.devices[i].type,
            state : response.devices[i].state
          };
        }

        deviceState.updateState(smartthings.deviceName, { value : { devices : subDevices, mode : mode } });
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
      var subDevices  = State[config.device.deviceId].value.devices,
          commandType = '',
          subDevice   = {},
          path        = '',
          i           = 1;

      if(command.indexOf('toggle-') === 0) {
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

      else if(command.indexOf('mode-') === 0) {
        commandType = 'mode';
      }

      if(commandType === 'mode') {
        path = config.device.auth.url + '/mode/' + command.replace(commandType + '-', '') + '?access_token=' + config.device.auth.accessToken;
      }

      else if(commandType) {
        subDevice = this.findSubDevices(command.replace(commandType + '-', ''), subDevices);

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

              config.path = subDevice[i][commandType];

              this.send(config);
            }
          }
        }
      }

      return path;
    },

    init : function (controller, config) {
      var fs   = require('fs'),
          auth = {};

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

    onload : function (controller) {
      var markup            = controller.markup,
          fs                = require('fs'),
          templateSwitch    = fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListSwitch.tpl').toString(),
          templateLock      = fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListLock.tpl').toString(),
          templateGroup     = '',
          i                 = 0,
          j                 = 0,
          tempMarkup        = '',
          deviceMarkup      = '',
          mode              = '',
          subDeviceMarkup   = '',
          subDeviceTemplate = '',
          subDevice,
          subDevices,
          subDeviceGroup;

      mode       = State[controller.config.deviceId].value.mode;
      subDevices = State[controller.config.deviceId].value.devices;

      if(subDevices) {
        // You want to display SmartThings devices in groups.
        if(controller.config.groups) {
          templateGroup = fs.readFileSync(__dirname + '/../templates/fragments/smartthingsGroups.tpl').toString();

          for(i in controller.config.groups) {
            tempMarkup      = tempMarkup + templateGroup;
            subDeviceMarkup = '';

            for(j in controller.config.groups[i]) {
              subDeviceGroup  = this.findSubDevices(controller.config.groups[i][j], subDevices);

              if(subDeviceGroup && subDeviceGroup[0]) {
                switch(subDeviceGroup[0].type) {
                  case 'switch' :
                    subDeviceTemplate = templateSwitch;
                  break;

                  case 'lock' :
                    subDeviceTemplate = templateLock;
                  break;
                }

                subDeviceMarkup = subDeviceMarkup + subDeviceTemplate.split('{{SUB_DEVICE_ID}}').join(subDeviceGroup[0].label.split(' ').join('+'));
                subDeviceMarkup = subDeviceMarkup.split('{{SUB_DEVICE_NAME}}').join(subDeviceGroup[0].label);

                if((subDeviceGroup[0].state === 'on') || (subDeviceGroup[0].state === 'lock')) {
                  subDeviceMarkup = subDeviceMarkup.split('{{SUB_DEVICE_STATE}}').join(' device-active');
                }

                else {
                  subDeviceMarkup = subDeviceMarkup.split('{{SUB_DEVICE_STATE}}').join('');
                }
              }
            }

            tempMarkup = tempMarkup.split('{{GROUP_TITLE}}').join(i);
            tempMarkup = tempMarkup.split('{{SUB_DEVICE_LIST}}').join(subDeviceMarkup);
          }
        }

        // Otherwise, you want to show them in a list.
        else {
          for(i in subDevices) {
            subDevice = subDevices[i];

            switch(subDevice.type) {
              case 'switch' :
                subDeviceTemplate = templateSwitch;
              break;

              case 'lock' :
                subDeviceTemplate = templateLock;
              break;
            }

            tempMarkup = tempMarkup + subDeviceTemplate.split('{{SUB_DEVICE_ID}}').join(subDevice.label.split(' ').join('+'));
            tempMarkup = tempMarkup.split('{{SUB_DEVICE_NAME}}').join(subDevice.label);
          }
        }
      }

      switch(mode) {
        case 'Home' :
          markup = markup.split('{{DEVICE_STATE_HOME}}').join(' device-active');
        break;

        case 'Away' :
          markup = markup.split('{{DEVICE_STATE_AWAY}}').join(' device-active');
        break;

        case 'Night' :
          markup = markup.split('{{DEVICE_STATE_NIGHT}}').join(' device-active');
        break;
      }

      markup = markup.split('{{DEVICE_STATE_HOME}}').join('');
      markup = markup.split('{{DEVICE_STATE_AWAY}}').join('');
      markup = markup.split('{{DEVICE_STATE_NIGHT}}').join('');

      return markup.replace('{{SMARTTHINGS_DYNAMIC}}', tempMarkup);
    },

    send : function (config) {
      var https       = require('https'),
          smartthings = {},
          devices     = {},
          request     = {},
          dataReply   = '',
          that        = this;

      smartthings.deviceName = config.device.deviceId;
      smartthings.auth       = config.device.auth;
      smartthings.command    = config.subdevice || '';
      smartthings.host       = config.host      || 'graph.api.smartthings.com';
      smartthings.port       = config.port      || 443;
      smartthings.path       = config.path      || '';
      smartthings.method     = config.method    || 'GET';
      smartthings.callback   = config.callback  || function() {};

      request = this.postPrepare(smartthings);

      if(smartthings.auth) {
        request.headers.Authorization = 'Bearer ' + smartthings.auth.accessToken;
      }

      if(smartthings.command) {
        request.path = this.getDevicePath(smartthings.command, config);
      }

      request = https.request(request, function(response) {
                  response.once('data', function(response) {
                    console.log('SmartThings: Connected');

                    dataReply += response;
                  });

                  response.once('end', function() {
                    var deviceState     = require('../lib/deviceState'),
                        smartthingsData = {};

                    if(dataReply) {
                      smartthingsData = JSON.parse(dataReply);

                      that.updateState(smartthings, smartthingsData);

                      smartthings.callback(null, dataReply);
                    }

                    else {
                      console.log('SmartThings: No data returned from API');

                      smartthings.callback(null, '');
                    }
                  });
                });

      request.once('error', function(err) {
        var errorMsg = '';

        if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
          errorMsg = 'SmartThings: Device is off or unreachable';
        }

        else {
          errorMsg = 'SmartThings: ' + err.code;
        }

        console.log(errorMsg);

        smartthings.callback(errorMsg);
      });

      request.end();

      return dataReply;
    }
  };
}());
