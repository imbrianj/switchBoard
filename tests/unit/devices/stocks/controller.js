/*jslint white: true */
/*global module, String, require, console */

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
 * @fileoverview Unit test for devices/stocks/controller.js
 */

exports.stocksControllerTest = {
  fragments : function (test) {
    'use strict';

    var stocksController = require(__dirname + '/../../../../devices/stocks/controller'),
        fragments        = stocksController.fragments();

    test.strictEqual(typeof fragments.list, 'string', 'Fragment verified');

    test.done();
  },

  stocksOpen : function (test) {
    'use strict';

    var stocksController = require(__dirname + '/../../../../devices/stocks/controller'),
        weekend          = new Date('July 20, 2014 12:00:00'),
        beforeHours      = new Date('July 21, 2014 08:59:00'),
        afterHours       = new Date('July 21, 2014 16:01:00'),
        openEarly        = new Date('July 21, 2014 09:01:00'),
        openLate         = new Date('July 21, 2014 15:59:00');

    test.strictEqual(stocksController.stocksOpen({ device : { deviceId : 'FOO', title : 'Stocks' } }, weekend),     false, 'Stocks are closed on weekends');
    test.strictEqual(stocksController.stocksOpen({ device : { deviceId : 'FOO', title : 'Stocks' } }, beforeHours), false, 'Stocks open at 9am');
    test.strictEqual(stocksController.stocksOpen({ device : { deviceId : 'FOO', title : 'Stocks' } }, afterHours),  false, 'Stocks close at 4pm');
    test.strictEqual(stocksController.stocksOpen({ device : { deviceId : 'FOO', title : 'Stocks' } }, openEarly),   true,  'Stocks open at 9am');
    test.strictEqual(stocksController.stocksOpen({ device : { deviceId : 'FOO', title : 'Stocks' } }, openLate),    true,  'Stocks close at 4pm');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var stocksController = require(__dirname + '/../../../../devices/stocks/controller'),
        config           = { host    : 'TEST-host',
                             port    : '443',
                             path    : '/TEST/',
                             method  : 'GET',
                             badData : 'FAILURE' },
        testData         = stocksController.postPrepare(config);

    test.deepEqual(testData, { host : 'TEST-host', port : '443', path : '/TEST/', method : 'GET' }, 'Additional params are filtered out.');

    test.done();
  }
};
