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
 * @fileoverview Unit test for devices/airQuality/parser.js
 */

exports.airQualityParserTest = {
  parser : function (test) {
    'use strict';

    var airQualityParser = require(__dirname + '/../../../../devices/airQuality/parser'),
        markup     = '<h1>Foo</h1> <h2>{{AIR_QUALITY_LOCATION}}</h2> <ul>{{AIR_QUALITY_DYNAMIC}}</ul>',
        value      = { location: 'My House',
                       report : [
                         { type : 'dogs',    value : 2.2,  units : 'dgs' },
                         { type : 'cats',    value : 1.2,  units : 'cts' },
                         { type : 'falcons', value : 500,  units : 'flk' } ]
                     },
        fragments  = { report : '<li>{{AIR_QUALITY_TYPE}}: {{AIR_QUALITY_VALUE}}{{AIR_QUALITY_UNITS}}</li>' },
        goodMarkup = airQualityParser.airQuality('dummy', markup, 'ok', value,        fragments),
        noValue    = airQualityParser.airQuality('dummy', markup, 'ok', 'API Choked', fragments);

    test.strictEqual(goodMarkup.indexOf('{{'),                     -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('<h2>My House</h2>'),   -1, 'Passed markup validated 1');
    test.notStrictEqual(goodMarkup.indexOf('<li>dogs: 2.2dgs'),    -1, 'Passed markup validated 2');
    test.notStrictEqual(goodMarkup.indexOf('<li>cats: 1.2cts'),    -1, 'Passed markup validated 3');
    test.notStrictEqual(goodMarkup.indexOf('<li>falcons: 500flk'), -1, 'Passed markup validated 4');
    test.strictEqual(noValue.indexOf('{{'),                        -1, 'All values replaced');

    test.done();
  }
};
