/* global Buffer */

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
   * @requires http, fs, request
   * @fileoverview Basic control of Hunter Douglas PowerView blinds.
   * @note Thanks to the endpoint discovery discussed here:
   *       http://forum.universal-devices.com/topic/16538-hunter-douglas-powerView-control-with-isy/
   */
  return {
    version : 20161118,

    inputs  : ['command', 'list', 'subdevice', 'text'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { blinds : fs.readFileSync(__dirname + '/fragments/blinds.tpl', 'utf-8'),
               blind  : fs.readFileSync(__dirname + '/fragments/blind.tpl',  'utf-8'),
               scenes : fs.readFileSync(__dirname + '/fragments/scenes.tpl', 'utf-8'),
               scene  : fs.readFileSync(__dirname + '/fragments/scene.tpl',  'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      var request = {
                      host : config.deviceIp,
                      port : config.devicePort
                    };

      if ((config.blindId) && (config.percentage)) {
        request.path   = '/api/shades/' + config.blindId;
        request.method = 'PUT';
      }

      else {
        request.path   = '/api/shades?';
        request.method = 'GET';
      }

      return request;
    },

    /**
     * Prepare the PUT data to be sent.
     */
    putData : function (powerView) {
      var data;

      if ((powerView.blindId) && (powerView.percentage)) {
        data = JSON.stringify({ shade  : { positions : { position1 : this.percentToValue(powerView.percentage), posKind1: 1 }}});
      }

      return data;
    },

    /**
     * Convert unsigned short scaled value used by the API to percentage
     * opened.
     */
    valueToPercent : function (value) {
      var percentage = null;

      if (!isNaN(value)) {
        percentage = Math.max(0, Math.min(100, Math.round((value * 100) / 65535)));
      }

      return percentage;
    },

    /**
     * Convert percentage opening to max unsigned short scaled value required by
     * the API.
     */
    percentToValue : function (percent) {
      var value = null;

      if (!isNaN(percent)) {
        value = Math.min(65535, Math.max(0, Math.round((65535 * percent) / 100)));
      }

      return value;
    },

    /**
     * Accept a text command, parse it out to find the correct subdevice(s) and
     * desired opening value.
     */
    findCommandValues : function (conf) {
      var deviceState    = require(__dirname + '/../../lib/deviceState'),
          powerViewState = deviceState.getDeviceState(conf.deviceId),
          pieces         = conf.subdevice.split('-'),
          scenes         = conf.scenes,
          scene          = conf.text,
          values         = [],
          item           = pieces[0],
          action         = pieces[1],
          i              = 0,
          j,
          findDevice     = function (devices, item, action) {
                             var values = [],
                                 i;

                             for (i in devices) {
                               if (devices[i].label === item) {
                                 values.push({ blindId    : devices[i].id,
                                               percentage : action,
                                               label      : devices[i].label });
                               }
                             }

                             return values;
                           };

      if ((item) && (action) && (!isNaN(action) && (action <= 100) && (action >= 0))) {
        if ((powerViewState) && (powerViewState.value) && (powerViewState.value.devices)) {
          values = findDevice(powerViewState.value.devices, item, action);
        }
      }

      else if ((scene) && (scenes) && (scenes.length > 0)) {
        // Go through the array of scenes
        for (i; i < scenes.length; i += 1) {
          if (scenes[i][scene]) {
            // If this is the scene we want, it'll have child devices.  Go
            // through each.
            for (j in scenes[i][scene].devices) {
              // We want to make sure they're not null - but can be 0.
              if ((scenes[i][scene].devices.hasOwnProperty(j)) && (!isNaN(scenes[i][scene].devices[j]))) {
                // Create an array of commands that we can execute on.
                values = values.concat(findDevice(powerViewState.value.devices, j, scenes[i][scene].devices[j]));
              }
            }
          }
        }
      }

      return values;
    },

    /**
     * Accept a sanitized blinds array and array of ordering.  Returns an array
     * of objects in that order.
     */
    sortBlinds : function (blinds, order) {
      var sorted = [],
        i        = 0,
        j        = 0;

      if (order) {
        for (i; i < order.length; i += 1) {
          j = 0;

          for (j; j < blinds.length; j += 1) {
            if (blinds[j].label === order[i]) {
              sorted.push(blinds[j]);

              break;
            }
          }
        }
      }

      else {
        sorted = blinds;
      }

      return sorted;
    },

    /**
     * Accept an ID of a specific blind.  Returns the currently stored state
     * values for that blind.
     */
    findBlindState : function (id, deviceId) {
      var deviceState    = require(__dirname + '/../../lib/deviceState'),
          powerViewState = deviceState.getDeviceState(deviceId),
          device         = {},
          i;

      if ((powerViewState.value) && (powerViewState.value.devices)) {
        for (i; i < powerViewState.value.devices; i += 1) {
          if (powerViewState.value.devices[i].id === id) {
            device = powerViewState.value.devices[i];
            break;
          }
        }
      }

      return device;
    },

    /**
     * After a blind has changed position, we'll explicitily update state to
     * immediately know where it now sits.
     */
    updateBlind : function (deviceId, blindId, percentage) {
      var deviceState    = require(__dirname + '/../../lib/deviceState'),
          powerViewState = deviceState.getDeviceState(deviceId),
          devices,
          i              = 0;

      if ((powerViewState.value) && (powerViewState.value.devices)) {
        devices = powerViewState.value.devices;

        for (i; i < devices.length; i += 1) {
          if (devices[i].id === blindId) {
            devices[i].percentage = percentage;
            break;
          }
        }
      }

      return devices;
    },

    /**
     * Take in any blinds API data and embellish it with stored percentage
     * values, then return the array in a format we desire.
     */
    findBlinds : function (rawBlinds, deviceId, order) {
      var devices = [],
          device,
          i;

      for (i in rawBlinds.shadeData) {
        if ((rawBlinds.shadeData[i]) && (rawBlinds.shadeData[i].id)) {
          device = this.findBlindState(rawBlinds.shadeData[i].id, deviceId);

          devices.push({
            id         : rawBlinds.shadeData[i].id,
            label      : new Buffer.from(rawBlinds.shadeData[i].name, 'base64').toString(),
            battery    : rawBlinds.shadeData[i].batteryStrength,
            // The API does not appear reliable in offering percentage
            // information, so we'll prioritize our own stored value first.
            percentage : device.percentage || rawBlinds.shadeData[i].positions ? this.valueToPercent(rawBlinds.shadeData[i].positions.position1) : 0
          });
        }
      }

      devices = this.sortBlinds(devices, order);

      return devices;
    },

    /**
     * Accept a device configuration and return an array of available scene
     * names.
     *
     * NOTE: These are NOT PowerView scenes, but rather faux scenes used only
     *       within SwitchBoard.
     */
    findScenes : function (rawScenes) {
      var scenes = [],
          i      = 0,
          j;

      for (i; i < rawScenes.length; i += 1) {
        for (j in rawScenes[i]) {
          if (rawScenes[i][j]) {
            scenes.push({ name : j, icon : rawScenes[i][j].icon });
          }
        }
      }

      return scenes;
    },

    /**
     * Query for current device list.
     */
    deviceList : function (config) {
      var callback = config.callback;

      console.log('\x1b[35m' + config.title + '\x1b[0m: Fetching device info');

      delete config.list;

      config.deviceId = config.deviceId;
      config.deviceIp = config.deviceIp;
      config.path     = 'api/shades?';
      config.config   = { localTimeout : config.timeout };
      config.device   = {
        deviceId   : config.deviceId,
        deviceIp   : config.deviceIp,
        devicePort : config.devicePort,
        order      : config.order,
        scenes     : config.scenes
      };

      config.callback = function (err, response) {
        if (response) {
          callback(null, response);
        }

        else {
          callback(err);
        }
      };

      this.send(config);
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    send : function (config) {
      var http       = require('http'),
          runCommand = require(__dirname + '/../../lib/runCommand'),
          that       = this,
          powerView  = {},
          dataReply  = '',
          scenes,
          commands,
          request,
          i          = 0,
          j          = 1;

      powerView.deviceId   = config.device.deviceId;
      powerView.title      = config.device.title        || '';
      powerView.deviceIp   = config.device.deviceIp;
      powerView.timeout    = config.device.localTimeout || config.config.localTimeout;
      powerView.subdevice  = config.subdevice           || '';
      powerView.text       = config.text                || '';
      powerView.list       = config.list                || '';
      powerView.devicePort = config.device.devicePort   || 80;
      powerView.callback   = config.callback            || function () {};
      powerView.order      = config.device.order;
      powerView.scenes     = config.device.scenes;

      if (powerView.subdevice) {
        commands = this.findCommandValues(powerView);

        if (commands.length === 1) {
          powerView.percentage = commands[0].percentage;
          powerView.blindId    = commands[0].blindId;
          powerView.putRequest = this.putData(powerView);
        }

        else if (commands.length > 1) {
          for (j; j < commands.length; j += 1) {
            runCommand.runCommand(powerView.deviceId, 'subdevice-' + commands[j].label + '-' + commands[j].percentage, powerView.deviceId);
          }
        }
      }

      if (powerView.list) {
        this.deviceList(powerView);
      }

      else if (powerView.text) {
        commands = this.findCommandValues(powerView);

        for (i; i < commands.length; i += 1) {
          runCommand.runCommand(powerView.deviceId, 'subdevice-' + commands[i].label + '-' + commands[i].percentage, powerView.deviceId);
        }
      }

      else {
        request = http.request(this.postPrepare(powerView), function (response) {
          response.on('data', function (response) {
            dataReply += response;
          });

          response.once('end', function () {
            var blinds;

            if (dataReply) {
              try {
                blinds = JSON.parse(dataReply);
              }

              catch (e) {
                powerView.callback('Failed to parse JSON');
              }

              if ((blinds) && (blinds.shadeData)) {
                dataReply = that.findBlinds(blinds, powerView.deviceId, powerView.order);
                scenes    = that.findScenes(powerView.scenes);

                powerView.callback(null, { devices : dataReply, scenes : scenes });
              }

              else if ((blinds) && (blinds.shade) && (blinds.shade.positions)) {
                dataReply = that.updateBlind(powerView.deviceId, powerView.blindId, that.valueToPercent(blinds.shade.positions.position1));
                scenes    = that.findScenes(powerView.scenes);

                powerView.callback(null, { devices : dataReply, scenes : scenes });
              }
            }
          });
        });

        request.setTimeout(powerView.timeout, function () {
          request.destroy();
          powerView.callback({ code : 'ETIMEDOUT' }, null, true);
        });

        request.once('error', function (err) {
          if (err.code !== 'ETIMEDOUT') {
            powerView.callback(err, null, true);
          }
        });

        request.end(powerView.putRequest);
      }
    }
  };
}());
