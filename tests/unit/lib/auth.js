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
 * @fileoverview Unit test for auth.js
 */

exports.ai = {
  generateNonce : function (test) {
    'use strict';

    var auth         = require(__dirname + '/../../../lib/auth'),
        nonceDefault = auth.generateNonce(),
        nonce64      = auth.generateNonce(64),
        nonce5       = auth.generateNonce(5);

    test.strictEqual(nonceDefault.length, 32, 'Default nonce length is 32 bytes');
    test.strictEqual(nonce64.length,      64, 'Pass 64 and should get a 64 byte nonce');
    test.strictEqual(nonce5.length,       5,  'Pass 5 and should get a 64 byte nonce');

    test.done();
  },

  md5 : function (test) {
    'use strict';

    var auth       = require(__dirname + '/../../../lib/auth'),
        md5        = auth.md5('This is a test'),
        anotherMd5 = auth.md5('This is another test');


    test.strictEqual(md5,        'ce114e4501d2f4e2dcea3e17b546f339', 'MD5 summed');
    test.strictEqual(anotherMd5, 'a87edc4866a7e4257e5912ba9735d20e', 'Different string doesn\'t match');

    test.done();
  }
};
