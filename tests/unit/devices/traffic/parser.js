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
 * @fileoverview Unit test for devices/traffic/parser.js
 */

exports.trafficParserTest = {
  parser : function (test) {
    'use strict';

    var trafficParser = require(__dirname + '/../../../../devices/traffic/parser'),
        markup        = '<h1>Foo</h1> <div>{{TRAFFIC_DYNAMIC}}</div>',
        value         = { foo : { title : 'TEST NAME',   image : 'http://test.com/image.jpg' },
                          bar : { title : 'SECOND NAME', image : 'http://example.com/testing.jpg' } },
        fragments     = { list : '<img src="{{CAM_IMG}}" alt="{{CAM_NAME}}" title="{{CAM_NAME}}" />' },
        goodMarkup    = trafficParser.traffic('dummy', markup, 'ok', value, fragments),
        noValue       = trafficParser.traffic('dummy', markup, 'ok', null,  fragments);

    test.strictEqual(goodMarkup.indexOf('{{'),                                                                                    -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('<img src="http://test.com/image.jpg" alt="TEST NAME" title="TEST NAME" />'),          -1, 'Passed markup validated');
    test.notStrictEqual(goodMarkup.indexOf('<img src="http://example.com/testing.jpg" alt="SECOND NAME" title="SECOND NAME" />'), -1, 'Passed markup validated');
    test.strictEqual(noValue.indexOf('{{'),                                                                                       -1, 'All values replaced');
    test.strictEqual(noValue, '<h1>Foo</h1> <div></div>',                                                                             'Passed markup validated');

    test.done();
  }
};
