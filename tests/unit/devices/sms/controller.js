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
 * @fileoverview Unit test for devices/sms/controller.js
 */

exports.smsControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var smsController = require(__dirname + '/../../../../devices/sms/controller'),
        config        = { twilioSid   : 'TEST-sid',
                          twilioToken : 'TEST-token',
                          host        : 'TEST-host',
                          port        : '443',
                          path        : '/TEST/',
                          method      : 'POST',
                          badData     : 'FAILURE',
                          postRequest : 'Test message to send'
                        },
        testData      = smsController.postPrepare(config);

    test.deepEqual(testData, { host    : 'TEST-host',
                               port    : '443',
                               path    : '/TEST/',
                               method  : 'POST',
                               auth    : 'TEST-sid:TEST-token',
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

    var smsController = require(__dirname + '/../../../../devices/sms/controller'),
        config        = { twilioPhone : '1234567891',
                          phone       : '1987654321',
                          text        : 'TEST SMS body text' },
        testData      = smsController.postData(config);

    test.deepEqual(testData, 'From=1234567891&To=1987654321&Body=TEST%20SMS%20body%20text', 'Additional params are filtered out and params stringified');

    test.done();
  }
};
