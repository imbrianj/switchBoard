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
    version : 20180307,

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

      return { group      : fs.readFileSync(__dirname + '/fragments/nestGroups.tpl',     'utf-8'),
               thermostat : fs.readFileSync(__dirname + '/fragments/nestThermostat.tpl', 'utf-8'),
               protect    : fs.readFileSync(__dirname + '/fragments/nestProtect.tpl',    'utf-8') };
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

      if ((config.auth) && (config.auth.userId) && (config.auth.token)) {
        request.headers['X-nl-protocol-version'] = 1;
        request.headers['X-nl-user-id']          = config.auth.userId;
        request.headers.Authorization            = 'Basic ' + config.auth.token;
      }

      if (config.postRequest) {
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

      if (nest.args) {
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
      var translate = require(__dirname + '/../../lib/translate'),
          key       = id ? id.replace('00000000-0000-0000-0000-0001000000', '') : 'xx',
          keymap    = { '01' : 'BASEMENT',
                        '0d' : 'BEDROOM',
                        '03' : 'DEN',
                        '10' : 'DINING_ROOM',
                        '06' : 'DOWNSTAIRS',
                        '00' : 'ENTRYWAY',
                        '0b' : 'FAMILY_ROOM',
                        '02' : 'HALLWAY',
                        '08' : 'KIDS_ROOM',
                        '0a' : 'KITCHEN',
                        '0c' : 'LIVING_ROOM',
                        'xx' : 'MAIN',
                        '05' : 'MASTER_BEDROOM',
                        '0e' : 'OFFICE',
                        '0f' : 'UPSTAIRS' };

      return translate.translate('{{i18n_' + keymap[key] + '}}', 'nest', language);
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

        if (!err) {
          if (response.error) {
            console.log('\x1b[31m' + controller.config.title + '\x1b[0m: ' + response.error_description);
          }

          else {
            auth.url    = response.urls.transport_url.replace('https://', '').replace(':443', '');
            auth.token  = response.access_token;
            auth.userId = parseInt(response.userid, 10);
            auth.expire = new Date(response.expires_in).getTime();
            controller.config.auth = auth;

            cache = fs.createWriteStream(__dirname + '/../../cache/nestAuth.json');
            cache.once('open', function () {
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
      var deviceState = require(__dirname + '/../../lib/deviceState'),
          util        = require(__dirname + '/../../lib/sharedUtil').util,
          nestState   = deviceState.getDeviceState(config.deviceId),
          celsius     = config.config ? !!config.config.celsius : false,
          that        = this,
          callback    = config.callback || function () {},
          findByName  = function (find, i) {
                          var found   = {},
                              device  = find[i],
                              devices = ((nestState) && (nestState.value)) ? nestState.value.devices : null,
                              j       = 0;

                          if ((devices) && (devices[i])) {
                            // It's likely that the array structure is the same.
                            // In that case, we can just quickly validate it's the
                            // same and pass that along.
                            if (device.serial === devices[i].serial) {
                              found = devices[i];
                            }

                            // Otherwise, let's search for it.
                            else {
                              for (j; j < devices.length; j += 1) {
                                if (device.serial === devices[j].serial) {
                                  found = devices[j];

                                  break;
                                }
                              }
                            }
                          }

                          return found;
                        },
          sortByTitle = function (a, b) {
                          var labelA,
                              labelB,
                              value  = 0;

                          if ((a.label) && (b.label)) {
                            labelA = a.label.toUpperCase();
                            labelB = b.label.toUpperCase();

                            if (labelA < labelB) {
                              value = -1;
                            }

                            else if (labelA > labelB) {
                              value = 1;
                            }
                          }

                          return value;
                        };

      console.log('\x1b[35m' + config.title + '\x1b[0m: Fetching device info');

      delete config.list;
      config.host     = config.auth.url;
      config.path     = '/v2/mobile/user.' + config.auth.userId;
      config.method   = 'GET';
      config.device   = { auth : config.auth, deviceId : config.deviceId };
      config.config   = { celsius : celsius };

      config.callback = function (err, response) {
        var nest        = { devices : [] },
            protects    = [],
            thermostats = [],
            matched,
            i;

        if (response) {
          for (i in response.structure) {
            if (response.structure.hasOwnProperty(i)) {
              nest.structure = i;
              nest.presence  = response.structure[i].away === false ? 'on' : 'off';
              break;
            }
          }

          // "topaz" contains only smoke detectors.
          for (i in response.topaz) {
            if ((response.topaz[i]) && (response.topaz[i].serial_number)) {
              matched = findByName(response.topaz, i);

              protects.push({
                serial   : response.topaz[i].serial_number,
                smoke    : response.topaz[i].smoke_status         === 0 ? 'ok' : 'err',
                co       : response.topaz[i].co_status            === 0 ? 'ok' : 'err',
                battery  : response.topaz[i].battery_health_state === 0 ? 'ok' : 'err',
                label    : that.findLabel(response.topaz[i].where_id, config.language),
                type     : 'protect',
                lastOn   : matched.lastOn,
                lastOff  : matched.lastOff,
                duration : matched.duration,
                readOnly : true
              });
            }
          }

          protects.sort(sortByTitle);

          // "device" contains only thermostats.
          for (i in response.device) {
            if ((response.device[i]) && (response.device[i].serial_number)) {
              matched = findByName(response.device, i);

              thermostats.push({
                serial       : response.device[i].serial_number,
                state        : response.shared[response.device[i].serial_number].target_temperature_type,
                active       : response.shared[response.device[i].serial_number].hvac_heater_state ? 'heat' : response.shared[response.device[i].serial_number].hvac_ac_state ? 'cool' : 'off',
                fanMode      : response.device[i].fan_mode,
                humidity     : response.device[i].current_humidity,
                temp         : celsius ? response.shared[response.device[i].serial_number].current_temperature : util.cToF(response.shared[response.device[i].serial_number].current_temperature),
                target       : celsius ? response.shared[response.device[i].serial_number].target_temperature  : util.cToF(response.shared[response.device[i].serial_number].target_temperature),
                timeToTarget : response.device[i].time_to_target,
                leaf         : response.device[i].leaf,
                label        : that.findLabel(response.device[i].where_id),
                type         : 'thermostat',
                lastOn       : matched.lastOn,
                lastOff      : matched.lastOff,
                duration     : matched.duration,
                celsius      : celsius
              });
            }
          }

          thermostats.sort(sortByTitle);

          nest.devices = protects.concat(thermostats);

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
    findSubdevices : function (subdeviceLabel, subdevices) {
      var subdevice = {},
          collected = [],
          i         = 0;

      for (i in subdevices) {
        if (subdevices.hasOwnProperty(i)) {
          subdevice = subdevices[i];

          // Thermostat is the only interactive type, so we'll assume that's what
          // you're looking for.
          if ((subdevice.label === subdeviceLabel) && (subdevice.type === 'thermostat')) {
            collected.push(subdevice);
          }
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
      var deviceState = require(__dirname + '/../../lib/deviceState'),
          util        = require(__dirname + '/../../lib/sharedUtil').util,
          nestState   = deviceState.getDeviceState(config.deviceId),
          celsius     = !!config.config.celsius,
          subdevices  = {},
          commandType = '',
          valueParts  = [],
          value       = '',
          command     = config.command,
          subdevice   = config.subdevice;

      // We can only send commands to thermostats.
      if ((nestState.value) && (nestState.value.devices)) {
        subdevices = nestState.value.devices;
      }

      if (nestState.value) {
        if (command === 'HOME') {
          config.host = config.auth.url;
          config.path = '/v2/put/structure.' + nestState.value.structure;
          config.args = { away : false, away_timestamp : new Date().getTime(), away_setter : 0 };
        }

        if (command === 'AWAY') {
          config.host = config.auth.url;
          config.path = '/v2/put/structure.' + nestState.value.structure;
          config.args = { away : true, away_timestamp : new Date().getTime(), away_setter : 0 };
        }

        else if (command === 'FAN_ON') {
          config.host = config.auth.url;
          config.path = '/v2/put/structure.' + nestState.value.structure;
          config.args = { fan_mode : 'on' };
        }

        else if (command === 'FAN_AUTO') {
          config.host = config.auth.url;
          config.path = '/v2/put/structure.' + nestState.value.structure;
          config.args = { fan_mode : 'auto' };
        }

        else if (subdevice.indexOf('mode-') === 0) {
          commandType = 'mode';
        }

        else if (subdevice.indexOf('temp-') === 0) {
          commandType = 'temp';
        }
      }

      if (commandType) {
        config.host = config.auth.url;

        command     = subdevice.replace(commandType + '-', '');

        valueParts  = command.split('-');
        command     = valueParts[0];
        value       = valueParts[1];
        subdevice   = this.findSubdevices(command, subdevices);

        if ((subdevice) && (subdevice[0]) && (subdevice[0].type === 'thermostat')) {
          switch (commandType) {
            case 'mode' :
              if ((value === 'off') || (value === 'heat') || (value === 'cool')) {
                config.path = '/v2/put/shared.' + subdevice[0].serial;
                config.args = { target_change_pending : true, target_temperature_type : value };
              }
            break;

            case 'temp' :
              if (!isNaN(value)) {
                if (((celsius ? util.cToF(value) : value) >= 50) && ((celsius ? util.cToF(value) : value) <= 90)) {
                  config.path = '/v2/put/shared.' + subdevice[0].serial;
                  config.args = { target_change_pending : true, target_temperature : celsius ? value : util.fToC(value) };
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
    init : function (controller) {
      var fs      = require('fs'),
          that    = this,
          now     = new Date().getTime(),
          expired = true;

      if (typeof controller.config.username !== 'undefined' && controller.config.password !== 'undefined') {
        fs.readFile(__dirname + '/../../cache/nestAuth.json', 'utf-8', function (err, data) {
          var runCommand  = require(__dirname + '/../../lib/runCommand');

          // We need to retrieve the auth token.
          if (err) {
            that.getAuth({ device : { deviceId : controller.config.deviceId, username : controller.config.username, password : controller.config.password } }, controller);
          }

          // If we have a presumed good auth token, we can populate the device list.
          else if (data) {
            try {
              controller.config.auth = JSON.parse(data);
            }

            catch (catchErr) {
              console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Auth cache could not be read');
            }

            if (controller.config.auth) {
              if ((controller.config.auth.expire) && (controller.config.auth.expire > now)) {
                expired = false;

                if (typeof controller.config.auth.url === 'string') {
                  runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
                }
              }

              else {
                that.getAuth({ device : { deviceId : controller.config.deviceId, username : controller.config.username, password : controller.config.password } }, controller);
              }
            }
          }

          else {
            console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Auth cache is empty.');
          }
        });
      }

      return controller;
    },

    send : function (config) {
      var https       = require('https'),
          fs          = require('fs'),
          nest        = {},
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
      nest.config    = config.config ? { celsius : !!config.config.celsius } : false;

      if ((nest.command) || (nest.subdevice)) {
        nest = this.getDevicePath(nest);
      }

      if (nest.method === 'POST') {
        nest.postRequest = this.postData(nest);
      }

      if (nest.list) {
        this.deviceList(nest);
      }

      else {
        request = https.request(this.postPrepare(nest), function (response) {
          response.on('data', function (response) {
            dataReply += response;
          });

          response.once('end', function () {
            var nestData = null;

            if (dataReply) {
              try {
                nestData = JSON.parse(dataReply);
              }

              catch (catchErr) {
                nest.callback('API returned an unexpected value');
              }

              if (nestData) {
                if (nestData.cmd === 'REINIT_STATE') {
                  fs.unlink(__dirname + '/../../cache/nestAuth.json', function (err) {
                    if (err) {
                      nest.callback('Failed to remove expired auth');
                    }

                    else {
                      nest.callback('Expired auth removed');
                    }
                  });
                }

                else {
                  nest.callback(null, nestData);
                }
              }
            }

            else {
              nest.callback('No data returned from API');
            }
          });
        });

        request.once('error', function (err) {
          nest.callback(err);
        });

        if (nest.method === 'POST') {
          request.write(nest.postRequest);
        }

        request.end();
      }
    }
  };
}());
