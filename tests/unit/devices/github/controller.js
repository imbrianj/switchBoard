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
 * @fileoverview Unit test for devices/github/controller.js
 */

exports.githubControllerTest = {
  fragments : function (test) {
    'use strict';

    var githubController = require(__dirname + '/../../../../devices/github/controller'),
        fragments        = githubController.fragments();

    test.strictEqual(typeof fragments.commit,  'string', 'Fragment verified');
    test.strictEqual(typeof fragments.message, 'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var githubController = require(__dirname + '/../../../../devices/github/controller'),
        config           = { host        : 'example.com',
                             port        : 80,
                             path        : '/test/',
                             method      : 'POST',
                             badData     : 'FAILURE',
                             postRequest : 'hello :)'},
        testPost         = githubController.postPrepare(config);

    test.deepEqual(testPost, { host    : 'example.com',
                               port    : 80,
                               path    : '/test/',
                               method  : 'POST',
                               headers : {
                                 'Accept'         : 'application/vnd.github.v3+json',
                                 'Accept-Charset' : 'utf-8',
                                 'User-Agent'     : 'node-switchBoard'
                               }
                              }, 'Additional params are filtered out.');

    test.done();
  },

  getCommits : function (test) {
    'use strict';

    var githubController  = require(__dirname + '/../../../../devices/github/controller'),
        githubData        = [{ html_url : 'http://foo/1',
                               commit   : { message   : 'This is a message',
                                            committer : { date : '2015-11-23T00:56:24Z' } },
                               foo      : 'bar' },
                             { html_url : 'http://foo/2',
                               commit   : { message   : 'This is another message',
                                            committer : { date : '2015-11-23T00:30:25Z' } },
                               bar      : 'baz' }],
        githubNewData     = [{ html_url : 'http://foo/1',
                               commit   : { message   : 'This is a message',
                                            committer : { date : '2015-11-23T00:56:24Z' } },
                               foo      : 'bar' },
                             { html_url : 'http://foo/2',
                               commit   : { message   : 'This is another message',
                                            committer : { date : '2011-11-23T00:30:25Z' } },
                               bar      : 'baz' }],
        testGithubData      = githubController.getCommits(githubData),
        testGithubCountData = githubController.getCommits(githubData,     1, 11111111111),
        testGithubNewData   = githubController.getCommits(githubNewData,  3, 1445565384000),
        testBadData         = githubController.getCommits({},            10, 11111111111);

    test.deepEqual(testGithubData, [ { url         : 'http://foo/1',
                                       time        : 1448240184000,
                                       description : 'This is a message' },
                                     { url         : 'http://foo/2',
                                       time        : 1448238625000,
                                       description : 'This is another message' } ], 'Two commit should be found');
    test.deepEqual(testGithubCountData, [ { url         : 'http://foo/1',
                                            time        : 1448240184000,
                                            description : 'This is a message',
                                            upToDate    : false } ], 'One commit should be found');
    test.deepEqual(testGithubNewData,   [ { url         : 'http://foo/1',
                                            time        : 1448240184000,
                                            description : 'This is a message',
                                            upToDate    : false },
                                          { url         : 'http://foo/2',
                                            time        : 1322008225000,
                                            description : 'This is another message',
                                            upToDate    : true } ], 'Two commit should be found - one out of date, one not');
    test.deepEqual(testBadData,         [], 'Nothing should be returned for bad data');

    test.done();
  }
};
