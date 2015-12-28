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

/**
 * @author brian@bevey.org
 * @fileoverview When a presence sensor is triggered - and a contact sensor is
 *               then triggered within a given interval, turn on a given
 *               subdevice or run a given macro.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20151227,

    lastEvents : { presence : 0, open : 0 },

    hallLightHome : function (device, command, controllers, values, config) {
      var that        = this,
          deviceState = require(__dirname + '/../lib/deviceState'),
          runCommand  = require(__dirname + '/../lib/runCommand'),
          now         = new Date().getTime(),
          delay       = (config.delay || 10) * 1000,
          rawMacro    = (config.macro || '').split(';'),
          macro,
          currentDeviceState,
          deviceId,
          subdevice,
          state,
          isIn        = function (command, collection, prefix) {
            var found = false,
                current;

            for(current in collection) {
              if(command = prefix + collection[current] + '-on') {
                found = true;
                break;
              }
            }

            return found;
          };

      if(isIn(command, config.presence, 'subdevice-state-presence-')) {
        this.lastEvents.presence = now;
      }

      else if(isIn(command, config.contact, 'subdevice-state-contact-')) {
        this.lastEvents.open = now;
      }

      if((now < delay + this.lastEvents.presence) && (now < delay + this.lastEvents.open)) {
        if(config.macro) {
          for(macro in rawMacro) {
            runCommand.macroCommands(rawMacro[macro]);
          }
        }

        for(deviceId in controllers) {
          state = deviceState.getDeviceState(deviceId);

          if(controllers[deviceId].config) {
            switch(controllers[deviceId].config.typeClass) {
              case 'smartthings'     :
              case 'wemo'            :
              case 'raspberryRemote' :
                currentDeviceState = deviceState.getDeviceState(deviceId);
              break;
            }

            if((currentDeviceState.value) && (currentDeviceState.value.devices)) {
              for(subdevice in currentDeviceState.value.devices) {
                if(config.action.indexOf(currentDeviceState.value.devices[subdevice].label) !== -1) {
                  runCommand.runCommand(deviceId, 'subdevice-on-' + config.action);
                }
              }
            }
          }
        }
      }
    }
  };
}());
