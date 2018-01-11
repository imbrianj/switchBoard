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
    version : 20180109,

    inputs  : ['list', 'subdevice'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { group  : fs.readFileSync(__dirname + '/fragments/smartthingsGroups.tpl',     'utf-8'),
               action : fs.readFileSync(__dirname + '/fragments/smartthingsListAction.tpl', 'utf-8'),
               static : fs.readFileSync(__dirname + '/fragments/smartthingsListStatic.tpl', 'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
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
          that        = this,
          ssl         = config.ssl.disabled === false ? 'https' : 'http';

      smartthings.config   = { celsius : config.celsius };
      smartthings.device   = { title   : deviceConfig.title };
      smartthings.method   = 'POST';
      smartthings.path     = deviceConfig.path || '/oauth/token?grant_type=authorization_code&client_id=' + deviceConfig.clientId + '&client_secret=' + deviceConfig.clientSecret + '&redirect_uri=' + ssl + '://' + config.serverIp + ':' + config.serverPort + '/oauth/' + deviceId + '&code=' + oauthCode + '&scope=app';
      smartthings.callback = function (err, response) {
        var authData = {};

        if ((!err) && (response)) {
          if (response.error) {
            console.log('\x1b[31m' + deviceConfig.title + '\x1b[0m: ' + response.error_description);
          }

          else {
            authData.accessToken = response.access_token;
            authData.expire      = response.expires_in;

            that.oauthUrl(authData, { 'controller' : that, 'config' : deviceConfig }, config);
          }
        }

        else {
          console.log('\x1b[31m' + deviceConfig.title + '\x1b[0m: ' + err);
        }
      };

      this.send(smartthings);
    },

    /**
     * Use received OAuth2 access token to query for endpoint URL to be used
     * later.  Once we have all auth data, cache for future use.
     */
    oauthUrl : function (auth, controller, config) {
      var smartthings = {},
          that        = this;

      console.log('\x1b[35m' + controller.config.title + '\x1b[0m: Fetching device url');

      smartthings.config   = { celsius : config.celsius };
      smartthings.path     = controller.config.path || '/api/smartapps/endpoints/' + controller.config.clientId + '?access_token=' + auth.accessToken;
      smartthings.callback = function (err, response) {
        var fs = require('fs'),
            cache;

        if (!err) {
          if (response.error) {
            console.log('\x1b[31m' + controller.config.title + '\x1b[0m: ' + response.message);
          }

          else {
            auth.url = response[0].url;

            controller.config.auth = auth;

            cache = fs.createWriteStream(__dirname + '/../../cache/smartthingsAuth.json');

            cache.once('open', function () {
              console.log('\x1b[35m' + controller.config.title + '\x1b[0m: Auth data cached with URL');

              that.oauthDeviceList({ deviceId : controller.config.deviceId, auth : auth, groups : controller.config.groups, className : controller.config.className });

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
    oauthDeviceList : function (config) {
      console.log('\x1b[35m' + config.title + '\x1b[0m: Fetching device info');

      delete config.list;
      config.deviceId = config.deviceId;
      config.path     = config.path || config.auth.url + '/list';
      config.device   = { auth : config.auth, deviceId : config.deviceId, groups : config.groups, className : config.className };
      config.config   = { celsius : config.celsius };

      this.send(config);
    },

    /**
     * When we get a full API response from SmartThings (during every poll and
     * every SwitchBoard command), we'll parse through it and set the new state
     * of the world.
     */
    updateState : function (smartthings, response, controller) {
      var subdevices       = [],
          smartthingsData  = {},
          deviceState      = require(__dirname + '/../../lib/deviceState'),
          util             = require(__dirname + '/../../lib/sharedUtil').util,
          smartthingsState = deviceState.getDeviceState(smartthings.deviceId),
          state            = 'err',
          mode             = '',
          i                = 0,
          currDevice       = {},
          device,
          matched,
          findByName       = function (find, i) {
                               var found   = {},
                                   device  = find[i],
                                   devices = ((smartthingsState) && (smartthingsState.value)) ? smartthingsState.value.devices : null,
                                   j       = 0;

                               if ((devices) && (devices[i])) {
                                 // It's likely that the array structure is the same.
                                 // In that case, we can just quickly validate it's the
                                 // same and pass that along.
                                 if (device.id === devices[i].id) {
                                   found = devices[i];
                                 }

                                 // Otherwise, let's search for it.
                                 else {
                                   for (j; j < devices.length; j += 1) {
                                     if (device.id === devices[j].id) {
                                       found = devices[j];
                                       break;
                                     }
                                   }
                                 }
                               }

                               return found;
                             };

      if ((response) && (response.mode) && (response.devices)) {
        mode  = util.sanitize(response.mode);
        state = 'ok';

        for (i; i < response.devices.length; i += 1) {
          device = response.devices[i];

          if ((device.values) && (device.id) && (device.label)) {
            matched = findByName(response.devices, i);

            currDevice = {
              id       : util.sanitize(device.id),
              label    : util.sanitize(device.label),
              lastOn   : util.sanitize(matched.lastOn),
              lastOff  : util.sanitize(matched.lastOff),
              duration : util.sanitize(matched.duration)
            };

            if ((smartthings.className) && (smartthings.className[device.label])) {
              currDevice.className = smartthings.className[device.label];
            }

            // SmartThings supports multi-role devices - meaning a single device
            // may report temp as well as be a contact sensor.  For now, we're
            // only concerned with the primary role - and take priority over
            // those functions that seem most valuable.
            if (device.values.switch) {
              // You're a switch
              currDevice.type  = 'switch';
              currDevice.state = util.sanitize(device.values.switch.value);
            }

            else if (device.values.lock) {
              // You're a lock
              currDevice.type  = 'lock';
              currDevice.state = util.sanitize(device.values.lock.value);
            }

            else if (device.values.contact) {
              // You're a contact sensor
              currDevice.type     = 'contact';
              currDevice.state    = device.values.contact.value === 'open' ? 'on' : 'off';
              currDevice.readOnly = true;
            }

            else if (device.values.water) {
              // You're a moisture sensor
              currDevice.type     = 'water';
              currDevice.state    = device.values.water.value === 'wet' ? 'on' : 'off';
              currDevice.readOnly = true;
            }

            else if (device.values.motion) {
              // You're a motion sensor
              currDevice.type     = 'motion';
              currDevice.state    = device.values.motion.value === 'active' ? 'on' : 'off';
              currDevice.readOnly = true;
            }

            else if (device.values.presence) {
              // You're a presence sensor
              currDevice.type     = 'presence';
              currDevice.state    = device.values.presence.value === 'present' ? 'on' : 'off';
              currDevice.readOnly = true;
            }

            // These are commonly secondary sensors for a given device.
            if ((device.values.temperature) || (device.values.vibrate) || (device.values.battery)) {
              // If you have a proper state, temp is peripheral sensor.
              if (currDevice.state) {
                currDevice.peripheral = currDevice.peripheral || {};

                if (device.values.temperature) {
                  currDevice.peripheral.temp = parseInt(util.sanitize(device.values.temperature.value), 10);

                  if (smartthings.config.celsius) {
                    currDevice.peripheral.temp = util.fToC(currDevice.peripheral.temp);
                  }
                }

                if (device.values.vibrate) {
                  currDevice.peripheral.vibrate = util.sanitize(device.values.vibrate.value);
                }

                if (device.values.battery) {
                  currDevice.peripheral.battery = parseInt(util.sanitize(device.values.battery.value), 10);
                }
              }

              else {
                // If you have no proper state, you're just a temperature
                // sensor.
                if (device.values.temperature) {
                  currDevice.state = parseInt(util.sanitize(device.values.temperature.value), 10);

                  if (smartthings.config.celsius) {
                    currDevice.state = util.fToC(currDevice.state);
                  }
                }

                // ...or a vibrate sensor.
                if (device.values.vibrate) {
                  currDevice.state = util.sanitize(device.values.vibrate.value);
                }

                // ...or something with a battery.
                if (device.values.battery) {
                  currDevice.peripheral         = currDevice.peripheral || {};
                  currDevice.peripheral.battery = parseInt(util.sanitize(device.values.battery.value), 10);
                }
              }
            }

            subdevices.push(currDevice);
          }
        }

        smartthingsData = { state : state, value : { devices : subdevices, mode : mode, groups : response.groups } };
        deviceState.updateState(smartthings.deviceId, 'smartthings', smartthingsData);
      }

      else if (response.error) {
        console.log('\x1b[31m' + controller.title + '\x1b[0m: ' + util.sanitize(response.message));
      }

      return smartthingsData;
    },

    /**
     * As devices can have the same names - but I assume they all want to be
     * interacted with in concert, we'll not use a hash table - and return an
     * object of applicable sub devices to act upon.
     */
    findSubdevices : function (subdeviceLabel, subdevices) {
      var subdevice = {},
          collected = [],
          i         = 0;

      for (i in subdevices) {
        if (subdevices.hasOwnProperty(i)) {
          subdevice = subdevices[i];

          if (subdevice.label === subdeviceLabel) {
            collected.push(subdevice);
          }
        }
      }

      return collected;
    },

    /**
     * The companion SmartThings SmartApp allows for local IP callbacks.  When
     * an action occurs on the SmartThings network, it sends that message to the
     * local hub.  The hub then fires a simple REST request to SwitchBoard to
     * indicate when a device's state has changes.  This is where we accept that
     * request and determine which device has changed to which state based on
     * the device path provided.
     */
    getDevicePath : function (command, config, callback) {
      var deviceState      = require(__dirname + '/../../lib/deviceState'),
          smartThingsState = deviceState.getDeviceState(config.device.deviceId),
          subdevices       = {},
          commandType      = '',
          subdevice        = {},
          path             = '',
          i                = 1,
          value            = '';

      if ((smartThingsState.value) && (smartThingsState.value.devices)) {
        subdevices = smartThingsState.value.devices;
      }

      // Update states.
      if (command.indexOf('state-mode-') === 0) {
        command = command.replace('state-mode-', '');

        if ((command === 'Home') || (command === 'Away') || (command === 'Night')) {
          callback(null, { devices : subdevices, mode : command, groups : config.device.groups });
        }
      }

      else if (command.indexOf('state-switch-') === 0) {
        commandType = 'switch';
      }

      else if (command.indexOf('state-lock-') === 0) {
        commandType = 'lock';
      }

      else if (command.indexOf('state-temp-') === 0) {
        commandType = 'temp';
      }

      else if (command.indexOf('state-vibrate-') === 0) {
        commandType = 'vibrate';
      }

      else if (command.indexOf('state-contact-') === 0) {
        commandType = 'contact';
      }

      else if (command.indexOf('state-moisture-') === 0) {
        commandType = 'moisture';
      }

      else if (command.indexOf('state-motion-') === 0) {
        commandType = 'motion';
      }

      else if (command.indexOf('state-presence-') === 0) {
        commandType = 'presence';
      }

      // These are issued commands - not state changes.
      else if (command.indexOf('mode-') === 0) {
        command = command.replace('mode-', '');
        path    = config.device.auth.url + '/mode/' + command + '?access_token=' + config.device.auth.accessToken;
      }

      else if (command.indexOf('-toggle', command.length - 7) !== -1) {
        commandType = 'toggle';
      }

      else if (command.indexOf('-on', command.length - 3) !== -1) {
        commandType = 'on';
      }

      else if (command.indexOf('-off', command.length - 4) !== -1) {
        commandType = 'off';
      }

      else if (command.indexOf('-lock', command.length - 5) !== -1) {
        commandType = 'lock';
      }

      else if (command.indexOf('-unlock', command.length - 7) !== -1) {
        commandType = 'unlock';
      }

      if (commandType === 'temp') {
        command = command.replace('state-temp-', '');
        value   = command.split('-');
        command = value[0];
        value   = value[1];

        if (!isNaN(value)) {
          for (i in subdevices) {
            if (subdevices.hasOwnProperty(i)) {
              subdevice = subdevices[i];

              if (subdevice.label === command) {
                // If you have a proper state, temp is peripheral sensor.
                if (subdevice.state) {
                  subdevices[i].peripheral = subdevices[i].peripheral || {};
                  subdevices[i].peripheral.temp = value;
                }

                // If you have no proper state, you're just a temperature sensor.
                else {
                  subdevices[i].state = value;
                }

                callback(null, { devices : subdevices, mode : smartThingsState.value.mode, groups : config.device.groups });
              }
            }
          }
        }
      }

      else if ((command.indexOf('state-') === 0) && (commandType)) {
        command = command.replace('state-' + commandType + '-', '');
        value   = command.split('-');
        command = value[0];
        value   = value[1];

        for (i in subdevices) {
          if (subdevices.hasOwnProperty(i)) {
            subdevice = subdevices[i];

            if (subdevice.label === command) {
              // If you have a proper state, vibrate is peripheral sensor.
              if ((commandType === 'vibrate') && (subdevice.state)) {
                subdevices[i].peripheral = subdevices[i].peripheral || {};
                subdevices[i].peripheral.vibrate = value;
              }

              // If you have no proper state, you're just a temperature sensor.
              else {
                subdevices[i].state = value;
              }

              callback(null, { devices : subdevices, mode : smartThingsState.value.mode, groups : config.device.groups });
            }
          }
        }
      }

      else if (commandType) {
        command   = command.replace('-' + commandType, '');
        subdevice = this.findSubdevices(command, subdevices);

        if ((subdevice) && (subdevice[0])) {
          if (subdevice[0].type === 'switch') {
            path = config.device.auth.url + '/switches/' + subdevice[0].id + '/' + commandType + '?access_token=' + config.device.auth.accessToken;
          }

          else if (subdevice[0].type === 'lock') {
            path = config.device.auth.url + '/locks/' + subdevice[0].id + '/' + commandType + '?access_token=' + config.device.auth.accessToken;
          }

          // For same-named devices, we want them to operate in concert, so
          // we'll send along the same command to each of them.
          if (subdevice.length > 1) {
            for (i; i < subdevice.length; i += 1) {
              config.subdevice = '';

              if (subdevice[i].type === 'switch') {
                config.path = config.device.auth.url + '/switches/' + subdevice[i].id + '/' + commandType + '?access_token=' + config.device.auth.accessToken;
              }

              else if (subdevice[i].type === 'lock') {
                config.path = config.device.auth.url + '/locks/' + subdevice[i].id + '/' + commandType + '?access_token=' + config.device.auth.accessToken;
              }

              this.send(config);
            }
          }
        }
      }

      return path;
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     *
     * If we have your auth information but do not have your valid keys, we'll
     * print out a friendly message with a link for you to finish the setup.
     */
    init : function (controller, config) {
      var fs   = require('fs'),
          auth = {},
          ssl  = config.ssl.disabled === false ? 'https' : 'http';

      if (typeof controller.config.clientId !== 'undefined' && controller.config.clientSecret !== 'undefined') {
        fs.readFile(__dirname + '/../../cache/smartthingsAuth.json', function (err, data) {
          var runCommand = require(__dirname + '/../../lib/runCommand');

          // We need to prompt the user to retrieve the auth token.
          if (err) {
            console.log('\x1b[31m=====================================================================\x1b[0m');
            console.log('\x1b[31mWARNING\x1b[0m: ' + controller.config.title + ': Attempting to load controller that requires');
            console.log('\x1b[31mWARNING\x1b[0m: additional OAuth configuration!');
            console.log('\x1b[31mWARNING\x1b[0m: Visit this URL to authenticate:');
            console.log('https://graph.api.smartthings.com/oauth/authorize?response_type=code&client_id=' + controller.config.clientId + '&redirect_uri=' + ssl + '://' + config.serverIp + ':' + config.serverPort + '/oauth/' + controller.config.deviceId + '&scope=app');
            console.log('\x1b[31m=====================================================================\x1b[0m');
          }

          else if (data) {
            if (data.toString()) {
              try {
                controller.config.auth = JSON.parse(data.toString());
              }

              catch (catchErr) {
                console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Failed to parse auth file');
              }

              if (controller.config.auth) {
                if (typeof controller.config.auth.url === 'string') {
                  runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
                }

                else {
                  controller.controller.oauthUrl(auth, controller, config);
                }
              }

              else {
                console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Auth cache is invalid');
              }
            }

            else {
              console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Auth cache is empty');
            }
          }
        });
      }

      return controller;
    },

    send : function (config) {
      var https       = require('https'),
          smartthings = {},
          request     = {},
          dataReply   = '',
          that        = this;

      config.device         = config.device           || {};
      smartthings.deviceId  = config.device.deviceId  || '';
      smartthings.title     = config.device.title     || '';
      smartthings.auth      = config.device.auth      || '';
      smartthings.groups    = config.device.groups    || {};
      smartthings.className = config.device.className || {};
      smartthings.command   = config.subdevice        || '';
      smartthings.list      = config.list             || '';
      smartthings.host      = config.host             || 'graph.api.smartthings.com';
      smartthings.port      = config.port             || 443;
      smartthings.path      = config.path             || '';
      smartthings.method    = config.method           || 'GET';
      smartthings.callback  = config.callback         || function () {};
      smartthings.config    = { celsius : !!config.config.celsius };

      if (smartthings.list) {
        this.oauthDeviceList(smartthings);
      }

      else {
        request = this.postPrepare(smartthings);

        if (smartthings.auth) {
          request.headers.Authorization = 'Bearer ' + smartthings.auth.accessToken;
        }

        if (smartthings.command) {
          request.path = this.getDevicePath(smartthings.command, config, smartthings.callback);
        }

        if (request.path) {
          request = https.request(request, function (response) {
                      response.on('data', function (response) {
                        dataReply += response;
                      });

                      response.once('end', function () {
                        var smartthingsData = null;

                        if (dataReply) {
                          try {
                            smartthingsData = JSON.parse(dataReply);
                          }

                          catch (err) {
                            smartthings.callback('Invalid data returned from API');
                          }

                          if (smartthingsData) {
                            smartthingsData.groups    = config.device.groups;
                            smartthingsData.className = config.device.className;

                            // If we have a full device list, we should try and
                            // get a filtered data set.
                            if (smartthingsData.devices) {
                              smartthingsData = that.updateState(smartthings, smartthingsData, config.device);
                            }

                            // Otherwise, it's probably auth data - let's just
                            // pass that to the callback to handle.
                            else {
                              that.updateState(smartthings, smartthingsData, config.device);
                            }

                            smartthings.callback(null, smartthingsData, true);
                          }
                        }

                        else {
                          smartthings.callback('No data returned from API');
                        }
                      });
                    });

          request.once('error', function (err) {
            smartthings.callback(err);
          });

          request.end();

          return dataReply;
        }
      }
    }
  };
}());
