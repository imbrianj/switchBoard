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
 * @fileoverview Unit test for apps/gerty/language.js
 */

exports.languageTest = {
  getGenericDevices : function (test) {
    'use strict';

    var language    = require(__dirname + '/../../../../apps/gerty/language'),
        controllers = { 'Generic TV'  : { config : { typeClass : 'samsung' } },
                        'Another TV'  : { config : { typeClass : 'panasonic' } },
                        'PlayStation' : { config : { typeClass : 'ps3' } },
                        'Camera'      : { config : { typeClass : 'foscam' } },
                      },
        unique      = language.getGenericDevices(controllers);

    test.strictEqual(typeof unique.TV, 'undefined',   'TV is ambiguous, so it\'s not made generic');
    test.strictEqual(unique.PS3,       'PlayStation', 'You have only one PS3, so we can assume it\'s this one');
    test.strictEqual(unique.CAMERA,    'Camera',      'You have only one camera, so we can assume it\'s this one');

    test.done();
  },

  getSubDevices : function (test) {
    'use strict';

    var language    = require(__dirname + '/../../../../apps/gerty/language'),
        deviceState = require(__dirname + '/../../../../lib/deviceState'),
        iniState    = deviceState.updateState('FOO', 'faux-type', { value : { devices : { 0 : { label : 'Test Switch' },
                                                                                          1 : { label : 'Random Thing' } } } }),
        controllers = { 'FOO' : {} },
        subDevices  = language.getSubDevices(controllers);

    test.deepEqual(subDevices.FOO.subDevices, ['Test Switch', 'Random Thing'], 'Should have subdevice list populated from State var');

    test.done();
  },

  getGenericTerms : function (test) {
    'use strict';

    var language = require(__dirname + '/../../../../apps/gerty/language'),
        terms    = language.getGenericTerms('en');

    test.strictEqual(terms.PLAYSTATION, 'Playstation', 'Should have grabbed a bunch of generic device names');
    test.strictEqual(terms.TV,          'TV',          'Should have grabbed a bunch of generic device names');

    test.done();
  },

  getVerbs : function (test) {
    'use strict';

    var language = require(__dirname + '/../../../../apps/gerty/language'),
        verbs    = language.getVerbs('en');

    test.strictEqual(verbs.OFF,    'Off',    'Should have grabbed a bunch of generic verbs');
    test.strictEqual(verbs.TOGGLE, 'Toggle', 'Should have grabbed a bunch of generic verbs');

    test.done();
  },
};
