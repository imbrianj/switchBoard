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
 * @fileoverview Unit test for devices/sports/controller.js
 */

exports.sportsControllerTest = {
  fragments : function (test) {
    'use strict';

    var sportsController = require(__dirname + '/../../../../devices/sports/controller'),
        fragments        = sportsController.fragments();

    test.strictEqual(typeof fragments.game,   'string', 'Fragment verified');
    test.strictEqual(typeof fragments.league, 'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var sportsController = require(__dirname + '/../../../../devices/sports/controller'),
        configGet        = { host    : 'example.com',
                             port    : '80',
                             path    : '/test/',
                             method  : 'GET',
                             badData : 'FAILURE' },
        testGet          = sportsController.postPrepare(configGet);

    test.deepEqual(testGet, {
                              host : 'example.com',
                              port : '80',
                              path : '/test/',
                              method : 'GET',
                              headers: {
                                'Accept'         : 'application/json',
                                'Accept-Charset' : 'utf-8',
                                'User-Agent'     : 'node-switchBoard'
                              }
                            }, 'Additional params are filtered out.');

    test.done();
  },

  getGames : function (test) {
    'use strict';

    var sportsController = require(__dirname + '/../../../../devices/sports/controller'),
        sportsData       = [{
                             name    : 'quidditch',
                             leagues : [{
                               abbreviation : 'nq',
                               name         : 'National quidditch',
                               shortName    : 'quidditch',
                               events       : [{
                                 date        : '2016-02-05T00:00:00Z',
                                 location    : 'Azkaban',
                                 status      : 'post',
                                 summary     : 'Text',
                                 link        : 'http://localhost',
                                 competitors : [{
                                   type   : 'team',
                                   score  : '111',
                                   winner : true,
                                   name   : 'Gryffindor',
                                   logo   : 'http://localhost/team-1.png',
                                   test   : true
                                 }, {
                                   type   : 'team',
                                   score  : '110',
                                   winner : false,
                                   name   : 'Slytherin',
                                   logo   : 'http://localhost/team-2.png',
                                   test   : true
                                 }]
                               }, {
                                 date        : '2016-02-05T02:00:00Z',
                                 location    : 'Azkaban',
                                 status      : 'post',
                                 summary     : 'Text',
                                 link        : 'http://localhost',
                                 competitors : [{
                                   type   : 'team',
                                   score  : '2',
                                   winner : false,
                                   name   : 'Foo',
                                   logo   : 'http://localhost/team-3.png',
                                   test   : true
                                 }, {
                                   type   : 'team',
                                   score  : '3',
                                   winner : true,
                                   name   : 'Bar',
                                   logo   : 'http://localhost/team-4.png',
                                   test   : true
                                 }]
                               }]
                             }]
                           }],
        badData          = {},
        testSportsData   = sportsController.getGames(sportsData, 'TEST'),
        testBadData      = sportsController.getGames(badData,    'TEST');

    test.deepEqual(testSportsData, { nq: {
                                       name: 'quidditch',
                                       title: 'National quidditch',
                                       games:
                                        [ { home:
                                             { title: 'Gryffindor',
                                               score: '111',
                                               winner: true,
                                               image: '' },
                                            away:
                                             { title: 'Slytherin',
                                               score: '110',
                                               winner: false,
                                               image: '' },
                                            time: 1454630400000,
                                            summary: 'Text',
                                            status: 'post',
                                            location: 'Azkaban',
                                            url: 'http://localhost' },
                                          { home:
                                             { title: 'Foo',
                                               score: '2',
                                               winner: false,
                                               image: '' },
                                            away:
                                             { title: 'Bar',
                                               score: '3',
                                               winner: true,
                                               image: '' },
                                            time: 1454637600000,
                                            summary: 'Text',
                                            status: 'post',
                                            location: 'Azkaban',
                                            url: 'http://localhost' } ] } }, 'Grabs game data');
    test.deepEqual(testBadData, {}, 'Nothing should be returned for bad data');

    test.done();
  }
};
