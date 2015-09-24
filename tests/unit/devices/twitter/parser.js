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
 * @fileoverview Unit test for devices/twitter/parser.js
 */

exports.twitterParserTest = {
  parser : function (test) {
    'use strict';

    var twitterParser = require(__dirname + '/../../../../devices/twitter/parser'),
        markup        = '<h1>Foo</h1> <div>{{TWITTER_DYNAMIC}}</div>',
        value         = [ { url : 'http://example.com/1', author : 'Joe', text : 'This is a test tweet' },
                          { url : 'http://example.com/2', author : 'Bob', text : 'This is another test tweet' }],
        fragments     = { tweet : '<a href="{{TWEET_URL}}">{{TWEET_AUTHOR}}</a> <p>{{TWEET_TEXT}}</p>' },
        goodMarkup    = twitterParser.twitter('dummy', markup, 'ok', value, fragments),
        noValue       = twitterParser.twitter('dummy', markup, 'ok', null,  fragments);

    test.strictEqual(goodMarkup.indexOf('{{'),                                        -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('<a href="http://example.com/1">Joe</a>'), -1, 'Passed markup validated1');
    test.notStrictEqual(goodMarkup.indexOf('<a href="http://example.com/2">Bob</a>'), -1, 'Passed markup validated2');
    test.notStrictEqual(goodMarkup.indexOf('<p>This is another test tweet</p>'),      -1, 'Passed markup validated3');
    test.strictEqual(noValue.indexOf('{{'),                                           -1, 'All values replaced');
    test.strictEqual(noValue, '<h1>Foo</h1> <div></div>',                                 'Passed markup validated');

    test.done();
  }
};
