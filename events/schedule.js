/*jslint white: true */
/*global App, module, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Simple script to fire on interval.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140418,

    fire : function(controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          deviceName;

      for(deviceName in controllers) {
        if(deviceName !== 'config') {
          switch(controllers[deviceName].config.typeClass) {
            // Specify typeClass of controllers that should be fired on interval.
            case 'weather' :
            case 'stocks'  :
              if(typeof controllers[deviceName].event === 'object') {
                controllers[deviceName].event.fire(deviceName, 'schedule', controllers);
              }
            break;
          }
        }
      }

      return true;
    }
  };
}());