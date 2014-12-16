/*jslint white: true */
/*global module, require, console */

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
   * @fileoverview Basic control of Nest thermostat and Protect smoke detector.
   * @requires querystring, fs, https
   */
  return {
    version : 20141215,

    inputs : ['command', 'text', 'list', 'subdevice'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap : ['AWAY', 'HOME', 'FAN_ON', 'FAN_AUTO'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { group      : fs.readFileSync(__dirname + '/../templates/fragments/nestGroups.tpl').toString(),
               thermostat : fs.readFileSync(__dirname + '/../templates/fragments/nestThermostat.tpl').toString(),
               protect    : fs.readFileSync(__dirname + '/../templates/fragments/nestProtect.tpl').toString() };
    },

    /**
     * Convert Celcius to Fahrenheit.
     *
     * The Nest API is all in Celcius, so we need to convert to Fahrenheit for
     * display.
     */
    cToF : function (c) {
      return (c * 1.8) + 32;
    },

    /**
     * Convert Fahrenheit to Celcius.
     *
     * The Nest API is all in Celcius, so we need to convert from Fahrenheit for
     * sending any temperature changes.
     */
    fToC : function (f) {
      return (f - 32) / 1.8;
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      var request = { host    : config.host,
                      port    : config.port,
                      path    : config.path,
                      method  : config.method,
                      headers : {
                        'Accept'         : 'application/json',
                        'Accept-Charset' : 'utf-8',
                        'User-Agent'     : 'node-switchBoard',
                        'Content-Type'   : 'application/x-www-form-urlencoded'
                      }
                    };

      if((config.auth) && (config.auth.userId) && (config.auth.token)) {
        request.headers['X-nl-protocol-version'] = 1;
        request.headers['X-nl-user-id']          = config.auth.userId;
        request.headers.Authorization            = 'Basic ' + config.auth.token;
      }

      if(config.postRequest) {
        request.headers['Content-Length'] = config.postRequest.length;
      }

      return request;
    },

    /**
     * Prepare the POST data to be sent.
     */
    postData : function (nest) {
      var querystring = require('querystring'),
          value;

      if(nest.args) {
        value = JSON.stringify(nest.args);
      }

      else {
        value = querystring.stringify({
                  username : nest.username,
                  password : nest.password
                });
      }

      return value;
    },

    /**
     * Device labels are sent as big crazy codes.  We'll convert those to the
     * expected names.
     */
    findLabel : function (id, language) {
      var translate = require(__dirname + '/../lib/translate'),
          location  = '';

      id = id.replace('00000000-0000-0000-0000-0001000000', '');

      switch(id) {
        case '01' :
          location = 'BASEMENT';
        break;

        case '0d' :
          location = 'BEDROOM';
        break;

        case '03' :
          location = 'DEN';
        break;

        case '10' :
          location = 'DINING_ROOM';
        break;

        case '06' :
          location = 'DOWNSTAIRS';
        break;

        case '00' :
          location = 'ENTRYWAY';
        break;

        case '0b' :
          location = 'FAMILY_ROOM';
        break;

        case '02' :
          location = 'HALLWAY';
        break;

        case '08' :
          location = 'KIDS_ROOM';
        break;

        case '0a' :
          location = 'KITCHEN';
        break;

        case '0c' :
          location = 'LIVING_ROOM';
        break;

        case '05' :
          location = 'MASTER_BEDROOM';
        break;

        case '0e' :
          location = 'OFFICE';
        break;

        case '0f' :
          location = 'UPSTAIRS';
        break;
      }

      return translate.translate('{{i18n_' + location + '}}', 'nest', language);
    },

    /**
     * Query - then cache your auth information into a file for later recall.
     */
    getAuth : function (config, controller) {
      var that = this;

      config = config || {};

      config.callback = function (err, response) {
        var fs   = require('fs'),
            auth = {},
            cache;

        if(!err) {
          if(response.error) {
            console.log('\x1b[31m' + controller.config.title + '\x1b[0m: ' + response.error_description);
          }

          else {
            auth.url    = response.urls.transport_url.replace('https://', '').replace(':443', '');
            auth.token  = response.access_token;
            auth.userId = parseInt(response.userid, 10);
            auth.expire = new Date(response.expires_in).getTime();
            controller.config.auth = auth;

            cache = fs.createWriteStream(__dirname + '/../cache/nestAuth.json');
            cache.once('open', function() {
              console.log('\x1b[35m' + controller.config.title + '\x1b[0m: Auth data cached with URL');

              that.deviceList(controller.config);

              cache.write(JSON.stringify(auth));
            });
          }
        }
      };

      this.send(config);
    },

    /**
     * Once we get the API response from Nest, we'll parse through it and grab
     * just the parts we care about.
     */
    deviceList : function (config) {
      var that     = this,
          callback = config.callback || function() {};

      console.log('\x1b[35m' + config.title + '\x1b[0m: Fetching device info');

      delete config.list;
      config.host     = config.auth.url;
      config.path     = '/v2/mobile/user.' + config.auth.userId;
      config.method   = 'GET';
      config.device   = { auth : config.auth, deviceId : config.deviceId };

      config.callback = function(err, response) {
        var deviceState = require(__dirname + '/../lib/deviceState'),
            nest        = { devices : {} },
            i;

        if(response) {
          for(i in response.structure) {
            nest.structure = i;
            nest.presence  = response.structure[i].away === false ? 'on' : 'off';
            break;
          }

          // "topaz" contains only smoke detectors.
          for(i in response.topaz) {
            nest.devices[response.topaz[i].serial_number]         = {};
            nest.devices[response.topaz[i].serial_number].serial  = response.topaz[i].serial_number;
            nest.devices[response.topaz[i].serial_number].smoke   = response.topaz[i].smoke_status         === 0 ? 'ok' : 'err';
            nest.devices[response.topaz[i].serial_number].co      = response.topaz[i].co_status            === 0 ? 'ok' : 'err';
            nest.devices[response.topaz[i].serial_number].battery = response.topaz[i].battery_health_state === 0 ? 'ok' : 'err';
            nest.devices[response.topaz[i].serial_number].label   = that.findLabel(response.topaz[i].where_id, config.language);
            nest.devices[response.topaz[i].serial_number].type    = 'protect';
          }

          // "device" contains only thermostats.
          for(i in response.device) {
            nest.devices[response.device[i].serial_number]              = {};
            nest.devices[response.device[i].serial_number].serial       = response.device[i].serial_number;
            nest.devices[response.device[i].serial_number].state        = response.shared[response.device[i].serial_number].target_temperature_type;
            nest.devices[response.device[i].serial_number].active       = response.shared[response.device[i].serial_number].hvac_heater_state ? 'heat' : response.shared[response.device[i].serial_number].hvac_ac_state ? 'cool' : 'off';
            nest.devices[response.device[i].serial_number].fanMode      = response.device[i].fan_mode;
            nest.devices[response.device[i].serial_number].humidity     = response.device[i].current_humidity;
            nest.devices[response.device[i].serial_number].temp         = that.cToF(response.shared[response.device[i].serial_number].current_temperature);
            nest.devices[response.device[i].serial_number].target       = that.cToF(response.shared[response.device[i].serial_number].target_temperature);
            nest.devices[response.device[i].serial_number].timeToTarget = response.device[i].time_to_target;
            nest.devices[response.device[i].serial_number].leaf         = response.device[i].leaf;
            nest.devices[response.device[i].serial_number].label        = that.findLabel(response.device[i].where_id);
            nest.devices[response.device[i].serial_number].type         = 'thermostat';
          }

          callback(null, nest);
        }

        else {
          callback(err);
        }
      };

      this.send(config);
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

        // Thermostat is the only interactive type, so we'll assume that's what
        // you're looking for.
        if((subDevice.label === subDeviceLabel) && (subDevice.type === 'thermostat')) {
          collected[j] = subDevice;

          j += 1;
        }
      }

      return collected;
    },

    /**
     * When a Nest command is issued to SwitchBoard, we'll determine what it is
     * and how to act.  Some commands (presence and fan mode) are device
     * agnostic while other commands (temperature setting, heating, cooling) are
     * specific to one thermostat.
     */
    getDevicePath : function (config) {
      var deviceState = require(__dirname + '/../lib/deviceState'),
          nestState   = deviceState.getDeviceState(config.deviceId),
          subDevices  = {},
          commandType = '',
          i           = 1,
          value       = '',
          command     = config.command,
          subdevice   = config.subdevice;

      // We can only send commands to thermostats.
      if((nestState.value) && (nestState.value.devices)) {
        subDevices = JSON.parse(JSON.stringify(nestState.value.devices));
      }

      if(command === 'HOME') {
        config.host = config.auth.url;
        config.path = '/v2/put/structure.' + subDevices.structure;
        config.args = { away : false, away_timestamp : new Date().getTime(), away_setter : 0 };
      }

      if(command === 'AWAY') {
        config.host = config.auth.url;
        config.path = '/v2/put/structure.' + subDevices.structure;
        config.args = { away : true, away_timestamp : new Date().getTime(), away_setter : 0 };
      }

      else if(command === 'FAN_ON') {
        config.host = config.auth.url;
        config.path = '/v2/put/structure.' + subDevices.structure;
        config.args = { fan_mode : 'on' };
      }

      else if(command === 'FAN_AUTO') {
        config.host = config.auth.url;
        config.path = '/v2/put/structure.' + subDevices.structure;
        config.args = { fan_mode : 'auto' };
      }

      else if(subdevice.indexOf('mode-') === 0) {
        commandType = 'mode';
      }

      else if(subdevice.indexOf('temp-') === 0) {
        commandType = 'temp';
      }

      if(commandType) {
        config.host = config.auth.url;

        command     = subdevice.replace(commandType + '-', '');

        value       = command.split('-');
        command     = value[0];
        value       = value[1];
        subdevice   = this.findSubDevices(command, subDevices);

        if((subdevice) && (subdevice[0].type === 'thermostat')) {
          switch(commandType) {
            case 'mode' :
              if((value === 'off') || (value === 'heat') || (value === 'cool')) {
                config.path = '/v2/put/shared.' + subdevice[0].serial;
                config.args = { target_change_pending : true, target_temperature_type : value };
              }
            break;

            case 'temp' :
              if(!isNaN(value)) {
                if((value >= 50) && (value <= 100)) {
                  config.path = '/v2/put/shared.' + subdevice[0].serial;
                  config.args = { target_change_pending : true, target_temperature : this.fToC(value) };
                }
              }
            break;
          }
        }
      }

      return config;
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     *
     * If you don't have registered auth information, we can check for that now.
     */
    init : function (controller, config) {
      var fs      = require('fs'),
          that    = this,
          auth    = {},
          groups  = config.groups || {},
          now     = new Date().getTime(),
          expired = true;

      if(typeof controller.config.username !== 'undefined' && controller.config.password !== 'undefined') {
        fs.exists(__dirname + '/../cache/nestAuth.json', function(fileExists) {
          // If we have a presumed good auth token, we can populate the device list.
          if(fileExists) {
            fs.readFile(__dirname + '/../cache/nestAuth.json', function(err, auth) {
              var runCommand  = require(__dirname + '/../lib/runCommand');

              if(auth.toString()) {
                controller.config.auth = JSON.parse(auth.toString());

                if((controller.config.auth.expire) && (controller.config.auth.expire > now)) {
                  expired = false;

                  if(typeof controller.config.auth.url === 'string') {
                    runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
                  }
                }

                else {
                  that.getAuth({ device : { deviceId : controller.config.deviceId, username : controller.config.username, password : controller.config.password } }, controller);
                }
              }

              else {
                console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Auth cache is empty');
              }
            });
          }

          // Otherwise, we need to retrieve the auth token.
          else {
            that.getAuth({ device : { deviceId : controller.config.deviceId, username : controller.config.username, password : controller.config.password } }, controller);
          }
        });
      }

      return controller;
    },

    send : function (config) {
      var https       = require('https'),
          fs          = require('fs'),
          nest        = {},
          that        = this,
          postRequest = '',
          dataReply   = '',
          request;

      nest.deviceId  = config.device.deviceId || '';
      nest.title     = config.device.title    || '';
      nest.command   = config.command         || '';
      nest.subdevice = config.subdevice       || '';
      nest.list      = config.list            || '';
      nest.host      = config.host            || 'home.nest.com';
      nest.path      = config.path            || '/user/login';
      nest.port      = config.port            || 443;
      nest.method    = config.method          || 'POST';
      nest.callback  = config.callback        || function () {};
      nest.username  = config.device.username || '';
      nest.password  = config.device.password || '';
      nest.auth      = config.device.auth     || {};
      nest.language  = config.language        || 'en';

      if((nest.command) || (nest.subdevice)) {
        nest = this.getDevicePath(nest);
      }

      if(nest.method === 'POST') {
        nest.postRequest = this.postData(nest);
      }

      if(nest.list) {
        this.deviceList(nest);
      }

      else {
        request = https.request(this.postPrepare(nest), function(response) {
          response.on('data', function(response) {
            dataReply += response;
          });

          response.once('end', function() {
            var deviceState = require(__dirname + '/../lib/deviceState'),
                nestData    = {};

            if(dataReply.indexOf('<html>redirect to') === 0) {
              nest.callback('API redirected');
            }

            else if(dataReply) {
              nestData = JSON.parse(dataReply);

              if(nestData.cmd === 'REINIT_STATE') {
                fs.exists('cache/nestAuth.json', function(exists) {
                  if(exists) {
                    fs.unlink('cache/nestAuth.json', function(err) {
                      if(err) {
                        nest.callback('Failed to remove expired auth');
                      }

                      else {
                        nest.callback('Expired auth removed');
                      }
                    });
                  }
                });
              }

              else {
                nest.callback(null, nestData);
              }
            }

            else {
              console.log('\x1b[31m' + config.device.title + '\x1b[0m: No data returned from API');

              nest.callback(null, '');
            }
          });
        });

        request.once('error', function(err) {
          nest.callback(err);
        });

        if(nest.method === 'POST') {
          request.write(nest.postRequest);
        }

        request.end();
      }
    }
  };
}());
