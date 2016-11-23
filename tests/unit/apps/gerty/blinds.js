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
 * @fileoverview Unit test for apps/gerty/blind.js
 */

exports.blindTest = {
  blinds : function (test) {
    'use strict';

    var blinds     = require(__dirname + '/../../../../apps/gerty/blinds'),
        deviceGood = blinds.blinds({ value : { devices : [{ percentage : 90 }, { percentage : 95 }]}}),
        deviceBad  = blinds.blinds({ value : { devices : [{ percentage : 90 }, { percentage : 69 }]}});

    test.deepEqual(deviceGood, { entertained: 2 }, 'That\'s fun - you can enjoy your view');
    test.deepEqual(deviceBad,  { entertained: 0 }, 'Nothing special here');

    test.done();
  }
};
