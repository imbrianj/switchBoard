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
 * @fileoverview Unit test for requestInit.js
 */

exports.requestInitTest = {
  requestIsStream : function (test) {
    'use strict';

    var requestInit  = require('../../../lib/requestInit'),
        requestMixed = { url : 'http://localhost/?someDevice=sTrEaM'},
        requestNo    = { url : 'http://localhost/?someDevice=VolUp'},
        requestYes   = { url : 'http://localhost/?someDevice=stream'};

    test.strictEqual(requestInit.requestIsStream(requestMixed), true,  'Stream commands are case insensitive');
    test.strictEqual(requestInit.requestIsStream(requestNo),    false, 'Non-stream commands should return false');
    test.strictEqual(requestInit.requestIsStream(requestYes),   true,  'Stream commands should return true');
    test.done();
  }
};
