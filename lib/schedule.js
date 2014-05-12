/*jslint white: true */
/*global State, module, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Handles any scheduled events.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140503,

    scheduleInit : function(controllers) {
      var pollMinutes = controllers.config.pollMinutes || 15;

      setInterval(function() {
        var schedEvent = require(__dirname + '/../events/schedule'),
            now        = new Date();

        console.log('Schedule: Interval elapsed (' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ')');

        schedEvent.fire(controllers);
      }, (pollMinutes * 60000));
    }
  };
}());