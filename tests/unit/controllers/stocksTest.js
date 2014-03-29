/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for controllers/stocks.js
 */

exports.stocksControllerTest = {
  translateCommand : function (test) {
    'use strict';

    var stocksController = require(__dirname + '/../../../controllers/stocks'),
        config           = { host : 'TEST-host', port : '80', path : '/TEST/', method : 'GET', badData : 'FAILURE' },
        testData         = stocksController.postPrepare(config);

    test.deepEqual(testData, { host : 'TEST-host', port : '80', path : '/TEST/', method : 'GET' }, 'Additional params are filtered out.');

    test.done();
  }
};