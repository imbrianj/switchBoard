/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for controllers/weather.js
 */

exports.weatherControllerTest = {
  translateCommand : function (test) {
    'use strict';

    var weatherController = require(__dirname + '/../../../controllers/weather'),
        config            = { host : 'TEST-host', port : '80', path : '/TEST/', method : 'GET', badData : 'FAILURE' },
        testData          = weatherController.postPrepare(config);

    test.deepEqual(testData, { host : 'TEST-host', port : '80', path : '/TEST/', method : 'GET' }, 'Additional params are filtered out.');

    test.done();
  }
};