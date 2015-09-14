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
 * @fileoverview Unit test for controllers/twitter.js
 */

exports.twitterControllerTest = {
  fragments : function (test) {
    'use strict';

    var twitterController = require(__dirname + '/../../../controllers/twitter'),
        fragments         = twitterController.fragments();

    test.strictEqual(typeof fragments.tweet,  'string', 'Tweet fragment verified');

    test.done();
  },

  generateNonce : function (test) {
    'use strict';

    var twitterController = require(__dirname + '/../../../controllers/twitter'),
        nonceDefault      = twitterController.generateNonce(),
        nonce64           = twitterController.generateNonce(64),
        nonce5            = twitterController.generateNonce(5);

    test.strictEqual(nonceDefault.length, 32, 'Default nonce length is 32 bytes');
    test.strictEqual(nonce64.length,      64, 'Pass 64 and should get a 64 byte nonce');
    test.strictEqual(nonce5.length,       5,  'Pass 5 and should get a 64 byte nonce');

    test.done();
  },

  generateSignature : function (test) {
    'use strict';

    var twitterController = require(__dirname + '/../../../controllers/twitter'),
        config            = { method       : 'get',
                              port         : 443,
                              host         : 'api.twitter.com',
                              path         : '/1.1/statuses/mentions_timeline.json',
                              maxCount     : 5,
                              consumerKey  : '123456',
                              nonce        : '123456',
                              sigMethod    : 'HMAC-SHA1',
                              timestamp    : 12345678,
                              accessToken  : '123456',
                              oauthVersion : '1.0',
                              consumerSec  : '123456',
                              oauthSec     : '123456' },
        signature         = twitterController.generateSignature(config);

    test.strictEqual(signature, '5QMMYaJWgY33ZzHv9lECRFZaSdA%3D', 'Signature should match');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var twitterController = require(__dirname + '/../../../controllers/twitter'),
        config            = { method       : 'get',
                              port         : 443,
                              host         : 'api.twitter.com',
                              path         : '/1.1/statuses/mentions_timeline.json',
                              maxCount     : 5,
                              consumerKey  : '123456',
                              nonce        : '123456',
                              sigMethod    : 'HMAC-SHA1',
                              timestamp    : 12345678,
                              accessToken  : '123456',
                              garbage      : 'This shouldn\'t be here',
                              oauthVersion : '1.0',
                              consumerSec  : '123456',
                              oauthSec     : '123456' },
        testData           = twitterController.postPrepare(config);

    test.deepEqual(testData, { host : 'api.twitter.com',
                               port : 443,
                               path : '/1.1/statuses/mentions_timeline.json?count=5',
                               method : 'get',
                               headers : {
                                 Accept: 'application/json',
                                 'Accept-Charset': 'utf-8',
                                 'User-Agent': 'node-switchBoard',
                                 'Content-Type': 'application/x-www-form-urlencoded',
                                 Connection: 'keep-alive',
                                 Authorization: 'OAuth oauth_consumer_key="123456", oauth_nonce="123456", oauth_signature="5QMMYaJWgY33ZzHv9lECRFZaSdA%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="12345678", oauth_token="123456", oauth_version="1.0"'
                               }
                             }, 'Additional params are filtered out - sig generated and Auth properly formatted.');

    test.done();
  }
};
