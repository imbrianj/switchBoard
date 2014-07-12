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
 * @fileoverview Unit test for controllers/pushover.js
 */

exports.pushoverControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var pushoverController = require(__dirname + '/../../../controllers/pushover'),
        config             = { token       : 'TEST-token',
                               userKey     : 'TEST-userkey',
                               host        : 'TEST-host',
                               port        : '443',
                               path        : '/TEST/',
                               method      : 'POST',
                               badData     : 'FAILURE',
                               postRequest : 'Test message to send'
                             },
        testData           = pushoverController.postPrepare(config);

    test.deepEqual(testData, { host    : 'TEST-host',
                               port    : '443',
                               path    : '/TEST/',
                               method  : 'POST',
                               headers : {
                                'Accept'         : 'application/json',
                                'Accept-Charset' : 'utf-8',
                                'User-Agent'     : 'node-switchBoard',
                                'Content-Type'   : 'application/x-www-form-urlencoded',
                                'Content-Length' : 20
                              }
                            }, 'Additional params are filtered out.');

    test.done();
  },

  postData : function (test) {
    'use strict';

    var pushoverController = require(__dirname + '/../../../controllers/pushover'),
        config             = { token   : '1234567891',
                               userKey : '1987654321',
                               text    : 'TEST Pushover body text' },
        testData           = pushoverController.postData(config);

    test.deepEqual(testData, 'token=1234567891&user=1987654321&message=TEST%20Pushover%20body%20text', 'Additional params are filtered out and params stringified');

    test.done();
  },
};
