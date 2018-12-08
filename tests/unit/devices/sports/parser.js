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
 * @fileoverview Unit test for devices/sports/parser.js
 */

exports.sportsParserTest = {
  parser : function (test) {
    'use strict';

    var sportsParser = require(__dirname + '/../../../../devices/sports/parser'),
        markup     = '<h1>Foo</h1> <div>{{SPORTS_DYNAMIC}}</div>',
        value      = { quidditch   : { name  : 'quidditch',
                                       title : 'Quidditch League',
                                       games : [
                                         {
                                           away : {
                                             score : '111',
                                             title : 'Gryffindor'
                                           },
                                           home : {
                                             score : '110',
                                             title : 'Slytherin'
                                           }
                                         }
                                       ]
                                     },
                       baseketball : { name  : 'baseketball',
                                       title : 'Baseketball League',
                                       games : []
                                     }
                                 },
        fragments  = { league : '<h1>{{LEAGUE_NAME}}</h1><ul>{{GAME_LIST}}</ul>',
                       game   : '<span>{{GAME_TITLE}} {{GAME_AWAY_SCORE}}</span>' },
        goodMarkup = sportsParser.sports('dummy', markup, 'ok', value, fragments),
        noValue    = sportsParser.sports('dummy', markup, 'ok', null,  fragments);

    test.strictEqual(goodMarkup.indexOf('{{'),                                           -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('<h1>Quidditch League</h1>'),                 -1, 'Passed markup validated1');
    test.notStrictEqual(goodMarkup.indexOf('<span>Gryffindor vs. Slytherin 111</span>'), -1, 'Passed markup validated2');
    test.strictEqual(goodMarkup.indexOf('Baseketball League'),                           -1, 'Leagues with no games should have title omitted');
    test.strictEqual(noValue.indexOf('{{'),                                              -1, 'All values replaced');
    test.strictEqual(noValue, '<h1>Foo</h1> <div></div>',                                    'Passed markup validated');

    test.done();
  }
};
