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
 * @fileoverview Unit test for apps/gerty/weather.js
 */

exports.weatherTest = {
  weather : function (test) {
    'use strict';

    var weather    = require(__dirname + '/../../../../apps/gerty/weather'),
        deviceHot  = weather.weather({ value : { temp : 100, code : 40 } }),
        deviceNice = weather.weather({ value : { temp : 70,  code : 26 } }),
        deviceSnow = weather.weather({ value : { temp : 30,  code : 46 } });

    test.deepEqual(deviceHot,  { excited: -1, comfortable: -8.666666666666668 },  'This is just miserable weather');
    test.deepEqual(deviceNice, { excited: 0,  comfortable: 5 },                   'Sunny.  Comfy, but not too exciting');
    test.deepEqual(deviceSnow, { excited: 5,  comfortable: -3.125 },              'Snowing!  Not comfy, but pretty exciting');

    test.done();
  }
};
