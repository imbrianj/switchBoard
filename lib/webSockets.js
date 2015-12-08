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
 * @fileoverview Manage Web Socket connections.
 */

module.exports = (function () {
  'use strict';

  var Connections = [];

  return {
    version : 20151207,

    /**
     * Send an object to WebSocket clients.  This can include state changes or
     * desktop notifications.
     *
     * See lib/deviceState.js and lib/notify.js
     */
    send : function (message) {
      var i = '';

      if(typeof message !== 'string') {
        message = JSON.stringify(message);
      }

      for(i in Connections) {
        Connections[i].sendUTF(message);
      }
    },

    /**
     * Return the number of current WebSocket Connections.
     */
    connectionCount : function () {
      return Connections.length;
    },

    /**
     * Handles all WebSocket connections.
     */
    newConnection : function (request, controllers) {
      var requestInit = require(__dirname + '/requestInit'),
          loadMarkup  = require(__dirname + '/loadMarkup'),
          deviceState = require(__dirname + '/deviceState'),
          connection  = request.accept('echo-protocol', request.origin),
          allStates   = deviceState.getDeviceState();

      console.log('\x1b[36m' + connection.remoteAddress + ' WebSocket connected\x1b[0m');

      Connections.push(connection);

      connection.sendUTF(JSON.stringify(loadMarkup.loadTemplates(controllers)));

      if(controllers.config.appCaching === true) {
        connection.sendUTF(JSON.stringify(allStates));
      }

      connection.on('message', function (message) {
        var response  = { end : function (message) {} },
            allStates = deviceState.getDeviceState();

        if(message.utf8Data === 'fetch state') {
          console.log('\x1b[36m' + connection.remoteAddress + ' Requested State\x1b[0m');

          connection.sendUTF(JSON.stringify(allStates));
        }

        else {
          request.url = message.utf8Data;
          request.connection = { remoteAddress : request.remoteAddress };

          requestInit.requestInit(request, controllers, response);
        }
      });

      connection.on('close', function (code, desc) {
        var i = 0;

        console.log('\x1b[36m' + connection.remoteAddress + ' WebSocket disconnected\x1b[0m');

        for(i; i < Connections.length; i += 1) {
          if(Connections[i] === connection) {
            Connections.splice(i, 1);
            break;
          }
        }

        connection.close();
      });
    }
  };
}());
