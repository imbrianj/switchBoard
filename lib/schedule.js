/*jslint white: true */
/*global module, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Handles any scheduled events.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140427,

    scheduleInit : function(controllers) {
      var pollMinutes = controllers.config.pollMinutes || 15;

      setInterval(function() {
        var schedEvent = require(__dirname + '/../events/schedule');

        console.log('Schedule: Interval elapsed');

        schedEvent.fire(controllers);
      }, (pollMinutes * 60000));
    }
  };
}());