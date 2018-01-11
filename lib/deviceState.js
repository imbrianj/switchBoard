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
 * @fileoverview Manage device state for clients.
 */

module.exports = (function () {
  'use strict';

  var State = {};

  return {
    version : 20161123,

    /**
     * Simple getter for device state.
     */
    getDeviceState : function (deviceId) {
      var state = deviceId ? State[deviceId] : State;

      if (state) {
        state = JSON.parse(JSON.stringify(state));
      }

      return state;
    },

    findDeviceOnTime : function (deviceId, newState, oldState) {
      var now = new Date().getTime(),
          i   = 0,
          device;

      if (oldState.state !== newState.state) {
        if (newState.state === 'ok') {
          State[deviceId].lastOn  = now;
          State[deviceId].lastOff = null;
        }

        else if (newState.state === 'err') {
          if (State[deviceId].lastOn) {
            State[deviceId].duration = State[deviceId].duration || 0;
            State[deviceId].duration += (now - State[deviceId].lastOn);
          }

          State[deviceId].lastOn  = null;
          State[deviceId].lastOff = now;
        }
      }

      if ((newState.value) && (newState.value.devices) && (oldState.value) && (oldState.value.devices)) {
        for (i; i < newState.value.devices.length; i += 1) {
          device = newState.value.devices[i];

          if ((oldState.value.devices[i]) && (oldState.value.devices[i].state !== device.state)) {
            if (device.state === 'on') {
              State[deviceId].value.devices[i].lastOn  = now;
              State[deviceId].value.devices[i].lastOff = null;
            }

            else if (device.state === 'off') {
              if (State[deviceId].value.devices[i].lastOn) {
                State[deviceId].value.devices[i].duration = State[deviceId].value.devices[i].duration || 0;
                State[deviceId].value.devices[i].duration += (now - State[deviceId].value.devices[i].lastOn);
              }

              State[deviceId].value.devices[i].lastOff = now;
              State[deviceId].value.devices[i].lastOn  = null;
            }
          }
        }
      }
    },

    /**
     * When we take in a State change, we'll want to make sure it has all the
     * expected values.
     *
     * Once we have a State change - ensure it's an actual change and not just
     * a re-affirming of an existing state - and send it to webSockets to be
     * broadcast to all clients.  Add a timestamp for the last state change.
     */
    updateState : function (deviceId, typeClass, config) {
      var webSockets = require(__dirname + '/webSockets'),
          now        = new Date().getTime(),
          oldState;

      if (deviceId) {
        if (typeof State[deviceId] !== 'object') {
          State[deviceId] = { deviceId : deviceId, typeClass : typeClass, state : {} };
        }

        config.state = config.state || 'err';
        config.value = config.value || State[deviceId].value || null;

        if ((JSON.stringify(State[deviceId].state) !== JSON.stringify(config.state)) || (JSON.stringify(State[deviceId].value) !== JSON.stringify(config.value))) {
          oldState = JSON.parse(JSON.stringify(State[deviceId]));

          State[deviceId].state   = config.state;
          State[deviceId].value   = config.value;
          State[deviceId].updated = now;

          this.findDeviceOnTime(deviceId, config, oldState);

          webSockets.send(State[deviceId]);
        }
      }
    }
  };
}());
