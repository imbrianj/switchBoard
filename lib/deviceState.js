/*jslint white: true */
/*global State, Connections, module, require, console */

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

  return {
    version : 20140622,

    sendState : function(deviceState) {
      var i = '';

      for(i in Connections) {
        Connections[i].sendUTF(JSON.stringify(deviceState));
      }
    },

    getDeviceState : function(deviceId) {
      return State[deviceId];
    },

    updateState : function(deviceId, typeClass, config) {
      var date = new Date(),
          time = date.getTime();

      if(deviceId) {
        if(typeof State[deviceId] !== 'object') {
          State[deviceId] = { deviceId : deviceId, typeClass : typeClass, state : {} };
        }

        config.state = config.state || 'err';
        config.value = config.value || State[deviceId].value || null;

        if((JSON.stringify(State[deviceId].state) !== JSON.stringify(config.state)) || (JSON.stringify(State[deviceId].value) !== JSON.stringify(config.value))) {
          State[deviceId].state = config.state;
          State[deviceId].value = config.value;

          this.sendState(State[deviceId]);
        }

        State[deviceId].updated = time;
      }
    }
  };
}());
