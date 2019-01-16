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

    test.strictEqual(weatherController.formatTime(1546344000), '4:00', 'Return a string of the current time (hh:mm)');

    test.done();
  },

  formatForecast : function (test) {
    'use strict';

    var weatherController = require(__dirname + '/../../../../devices/weather/controller'),
        forecast          = { data: [{
                              icon            : 'cloudy',
                              time            : 1546761600,
                              temperatureHigh : 58.55,
                              temperatureLow  : 44.35,
                              summary         : 'Partly Cloudy'
                            },
                            {
                              code            : 'clear-night',
                              time            : 1546934400,
                              temperatureHigh : 55.44,
                              temperatureLow  : 43.32,
                              summary         : 'Spooky'
                            }]},
        results           = weatherController.formatForecast(forecast, false),
        metricResults     = weatherController.formatForecast(forecast, true);

    test.strictEqual(results.days[0].high, 58);
    test.strictEqual(results.days[0].low,  44);
    test.strictEqual(results.days[1].high, 55);
    test.strictEqual(results.days[1].low,  43);

    test.strictEqual(metricResults.days[0].high, 14.7);
    test.strictEqual(metricResults.days[0].low,  6.9);
    test.strictEqual(metricResults.days[1].high, 13);
    test.strictEqual(metricResults.days[1].low,  6.3);

    test.done();
  }
};
