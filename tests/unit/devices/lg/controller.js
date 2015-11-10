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
 * @fileoverview Unit test for devices/lg/controller.js
 */

exports.lgControllerTest = {
  hashTable : function (test) {
    'use strict';

    var lgController = require(__dirname + '/../../../../devices/lg/controller'),
        external     = lgController.hashTable.EXTERNAL,
        volUp        = lgController.hashTable.VOLUP,
        ok           = lgController.hashTable.OK;

    test.strictEqual(external, 47, 'EXTERNAL is mapped to 47');
    test.strictEqual(volUp,    24, 'VOLUP is mapped to 24');
    test.strictEqual(ok,       20, 'OK is mapped to 20');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var lgController = require(__dirname + '/../../../../devices/lg/controller'),
        postConfig   = lgController.postPrepare({ deviceIp : '127.0.0.1', devicePort : '8080' }),
        pairConfig   = lgController.postPrepare({ deviceIp : '127.0.0.1', devicePort : '8080', command : 'pair' });

    test.deepEqual(postConfig, { host : '127.0.0.1',
                                 port : '8080',
                                 path : '/udap/api/command',
                                 method : 'POST',
                                 headers : { 'content-type'  : 'text/xml; charset=utf-8',
                                             'accept'        : 'text/xml',
                                             'cache-control' : 'no-cache',
                                             'pragma'        : 'no-cache',
                                             'user-agent'    : 'UDAP/2.0' } }, 'LG command validation');

    test.deepEqual(pairConfig, { host : '127.0.0.1',
                                 port : '8080',
                                 path : '/udap/api/pairing',
                                 method : 'POST',
                                 headers : { 'content-type'  : 'text/xml; charset=utf-8',
                                             'accept'        : 'text/xml',
                                             'cache-control' : 'no-cache',
                                             'pragma'        : 'no-cache',
                                             'user-agent'    : 'UDAP/2.0' } }, 'LG command validation');

    test.done();
  },

  postPairData : function (test) {
    'use strict';

    var lgController = require(__dirname + '/../../../../devices/lg/controller'),
        postData     = lgController.postPairData({ pairKey : '123456' });

    test.notStrictEqual(postData.indexOf('<value>123456</value>'), -1, 'Command should have a pair key');

    test.done();
  },

  postData : function (test) {
    'use strict';

    var lgController = require(__dirname + '/../../../../devices/lg/controller'),
        postData     = lgController.postData({ command : 20 });

    test.notStrictEqual(postData.indexOf('<value>20</value>'), -1, 'Command should have a value of 20 (for "OK")');

    test.done();
  }
};
