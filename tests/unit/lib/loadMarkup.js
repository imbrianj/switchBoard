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
 * @fileoverview Unit test for loadMarkup.js
 */

exports.loadMarkupTest = {
  loadTemplates : function (test) {
    'use strict';

    var loadMarkup  = require('../../../lib/loadMarkup'),
        controllers = { config  : { theme      : 'TEST-theme', default : 'samsung' },
                        samsung : { config     : { deviceId  : 'TEST-deviceId',
                                                   typeClass : 'samsung',
                                                   title     : 'TEST-title' } },
                        speech  : { config     : { deviceId  : 'Test-deviceId2',
                                                   typeClass : 'speech' } },
                        nest    : { config     : { deviceId  : 'Test-deviceId3',
                                                   typeClass : 'nest' },
                                    markup     : 'TESTING1',
                                    fragments  : { group   : 'TESTING2',
                                                   protect : 'TESTING3' } } },
        templates    = loadMarkup.loadTemplates(controllers);

    test.strictEqual(typeof templates.samsung.fragments,      'undefined', 'Samsung has no template fragments');
    test.strictEqual(typeof templates.speech.fragments,       'undefined', 'Speech has no template fragments');
    test.strictEqual(typeof templates.nest.fragments,         'object',    'Nest has template fragments');
    test.strictEqual(typeof templates.nest.fragments.group,   'string',    'Nest has a "group" fragment');
    test.strictEqual(typeof templates.nest.fragments.protect, 'string',    'Nest has a "protect" fragment');

    test.done();
  },

  loadMarkup : function (test) {
    'use strict';

    var fs          = require('fs'),
        loadMarkup  = require('../../../lib/loadMarkup'),
        template    = fs.readFileSync(__dirname + '/../../../templates/markup.html', 'utf-8'),
        controllers = { config  : { theme  : 'TEST-theme', default : 'samsung' },
                        samsung : { config : { deviceId : 'TEST-deviceId',
                                               title    : 'TEST-title' },
                                    markup : '<span>{{DEVICE_ID}} {{TEST_KEY}}</span>',
                                    controller : { onload : function (device) { return device.markup.replace('{{TEST_KEY}}', 'PASSED'); } } },
                        speech  : { config : { deviceId       : 'Test-deviceId2',
                                               title          : 'TEST-another-title',
                                               disabledMarkup : true },
                                    markup : '<span>{{DEVICE_ID}} {{TEST_KEY}}</span>',
                                    controller : { onload : function (device) { return device.markup.replace('{{TEST_KEY}}', 'This should never be printed!'); } } } },
        markup      = loadMarkup.loadMarkup(template, controllers, null);

    test.notStrictEqual(markup.indexOf('class="theme-TEST-theme"'),          -1, 'Markup theme populated');
    test.notStrictEqual(markup.indexOf('class="TEST-deviceId selected"'),    -1, 'Markup active device populated');
    test.notStrictEqual(markup.indexOf('<li class="TEST-deviceId selected"><a href="#TEST-deviceId">TEST-title</a></li>'), -1, 'Markup for nav populated');
    test.notStrictEqual(markup.indexOf('<span>TEST-deviceId PASSED</span>'), -1, 'Markup for device populated');
    test.strictEqual(markup.indexOf('This should never be printed!'),        -1, 'Module with disabled markup should be omitted');

    test.done();
  }
};
