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
 * @fileoverview Unit test for controllers/nest.js
 */

State = {};

exports.nestControllerTest = {
  fragments : function(test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest'),
        fragments      = nestController.fragments();

    test.strictEqual(typeof fragments.group,      'string', 'Group fragment verified');
    test.strictEqual(typeof fragments.protect,    'string', 'Protect fragment verified');
    test.strictEqual(typeof fragments.thermostat, 'string', 'Thermostat fragment verified');

    test.done();
  },

  cToF : function (test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest');

    test.strictEqual(nestController.cToF(0),   32,  'Freezing point');
    test.strictEqual(nestController.cToF(100), 212, 'Boiling point');
    test.strictEqual(nestController.cToF(24),  75.2, 'A nice day');

    test.done();
  },

  fToC : function (test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest');

    test.strictEqual(nestController.fToC(32),   0,   'Freezing point');
    test.strictEqual(nestController.fToC(212),  100, 'Boiling point');
    test.strictEqual(nestController.fToC(75.2), 24,  'A nice day');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest'),
        postAuth       = { host    : 'TEST-host',
                           port    : '443',
                           path    : '/TEST/',
                           method  : 'POST',
                           badData : 'FAILURE',
                           auth    : { userId : 'User',
                                       token  : 'Token' } },
        getNoAuth      = { host    : 'TEST-host',
                           port    : '443',
                           path    : '/TEST/',
                           method  : 'GET',
                           badData : 'FAILURE' },
        testPostAuth   = nestController.postPrepare(postAuth),
        testGetNoAuth  = nestController.postPrepare(getNoAuth);

    test.deepEqual(testPostAuth, { host    : 'TEST-host',
                                   port    : '443',
                                   path    : '/TEST/',
                                   method  : 'POST',
                                   headers : {
                                     Accept                  : 'application/json',
                                     'Accept-Charset'        : 'utf-8',
                                     'User-Agent'            : 'node-switchBoard',
                                     'Content-Type'          : 'application/x-www-form-urlencoded',
                                     'X-nl-protocol-version' : 1,
                                     'X-nl-user-id'          : 'User',
                                     Authorization           : 'Basic Token' }
                                 }, 'Additional params are filtered out.');

    test.deepEqual(testGetNoAuth, { host    : 'TEST-host',
                                    port    : '443',
                                    path    : '/TEST/',
                                    method  : 'GET',
                                    headers : {
                                      Accept           : 'application/json',
                                      'Accept-Charset' : 'utf-8',
                                      'User-Agent'     : 'node-switchBoard',
                                      'Content-Type'   : 'application/x-www-form-urlencoded' }
                                  }, 'Additional params are filtered out.');

    test.done();
  },

  postData : function (test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest'),
        config         = { username : 'USER',
                           password : 'PASSWORD' },
        testData       = nestController.postData(config);

    test.deepEqual(testData, 'username=USER&password=PASSWORD', 'Additional params are filtered out and params stringified');

    test.done();
  },

  findLabel : function (test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest');

    test.strictEqual(nestController.findLabel('00000000-0000-0000-0000-000100000003'), 'Den',      'Translate location');
    test.strictEqual(nestController.findLabel('00000000-0000-0000-0000-00010000000f'), 'Upstairs', 'Translate location');

    test.done();
  }
};
