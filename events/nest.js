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

/**
 * @author brian@bevey.org
 * @fileoverview Simple script to fire for each scheduled interval.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140826,

    /**
     * If the API states that a Nest Protect smoke detector has gone off in any
     * way (smoke, co or battery), we should raise the alarm via Desktop
     * Notifications as well as any notification means defined in the config.
     */
    checkProtect : function(device, controllers) {
      return function(err, reply) {
        var runCommand  = require(__dirname + '/../lib/runCommand'),
            deviceState = require(__dirname + '/../lib/deviceState'),
            notify      = require(__dirname + '/../lib/notify'),
            controller  = controllers[device],
            state       = 'err',
            message     = '',
            params      = {},
            i           = 0,
            deviceId,
            subDevice;

        if(reply) {
          state = 'ok';

          if(reply.protect) {
            for(deviceId in controllers) {
              if((deviceId !== 'config') && (controllers[deviceId].config.typeClass === 'speech')) {
                break;
              }
            }

            for(subDevice in reply.protect) {
              if(reply.protect[subDevice].smoke !== 'ok') {
                message = message + ' ' + reply.protect[subDevice].label + ' smoke detected!';
                notify.sendNotification(null, reply.protect[subDevice].label + ' smoke detected!', device);
              }

              if(reply.protect[subDevice].co !== 'ok') {
                message = message + ' ' + reply.protect[subDevice].label + ' CO detected!';
                notify.sendNotification(null, reply.protect[subDevice].label + ' CO detected!', device);
              }
            }

            if((message) && (controller.config.notify)) {
              console.log('\x1b[35mSchedule\x1b[0m: ' + message);

              for(i; i < controller.config.notify.length; i += 1) {
                if(typeof controllers[controller.config.notify[i]] !== 'undefined') {
                  runCommand.runCommand(controller.config.notify[i], 'text-' + message, 'single', false);
                }
              }
            }
          }
        }

        params.state = state;
        params.value = reply;

        deviceState.updateState(deviceId, controller.config.typeClass, params);
      };
    },

    /**
     * Everytime you make a change to your Nest device, we'll wait a short time
     * for the change to be registered on the remote API - then poll for the
     * current state instead of waiting for the next scheduled poll.
     */
    fire : function(device, command, controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          controller = controllers[device],
          callback   = this.checkProtect(device, controllers);

      if(command !== 'LIST') {
        // We want to grab the state from the source of truth (the actual
        // API), but we need to wait a short time for it to register.
        setTimeout(function() {
            runCommand.runCommand(device, 'list', device, false, callback);
        }, 1000);
      }
    },

    /**
     * When we poll the Nest API, we want to include the callback to properly
     * register device states and send notifications when applicable.
     */
    poll : function(deviceId, command, controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          controller = controllers[deviceId],
          callback   = this.checkProtect(deviceId, controllers);

      if(controller.config.auth) {
        runCommand.runCommand(deviceId, 'list', deviceId, false, callback);
      }
    }
  };
}());
