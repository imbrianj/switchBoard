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
    version : 20140816,

    poll : function(deviceId, command, controllers) {
      var runCommand  = require(__dirname + '/../lib/runCommand'),
          deviceState = require(__dirname + '/../lib/deviceState'),
          notify,
          controller  = controllers[deviceId],
          speech,
          callback;

      if(controllers[deviceId].controller.stocksOpen({ device : { deviceId : deviceId, title : controllers[deviceId].config.title } })) {
        callback = function(err, stocks) {
          var message = '',
              i       = 0,
              stockName;

          deviceState.updateState(deviceId, 'stocks', { state : 'ok', value : stocks });

          if((controller.config.limits) && (stocks)) {
            for(stockName in controller.config.limits) {
              if((typeof controller.config.limits[stockName].sell !== 'undefined') && (stocks[stockName]) && (stocks[stockName].price >= controller.config.limits[stockName].sell)) {
                message = message + 'Your ' + stocks[stockName].name + ' stock is doing well at ' + stocks[stockName].ask + '.  Think about selling?  ';
              }

              else if((typeof controller.config.limits[stockName].buy !== 'undefined') && (stocks[stockName]) && (stocks[stockName].price <= controller.config.limits[stockName].buy)) {
                message = message + 'Your ' + stocks[stockName].name + ' stock is low at ' + stocks[stockName].ask + '.  Think about buying?  ';
              }

              else if(stocks[stockName]){
                console.log('\x1b[35mSchedule\x1b[0m: ' + stocks[stockName].name + ' is at ' + stocks[stockName].price + ' - within range');
              }

              else {
                console.log('\x1b[31mSchedule\x1b[0m: Failed to fetch valid stock data');
              }
            }
          }

          if(message) {
            console.log('\x1b[35mSchedule\x1b[0m: ' + message);

            notify = require(__dirname + '/../lib/notify');

            notify.sendNotification(null, message, deviceId);

            for(i; i < controller.config.notify.length; i += 1) {
              if(typeof controllers[controller.config.notify[i]] !== 'undefined') {
                if(controllers[controller.config.notify[i]].config.typeClass === 'mp3') {
                  runCommand.runCommand(controller.config.notify[i], 'text-cash', 'single', false);
                }

                else {
                  runCommand.runCommand(controller.config.notify[i], 'text-' + message, 'single', false);
                }
              }
            }
          }
        };

        runCommand.runCommand(deviceId, 'list', deviceId, false, callback);
      }
    }
  };
}());
