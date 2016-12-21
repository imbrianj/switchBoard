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
 * @fileoverview Unit test for devices/gerty/controllers.js
 */

exports.gertyControllerTest = {
  fragments : function (test) {
    'use strict';

    var gertyController = require(__dirname + '/../../../../devices/gerty/controller'),
        fragments       = gertyController.fragments();

    test.strictEqual(typeof fragments.comment, 'string', 'Comment fragment verified');

    test.done();
  },

  getActionType : function (test) {
    'use strict';

    var gertyController = require(__dirname + '/../../../../devices/gerty/controller'),
        sleeping        = gertyController.getActionType(500, 'SLEEP');

    test.strictEqual(sleeping, '', 'If Gery is sleeping, there will never be an action');

    test.done();
  },

  getUser : function (test) {
    'use strict';

    var gertyController = require(__dirname + '/../../../../devices/gerty/controller'),
        noNames         = gertyController.getUser({ issuer : '127.0.0.1' }),
        noValidnames    = gertyController.getUser({ issuer : '192.168.1.1', names : { '192.168.2.1' : 'Won\'t Show' } }),
        replaceName     = gertyController.getUser({ issuer : '192.168.1.2', names : { '192.168.1.2' : 'Should Show' } });

    test.deepEqual(noNames,      { name : '1',           code : 'user-0' }, 'Validate simple user');
    test.deepEqual(noValidnames, { name : '1',           code : 'user-1' }, 'Validate simple user');
    test.deepEqual(replaceName,  { name : 'Should Show', code : 'user-2' }, 'Validate simple user');

    test.done();
  },

  getCorrectedText : function (test) {
    'use strict';

    var gertyController = require(__dirname + '/../../../../devices/gerty/controller'),
        nullConfig      = {},
        replaceConfig   = { corrections : { something : 'nothing', foo : 'bar', baz : 'bang' } },
        noConfig        = gertyController.getCorrectedText('no config', nullConfig),
        noTerms         = gertyController.getCorrectedText('no terms',  replaceConfig),
        someTerms       = gertyController.getCorrectedText('something changed', replaceConfig),
        allTerms        = gertyController.getCorrectedText('something foo baz foo bang', replaceConfig),
        numberTerms     = gertyController.getCorrectedText('set something 242 degrees', replaceConfig),
        emptyTerms      = gertyController.getCorrectedText(null, replaceConfig);

    test.strictEqual(noConfig,    'no config',                 'No config changes, so string remains the same');
    test.strictEqual(noTerms,     'no terms',                  'No phrases present,so string remains the same');
    test.strictEqual(someTerms,   'nothing changed',           'One small change');
    test.strictEqual(allTerms,    'nothing bar bang bar bang', 'String changed by every config');
    test.strictEqual(numberTerms, 'set nothing 42 degrees',    'String changed number to more likely meaning');
    test.strictEqual(emptyTerms,  null,                        'Doesn\'t choke on null values');

    test.done();
  }
};
