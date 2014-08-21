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
 * @fileoverview Manage Web Socket connections.
 */

module.exports = (function () {
  'use strict';

  var Connections = [];

  return {
    version : 20140820,

    send : function (message) {
      var i = '';

      if(typeof message !== 'string') {
        message = JSON.stringify(message);
      }

      for(i in Connections) {
        Connections[i].sendUTF(message);
      }
    },

    newConnection : function (request, controllers) {
      var requestInit = require(__dirname + '/requestInit'),
          loadMarkup  = require(__dirname + '/loadMarkup'),
          connection  = request.accept('echo-protocol', request.origin);

      console.log('\x1b[36m' + connection.remoteAddress + ' WebSocket connected\x1b[0m');

      Connections.push(connection);

      connection.sendUTF(JSON.stringify(loadMarkup.loadTemplates(controllers)));

      connection.on('message', function(message) {
        var response = { end : function(message) {} };

        if(message.utf8Data === 'fetch state') {
          console.log('\x1b[36m' + connection.remoteAddress + ' Requested State\x1b[0m');

          connection.sendUTF(JSON.stringify(State));
        }

        else {
          request.url = message.utf8Data;

          requestInit.requestInit(request, controllers, response);
        }
      });

      connection.on('close', function(code, desc) {
        var i = 0;

        console.log('\x1b[36m' + connection.remoteAddress + ' WebSocket disconnected\x1b[0m');

        connection.close();

        for(i; i < Connections.length; i += 1) {
          if(Connections[i] === connection) {
            Connections.splice(i, 1);
            break;
          }
        }
      });
    }
  };
}());
