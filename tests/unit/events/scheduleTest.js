/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for schedule.js
 */

exports.scheduleTest = {
  getDirectory : function (test) {
    'use strict';

    var schedule   = require('../../../events/schedule'),
        controller = { weather : { config : { typeClass : 'weather' },
                                   event  : { fire : function(deviceType, source, controllers) {
                                                       console.log('This should print');
                                                     } } },
                       config  : { config : { thisShouldnt : 'execute' },
                                   event  : { fire : function(deviceType, source, controllers) {
                                                       console.log('This should NOT print');
                                                     } } },
                       foo     : { config : { thisShouldnt : 'execute' },
                                   event  : { fire : function(deviceType, source, controllers) {
                                                       console.log('This should NOT print');
                                                     } } } };

    test.ok(schedule.fire(controller), 'Schedule shouldnt choke on config or a poorly configured controller');

    test.done();
  }
};