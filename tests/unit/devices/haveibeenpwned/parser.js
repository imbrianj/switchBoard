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
 * @fileoverview Unit test for devices/haveibeenpwnedParser/parser.js
 */

exports.haveibeenpwnedParserTest = {
  parser : function (test) {
    'use strict';

    var haveibeenpwnedParser = require(__dirname + '/../../../../devices/haveibeenpwned/parser'),
        markup               = '<h1>Foo</h1> <div>{{HAVEIBEENPWNED_DYNAMIC}}</div>',
        value                = [ { title       : 'Test 1',
                                   domain      : 'foo.com',
                                   date        : '2015-12-31',
                                   description : 'Something bad happened' },
                                 { title       : 'Test 2',
                                   domain      : 'foo2.com',
                                   date        : '2015-12-30',
                                   description : 'Something bad happened' } ],
        fragments            = { allClear : '<h2>{{HAVEIBEENPWNED_ALL_CLEAR}}</h2>',
                                 pwns     : '<ul>{{HAVEIBEENPWNED_PWNS}}</ul>',
                                 pwn      : '<li><h5>{{HAVEIBEENPWNED_TITLE}}</h5><time>{{HAVEIBEENPWNED_DATE}}</time><p>{{HAVEIBEENPWNED_DESCRIPTION}}</p></li>' },
        goodMarkup           = haveibeenpwnedParser.haveibeenpwned('dummy', markup, 'ok', value, fragments),
        noValue              = haveibeenpwnedParser.haveibeenpwned('dummy', markup, 'ok', null,  fragments);

    test.strictEqual(goodMarkup.indexOf('{{'),                 -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('<ul>'),            -1, 'Passed markup validated1');
    test.notStrictEqual(goodMarkup.indexOf('<h5>Test 1</h5>'), -1, 'Passed markup validated2');
    test.notStrictEqual(goodMarkup.indexOf('<h5>Test 2</h5>'), -1, 'Passed markup validated2');
    test.notStrictEqual(noValue.indexOf('All Clear'),          -1, 'Confirmation');

    test.done();
  }
};
