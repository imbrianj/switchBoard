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
 * @fileoverview Unit test for apps/gerty/mood.js
 */

exports.moodTest = {
  deriveMoodLove : function (test) {
    'use strict';

    var mood        = require(__dirname + '/../../../../apps/gerty/mood'),
        deviceLove  = { social : 8 },
        controllers = {},
        loveMood    = mood.deriveMood(deviceLove, controllers);

    test.strictEqual(loveMood.emotion, 'LOVE', 'You should feel loved');

    test.done();
  },

  deriveMoodScared : function (test) {
    'use strict';

    var mood         = require(__dirname + '/../../../../apps/gerty/mood'),
        deviceScared = { scared : -15, social : 5, excited : 10 },
        controllers  = {},
        scaredMood   = mood.deriveMood(deviceScared, controllers);

    test.strictEqual(scaredMood.emotion, 'SCARED', 'Fear trumps all emotion');

    test.done();
  },

  deriveMoodIndifferent : function (test) {
    'use strict';

    var mood              = require(__dirname + '/../../../../apps/gerty/mood'),
        deviceIndifferent = { entertained : -3, excited : -3 },
        controllers       = {},
        indifferentMood   = mood.deriveMood(deviceIndifferent, controllers);

    test.strictEqual(indifferentMood.emotion, 'INDIFFERENT', 'Not very excited, not very comfortable.  You\'re pretty indifferent');

    test.done();
  },

  deriveMoodSad : function (test) {
    'use strict';

    var mood        = require(__dirname + '/../../../../apps/gerty/mood'),
        deviceSad   = { comfortable : -4 },
        controllers = {},
        sadMood     = mood.deriveMood(deviceSad, controllers);

    test.strictEqual(sadMood.emotion, 'SAD', 'If you don\'t feel comfortable, it makes robots sad :(');

    test.done();
  }
};
