/*jslint white: true */
/*global module, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Handles any scheduled events.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140418,

    scheduleInit : function(controllers) {
      setInterval(function() {
        var schedEvent = require(__dirname + '/../events/schedule');

        //console.log('Schedule: Interval elapsed');

        schedEvent.fire(controllers);
      }, (controllers.config.pollMinutes * 60000));
    }
  };
}());