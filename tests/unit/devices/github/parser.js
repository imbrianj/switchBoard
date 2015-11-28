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
 * @fileoverview Unit test for devices/github/parser.js
 */

exports.githubParserTest = {
  parser : function (test) {
    'use strict';

    var githubParser = require(__dirname + '/../../../../devices/github/parser'),
        markup         = '<h1>Foo</h1> <div>{{GITHUB_DYNAMIC}}</div>',
        value          = [ { url         : 'http://foo/1',
                             time        : 1448240184000,
                             description : 'This is a message' },
                           { url         : 'http://foo/2',
                             time        : 1448238625000,
                             description : 'This is another message' } ],
        fragments      = { commit  : '<a href="{{GITHUB_URL}}">{{GITHUB_TITLE}}</a> <p>{{GITHUB_DESCRIPTION}}</p>',
                           message : '<h3>{{GITHUB_MESSAGE}}</h3>' },
        goodMarkup     = githubParser.github('dummy', markup, 'ok', value, fragments),
        noValue        = githubParser.github('dummy', markup, 'ok', null,  fragments);

    test.strictEqual(goodMarkup.indexOf('{{'),                                -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('<a href="http://foo/1">'),        -1, 'Passed markup validated1');
    test.notStrictEqual(goodMarkup.indexOf('<p>This is a message</p>'),       -1, 'Passed markup validated2');
    test.notStrictEqual(goodMarkup.indexOf('<p>This is another message</p>'), -1, 'Passed markup validated2');
    test.strictEqual(noValue.indexOf('{{'),                                   -1, 'All values replaced');
    test.strictEqual(noValue, '<h1>Foo</h1> <div></div>',                         'Passed markup validated');

    test.done();
  }
};
