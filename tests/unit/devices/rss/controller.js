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
 * @fileoverview Unit test for devices/rss/controller.js
 */

exports.rssControllerTest = {
  fragments : function (test) {
    'use strict';

    var rssController = require(__dirname + '/../../../../devices/rss/controller'),
        fragments     = rssController.fragments();

    test.strictEqual(typeof fragments.item, 'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var rssController = require(__dirname + '/../../../../devices/rss/controller'),
        configGet     = { host   : 'example.com',
                         port    : '80',
                         path    : '/test/',
                         method  : 'GET',
                         badData : 'FAILURE' },
        testGet       = rssController.postPrepare(configGet);

    test.deepEqual(testGet, { host : 'example.com', port : '80', path : '/test/', method : 'GET' }, 'Additional params are filtered out.');

    test.done();
  },

  getArticles : function (test) {
    'use strict';

    var rssController = require(__dirname + '/../../../../devices/rss/controller'),
        rssData       = { rss : { channel : [{ item : [
          { 'title'           : ['Test 1'],
            'link'             : ['http://example.com/test1'],
            'description'     : ['<span>This is a test</span>'],
            'content:encoded' : ['This is a piece of encoded content']
          },
          { 'title'           : ['Test 2'],
            'link'             : ['http://example.com/test2'],
            'description'     : ['This is another test'],
            'content:encoded' : ['This is another piece of encoded content']
          }
        ]}]}},
        atomData      = { feed : { entry : [
          { title   : ['Test 1'],
            link    : [{'$'   : { 'href' : 'http://example.com/test1' }}],
            summary : ['This is a test'],
            content : [{ '_' : 'This is a piece of encoded content'}]
          },
          { title   : ['Test 2'],
            link    : [{'$'   : { 'href' : 'http://example.com/test2' }}],
            summary : ['This is another test'],
            content : [{ '_' : 'This is another piece of encoded content'}]
          },
          { title   : ['Test 3'],
            link    : [{'$'   : { 'href' : 'http://example.com/test3' }}],
            summary : ['This is a third test'],
            content : [{ '_' : 'This is a 3rd piece of encoded content'}]
          },
          { title   : ['Test 4'],
            link    : [{'$'   : { 'href' : 'http://example.com/test4' }}],
            summary : ['This is a fourth test'],
            content : [{ '_' : 'This is a fourth piece of encoded content'}]
          },
        ]}},
        badData       = {},
        testRssData   = rssController.getArticles(rssData, 1),
        testAtomData  = rssController.getArticles(atomData),
        testBadData   = rssController.getArticles(badData, 10);

    test.deepEqual(testRssData, [{ title       : 'Test 1',
                                   url         : 'http://example.com/test1',
                                   description : 'This is a test',
                                   text        : 'This is a piece of encoded content'
                                }], 'One article should be found for RSS feeds');
    test.deepEqual(testAtomData, [{ title       : 'Test 1',
                                    url         : 'http://example.com/test1',
                                    description : 'This is a test',
                                    text        : 'This is a piece of encoded content'
                                 },
                                 { title       : 'Test 2',
                                   url         : 'http://example.com/test2',
                                   description : 'This is another test',
                                   text        : 'This is another piece of encoded content'
                                 },
                                 { title       : 'Test 3',
                                   url         : 'http://example.com/test3',
                                   description : 'This is a third test',
                                   text        : 'This is a 3rd piece of encoded content'
                                 }], 'Three articles should be found for Atom feeds');
    test.deepEqual(testBadData,  {}, 'Nothing should be returned for bad data');

    test.done();
  }
};
