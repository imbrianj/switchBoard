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
 * @fileoverview Unit test for devices/weather/controller.js
 */

exports.weatherControllerTest = {
  fragments : function (test) {
    'use strict';

    var weatherController = require(__dirname + '/../../../../devices/weather/controller'),
        fragments         = weatherController.fragments();

    test.strictEqual(typeof fragments.forecast, 'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var weatherController = require(__dirname + '/../../../../devices/weather/controller'),
        config            = { host    : 'TEST-host',
                              port    : '443',
                              path    : '/TEST/',
                              method  : 'GET',
                              badData : 'FAILURE' },
        testData          = weatherController.postPrepare(config);

    test.deepEqual(testData, { host : 'TEST-host', port : '443', path : '/TEST/', method : 'GET' }, 'Additional params are filtered out.');

    test.done();
  },

  formatTime : function (test) {
    'use strict';

    var weatherController = require(__dirname + '/../../../../devices/weather/controller');

    test.deepEqual(weatherController.formatTime('4:22 pm'), { hour : '16', minute : '22' });

    test.done();
  },

  fToC : function (test) {
    'use strict';

    var weatherController = require(__dirname + '/../../../../devices/weather/controller');

    test.deepEqual(weatherController.fToC(57), 14);

    test.done();
  },

  formatForecast : function (test) {
    'use strict';

    var weatherController = require(__dirname + '/../../../../devices/weather/controller'),
        forecast          = [{
                              code : '10',
                              date : '30 Oct 2017',
                              day  : 'Mon',
                              high : '58',
                              low  : '44',
                              text : 'Partly Cloudy'
                            },
                            {
                              code : '11',
                              date : '31 Oct 2017',
                              day  : 'Tue',
                              high : '55',
                              low  : '40',
                              text : 'Spooky'
                            }],
        results           = weatherController.formatForecast(forecast, false),
        metricResults     = weatherController.formatForecast(forecast, true);

    test.strictEqual(results[0].high, 58);
    test.strictEqual(results[0].low,  44);
    test.strictEqual(results[1].high, 55);
    test.strictEqual(results[1].low,  40);

    test.strictEqual(metricResults[0].high, 14);
    test.strictEqual(metricResults[0].low,  7);
    test.strictEqual(metricResults[1].high, 13);
    test.strictEqual(metricResults[1].low,  4);

    test.done();
  }
};
