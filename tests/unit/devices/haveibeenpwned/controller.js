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
 * @fileoverview Unit test for devices/haveibeenpwned/controller.js
 */

exports.haveibeenpwnedControllerTest = {
  fragments : function (test) {
    'use strict';

    var haveibeenpwnedController = require(__dirname + '/../../../../devices/haveibeenpwned/controller'),
        fragments                = haveibeenpwnedController.fragments();

    test.strictEqual(typeof fragments.allClear, 'string', 'Fragment verified');
    test.strictEqual(typeof fragments.pwns,     'string', 'Fragment verified');
    test.strictEqual(typeof fragments.pwn,      'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var haveibeenpwnedController = require(__dirname + '/../../../../devices/haveibeenpwned/controller'),
        config           = { host        : 'example.com',
                             port        : '80',
                             path        : '/test/',
                             method      : 'POST',
                             badData     : 'FAILURE',
                             postRequest : 'hello :)'},
        testPost         = haveibeenpwnedController.postPrepare(config);

    test.deepEqual(testPost, { host    : 'example.com',
                               port    : '80',
                               path    : '/test/',
                               method  : 'POST',
                               headers : {
                                 'Accept-Charset' : 'utf-8',
                                 'User-Agent'     : 'node-switchBoard'
                               }
                              }, 'Additional params are filtered out.');

    test.done();
  },

  getPwns : function (test) {
    'use strict';

    var haveibeenpwnedController  = require(__dirname + '/../../../../devices/haveibeenpwned/controller'),
        haveibeenpwnedData        = [{ Title       : 'Test 1',
                                       Name        : 'Bad Site',
                                       Domain      : 'foo.com',
                                       BreachDate  : '2015-12-31',
                                       Description : 'Something bad happened',
                                       DataClasses : ['Email addresses', 'Passwords', 'Usernames'] } ],
        haveibeenpwnedNewData     = [{ Title       : 'Test 1',
                                       Name        : 'Bad Site',
                                       Domain      : 'foo.com',
                                       BreachDate  : '2015-12-31',
                                       Description : 'Something bad happened',
                                       DataClasses : ['Email addresses', 'Passwords', 'Usernames'] },
                                     { Title       : 'Test 2',
                                       Name        : 'Bad Site 2',
                                       Domain      : 'foo2.com',
                                       BreachDate  : '2015-12-30',
                                       Description : 'Something bad happened',
                                       DataClasses : ['Email addresses', 'Passwords', 'Usernames'] }],
        testHaveibeenpwnedData    = haveibeenpwnedController.getPwns(haveibeenpwnedData),
        testHaveibeenpwnedNewData = haveibeenpwnedController.getPwns(haveibeenpwnedNewData),
        testBadData               = haveibeenpwnedController.getPwns(null);

    test.deepEqual(testHaveibeenpwnedData, [ { title       : 'Test 1',
                                               domain      : 'foo.com',
                                               date        : '2015-12-31',
                                               description : 'Something bad happened',
                                               data        : 'Email addresses, Passwords, Usernames' } ], 'One pwn should be found');
    test.deepEqual(testHaveibeenpwnedNewData, [ { title       : 'Test 1',
                                                  domain      : 'foo.com',
                                                  date        : '2015-12-31',
                                                  description : 'Something bad happened',
                                                  data        : 'Email addresses, Passwords, Usernames' },
                                                { title       : 'Test 2',
                                                  domain      : 'foo2.com',
                                                  date        : '2015-12-30',
                                                  description : 'Something bad happened',
                                                  data        : 'Email addresses, Passwords, Usernames' } ], 'Two pwns should be found');
    test.deepEqual(testBadData,               [], 'Nothing should be returned for empty data');

    test.done();
  }
};
