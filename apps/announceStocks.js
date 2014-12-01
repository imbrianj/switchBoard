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
 * @fileoverview If stocks fall outside a given bounds, specified in the config,
 *               send that info out via the configure mediums.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20141128,

    announceStocks : function(device, command, controllers, values) {
      var deviceState = require(__dirname + '/../lib/deviceState'),
          translate   = require(__dirname + '/../lib/translate'),
          runCommand  = require(__dirname + '/../lib/runCommand'),
          controller  = controllers[device],
          stockName,
          message,
          notify,
          deviceId;

      deviceState.updateState(device, 'stocks', { state : 'ok', value : values.stocks });

      if((controller.config.limits) && (values.stocks)) {
        for(stockName in controller.config.limits) {
          if((typeof controller.config.limits[stockName].sell !== 'undefined') && (values.stocks[stockName]) && (values.stocks[stockName].price >= controller.config.limits[stockName].sell)) {
            message = message + translate.translate('{{i18n_SELL}}', 'stocks', controllers.config.language).replace('{{LABEL}}', values.stocks[stockName].name).replace('{{PRICE}}', values.stocks[stockName].price) + ' ';
          }

          else if((typeof controller.config.limits[stockName].buy !== 'undefined') && (values.stocks[stockName]) && (values.stocks[stockName].price <= controller.config.limits[stockName].buy)) {
            message = message + translate.translate('{{i18n_BUY}}', 'stocks', controllers.config.language).replace('{{LABEL}}', values.stocks[stockName].name).replace('{{PRICE}}', values.stocks[stockName].price) + ' ';
          }

          else if(values.stocks[stockName]){
            console.log('\x1b[35mSchedule\x1b[0m: ' + values.stocks[stockName].name + ' is at ' + values.stocks[stockName].price + ' - within range');
          }

          else {
            console.log('\x1b[31mSchedule\x1b[0m: Failed to fetch valid stock data');
          }
        }
      }

      if((message) && (controller.config.notify)) {
        console.log('\x1b[35mSchedule\x1b[0m: ' + message);

        notify = require(__dirname + '/../lib/notify');

        notify.sendNotification(null, message, device);

        for(deviceId in controllers) {
          if(deviceId !== 'config') {
            if(controllers[deviceId].typeClass === 'mp3') {
              runCommand.runCommand(deviceId, 'text-cash', 'single', false);
            }

            else {
              runCommand.runCommand(deviceId, 'text-' + message, 'single', false);
            }
          }
        }
      }
    }
  };
}());
