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
 * @fileoverview Unit test for devices/neato/parser.js
 */

exports.neatoParserTest = {
  parser : function (test) {
    'use strict';

    var neatoParser  = require(__dirname + '/../../../../devices/neato/parser'),
        markup       = '<h1>Foo</h1> <span class="{{DEVICE_STATE_BATTERY_CLASS}}{{DEVICE_STATE_CHARGING}}">{{DEVICE_BATTERY_LEVEL}}: {{DOCK_STATUS}}</span>',
        valueDocked  = { battery : 50, charging : true,  docked : true },
        valueClean   = { battery : 75, charging : false, docked : false },
        dockedMarkup = neatoParser.neato('dummy', markup, 'ok', valueDocked),
        cleanMarkup  = neatoParser.neato('dummy', markup, 'ok', valueClean),
        noValue      = neatoParser.neato('dummy', markup, 'ok', 'API Choked');

    test.strictEqual(dockedMarkup.indexOf('{{'),                                                        -1, 'All values replaced');
    test.notStrictEqual(dockedMarkup.indexOf('<span class="quarter device-active">50%: Docked</span>'), -1, 'Passed markup validated 1');
    test.strictEqual(cleanMarkup.indexOf('{{'),                                                         -1, 'All values replaced');
    test.notStrictEqual(cleanMarkup.indexOf('<span class="half">75%: Undocked</span>'),                 -1, 'Passed markup validated 2');
    test.strictEqual(noValue.indexOf('{{'),                                                             -1, 'All values replaced');

    test.done();
  }
};
