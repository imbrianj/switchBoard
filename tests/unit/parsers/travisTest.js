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
 * @fileoverview Unit test for parsers/travis.js
 */

exports.travisParserTest = {
  parser : function (test) {
    'use strict';

    var travisParser = require(__dirname + '/../../../parsers/travis'),
        markup     = '<h1>Foo</h1> <div>{{TRAVIS_DYNAMIC}}</div>',
        value      = [ { state : 'finished', status : 'ok',  duration : 35, url : '#link1', label : 'Completed' },
                       { state : 'started',  status : 'ok',  duration : 45, url : '#link2', label : 'In progress' },
                       { state : 'finished', status : 'err', duration : 55, url : '#link3', label : 'Failed test' } ],
        fragments  = { build : '{{TRAVIS_ICON}} <a href="{{TRAVIS_URL}}">{{TRAVIS_DESCRIPTION}}</a> <em>{{TRAVIS_STATE}}</em> {{TRAVIS_DURATION}}' },
        goodMarkup = travisParser.travis('dummy', markup, 'ok', value, fragments),
        noValue    = travisParser.travis('dummy', markup, 'ok', null,  fragments);

    test.ok((goodMarkup.indexOf('{{')                  === -1), 'All values replaced');
    test.ok((goodMarkup.indexOf('check <a href="#link1">Completed</a>')   !== -1), 'Passed markup validated1');
    test.ok((goodMarkup.indexOf('cogs <a href="#link2">In progress</a>')  !== -1), 'Passed markup validated2');
    test.ok((goodMarkup.indexOf('times <a href="#link3">Failed test</a>') !== -1), 'Passed markup validated3');
    test.ok((noValue.indexOf('{{')                     === -1), 'All values replaced');
    test.equal(noValue, '<h1>Foo</h1> <div></div>',             'Passed markup validated');

    test.done();
  }
};
