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
 * @fileoverview Unit test for devices/airQuality/controller.js
 */

exports.airQualityControllerTest = {
  fragments : function (test) {
    'use strict';

    var airQualityController = require(__dirname + '/../../../../devices/airQuality/controller'),
        fragments            = airQualityController.fragments();

    test.strictEqual(typeof fragments.report, 'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var airQualityController = require(__dirname + '/../../../../devices/airQuality/controller'),
        config            = { host    : 'TEST-host',
                              port    : '443',
                              path    : '/TEST/',
                              method  : 'GET',
                              badData : 'FAILURE' },
        testData          = airQualityController.postPrepare(config);

    test.deepEqual(testData, { host : 'TEST-host', port : '443', path : '/TEST/', method : 'GET' }, 'Additional params are filtered out.');

    test.done();
  },

  formatReport : function (test) {
    'use strict';

    var airQualityController = require(__dirname + '/../../../../devices/airQuality/controller'),
        report               = [{
                                  parameter   : 'dogs',
                                  value       : 2.2,
                                  lastUpdated : '2017-11-20T05:00:00.000Z',
                                  unit        : 'dgs'
                                },
                                {
                                  parameter   : 'cats',
                                  value       : 1.2,
                                  lastUpdated : '2017-11-20T04:00:00.000Z',
                                  unit        : 'cts'
                                }],
        results              = airQualityController.formatReport(report);

    test.strictEqual(results[0].type,  'dogs');
    test.strictEqual(results[0].value, 2.2);
    test.strictEqual(results[0].units, 'dgs');

    test.strictEqual(results[1].type,  'cats');
    test.strictEqual(results[1].value, 1.2);
    test.strictEqual(results[1].units, 'cts');

    test.done();
  }
};
