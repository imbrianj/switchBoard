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
 * @fileoverview Unit test for sharedUtil.js
 */

exports.sharedUtilTest = {
  replaceAll : function (test) {
    'use strict';

    var util = require(__dirname + '/../../../lib/sharedUtil').util;

    test.strictEqual(util.replaceAll('Test test testing', 'test', 'Test'), 'Test Test Testing', 'Replace multiple instances of a substring');
    test.strictEqual(util.replaceAll(455, '4', '5'),                       455,                 'Don\'t choke on non-strings');

    test.done();
  },

  stripTags : function (test) {
    'use strict';

    var util = require(__dirname + '/../../../lib/sharedUtil').util;

    test.strictEqual(util.stripTags(12),                                          12,        'Don\'t choke on non-strings');
    test.strictEqual(util.stripTags('<span>Test</span>'),                         'Test',    'Text without HTML tags');
    test.strictEqual(util.stripTags('<a href="#" onclick="alert()">Testing</a>'), 'Testing', 'Text without HTML tags');

    test.strictEqual(util.sanitize(12),                                           12,        'Don\'t choke on non-strings');
    test.strictEqual(util.sanitize('<span>Test</span>'),                          'Test',    'Text without HTML tags');
    test.strictEqual(util.sanitize('<a href="#" onclick="alert()">Testing</a>'),  'Testing', 'Text without HTML tags');

    test.done();
  },

  sanitize : function (test) {
    'use strict';

    var util = require(__dirname + '/../../../lib/sharedUtil').util;

    test.strictEqual(util.sanitize(12),                                          12,        'Don\'t choke on non-strings');
    test.strictEqual(util.sanitize('<span>Test</span>'),                         'Test',    'Text without HTML tags');
    test.strictEqual(util.sanitize('<a href="#" onclick="alert()">Testing</a>'), 'Testing', 'Text without HTML tags');

    test.strictEqual(util.sanitize(12),                                           12,        'Don\'t choke on non-strings');
    test.strictEqual(util.sanitize('<span>Test</span>'),                          'Test',    'Text without HTML tags');
    test.strictEqual(util.sanitize('<a href="#" onclick="alert()">Testing</a>'),  'Testing', 'Text without HTML tags');

    test.done();
  },

  encodeName : function (test) {
    'use strict';

    var util = require(__dirname + '/../../../lib/sharedUtil').util;

    test.strictEqual(util.encodeName(' \' $ This is a bad %^ ! name()'), '_____this_is_a_bad______name__', 'Name encoded');
    test.strictEqual(util.encodeName('ThisIsAGoodName'),                 'thisisagoodname',                'Name encoded');

    test.done();
  },

  translate : function (test) {
    'use strict';

    var util = require(__dirname + '/../../../lib/sharedUtil').util;

    test.strictEqual(util.translate('THERMOSTAT', 'nest', 'en'), 'Thermostat', 'Token translated');

    test.done();
  },

  arrayList : function (test) {
    'use strict';

    var util = require(__dirname + '/../../../lib/sharedUtil').util;

    test.strictEqual(util.arrayList(['One', 'Two', 'Three'], 'nest', 'en'), 'One, Two and Three', 'Long list');
    test.strictEqual(util.arrayList(['One', 'Two'],          'nest', 'en'), 'One and Two',        'Short list');
    test.strictEqual(util.arrayList(['One'],                 'nest', 'en'), 'One',                'Single item');

    test.done();
  },

  displayRelativeTime : function (test) {
    'use strict';

    var util  = require(__dirname + '/../../../lib/sharedUtil').util,
        short = util.displayRelativeTime(10),
        long  = util.displayRelativeTime(10000000);

    test.strictEqual(short, '00 00:00:10',  'Relative time converted');
    test.strictEqual(long,  '115 17:46:40', 'Relative time converted');

    test.done();
  },

  displayTime : function (test) {
    'use strict';

    var util      = require(__dirname + '/../../../lib/sharedUtil').util,
        translate = function (token) {
          return token;
        },
        weekend   = new Date('July 20, 2014 12:00:00'),
        shortTime = util.displayTime(1451073600000, translate, null,   weekend),
        longTime  = util.displayTime(1451073600000, translate, 'long', weekend);

    test.strictEqual(shortTime, 'sun @ 12:00am',    'Convert time');
    test.strictEqual(longTime,  'sun 20 @ 12:00am', 'Long time should have date');

    test.done();
  },

  cToF : function (test) {
    'use strict';

    var util = require(__dirname + '/../../../lib/sharedUtil').util;

    test.strictEqual(util.cToF(0),   32,   'Freezing point');
    test.strictEqual(util.cToF(100), 212,  'Boiling point');
    test.strictEqual(util.cToF(24),  75.2, 'A nice day');

    test.done();
  },

  fToC : function (test) {
    'use strict';

    var util = require(__dirname + '/../../../lib/sharedUtil').util;

    test.strictEqual(util.fToC(32),   0,   'Freezing point');
    test.strictEqual(util.fToC(212),  100, 'Boiling point');
    test.strictEqual(util.fToC(75.2), 24,  'A nice day');

    test.done();
  },
};
