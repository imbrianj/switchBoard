/*jslint white: true */
/*global State, module, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Simple script to fire when the given device executes a
 *               presumed good command.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140418,

    fire : function(device, command, controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          deviceName;

      if((command === 'AlarmOn') || (command === 'AlarmOff')) {
        for(deviceName in controllers) {
          if((deviceName !== 'config') && (controllers[deviceName].config.typeClass === 'speech')) {
            runCommand.runCommand(deviceName, command === 'AlarmOn' ? 'text-Camera armed' : 'text-Camera disarmed', controllers, 'single', false);
          }
        }
      }
    }
  };
}());