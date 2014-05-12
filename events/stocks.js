/*jslint white: true */
/*global State, module, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Simple script to fire for each scheduled interval.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140510,

    fire : function(deviceName, command, controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          controller = controllers[deviceName],
          nycOffset  = -5,
          date       = new Date(),
          utcTime    = date.getTime() + (date.getTimezoneOffset() * 60000),
          nycTime    = new Date(utcTime + (3600000 * nycOffset)),
          speech,
          callback;

      // Trading isn't open on weekends, so we don't need to poll.
      if((nycTime.getDay() !== 6) && (nycTime.getDay() !== 0) || 1) {
        // Trading is only open from 9am - 4pm.
        if((nycTime.getHours() > 9) && (nycTime.getHours() < 16) || 1) {
          State[deviceName].state.active = true;

          callback = function(err, stocks) {
            var deviceState = require(__dirname + '/../lib/deviceState'),
                message     = '',
                i           = 0,
                stockName;

            deviceState.updateState(deviceName, { state : 'ok', value : stocks });

            if((controller.config.limits) && (stocks)) {
              for(stockName in controller.config.limits) {
                if((typeof controller.config.limits[stockName].sell !== 'undefined') && (stocks[stockName].price >= controller.config.limits[stockName].sell)) {
                  message = message + 'Your ' + stocks[stockName].name + ' stock is doing well at ' + stocks[stockName].ask + '.  Think about selling?  ';
                }

                else if((typeof controller.config.limits[stockName].buy !== 'undefined') && (stocks[stockName].price <= controller.config.limits[stockName].buy)) {
                  message = message + 'Your ' + stocks[stockName].name + ' stock is low at ' + stocks[stockName].ask + '.  Think about buying?  ';
                }

                else {
                  console.log('Schedule: ' + stocks[stockName].name + ' is at ' + stocks[stockName].price + ' - within range');
                }
              }
            }

            if(message) {
              console.log('Schedule: ' + message);

              for(i; i < controller.config.notify.length; i += 1) {
                if(typeof controllers[controller.config.notify[i]] !== 'undefined') {
                  if(controllers[controller.config.notify[i]].config.typeClass === 'mp3') {
                    runCommand.runCommand(controller.config.notify[i], 'text-cash', controllers, 'single', false);
                  }

                  else {
                    runCommand.runCommand(controller.config.notify[i], 'text-' + message, controllers, 'single', false);
                  }
                }
              }
            }
          };

          runCommand.runCommand(deviceName, 'list', controllers, deviceName, false, callback);
        }

        else {
          State[deviceName].state.active = false;

          console.log('Schedule: Stock trading is closed - after hours');
        }
      }

      else {
        State[deviceName].state.active = false;

        console.log('Schedule: Stock trading is closed - weekend');
      }
    }
  };
}());