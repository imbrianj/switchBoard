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
 * @fileoverview Unit test for devices/location/parser.js
 */

exports.locationParserTest = {
  parser : function (test) {
    'use strict';

    var locationParser = require(__dirname + '/../../../../devices/location/parser'),
        markup         = '<h1>Foo</h1> <div>{{LOCATION_DYNAMIC}}</div>',
        value          = [ { url : 'http://example.com/1', name : 'Tester', lat : '45.67890123', long : '-123.5678901', time : 1444480200000 },
                           { url : 'http://example.com/2', name : 'Tester', lat : '46.78901234', long : '-123.4567890', time : 1444381200000 }],
        fragments      = { item : '<a href="{{LOCATION_URL}}">{{LOCATION_NAME}}</a> <p>{{LOCATION_TIME}}</p>' },
        goodMarkup     = locationParser.location('dummy', markup, 'ok', value, fragments),
        noValue        = locationParser.location('dummy', markup, 'ok', null,  fragments);

    test.strictEqual(goodMarkup.indexOf('{{'),                                                                -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('<a href="http://example.com/1">Tester</a> <p>Sat at 5:30am</p>'), -1, 'Passed markup validated1');
    test.notStrictEqual(goodMarkup.indexOf('<a href="http://example.com/2">Tester</a> <p>Fri at 2:0am</p>'),  -1, 'Passed markup validated2');
    test.strictEqual(noValue.indexOf('{{'),                                                                   -1, 'All values replaced');
    test.strictEqual(noValue, '<h1>Foo</h1> <div></div>',                                                         'Passed markup validated');

    test.done();
  }
};
