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
 * @fileoverview Unit test for apps/gerty/airQuality.js
 */

exports.airQualityTest = {
  airQuality : function (test) {
    'use strict';

    var airQuality = require(__dirname + '/../../../../apps/gerty/airQuality'),
        allGood    = airQuality.airQuality({ value : { report : [{ type : 'no2', value : 0.015 }, { type : 'pm25', value : 10  }, { type : 'co', value : 2  }] } }),
        allBad     = airQuality.airQuality({ value : { report : [{ type : 'no2', value : 0.25  }, { type : 'pm25', value : 160 }, { type : 'co', value : 25 }] } }),
        mixed      = airQuality.airQuality({ value : { report : [{ type : 'no2', value : 0.015 }, { type : 'pm25', value : 160 }, { type : 'co', value : 2  }] } });

    test.deepEqual(allGood, { scared : 0, comfortable :  3 }, 'All good');
    test.deepEqual(allBad,  { scared : 5, comfortable : -5 }, 'All bad');
    test.deepEqual(mixed,   { scared : 2, comfortable :  0 }, 'A mix of good and bad');

    test.done();
  }
};
