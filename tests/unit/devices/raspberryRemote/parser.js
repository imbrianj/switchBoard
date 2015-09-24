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
 * @fileoverview Unit test for devices/raspberryRemote/parser.js
 */

exports.raspberryRemoteParserTest = {
  parser : function (test) {
    'use strict';

    var raspberryRemoteParser = require(__dirname + '/../../../../devices/raspberryRemote/parser'),
        markup                = '<h1>Foo</h1> <ul>{{RASPBERRY_REMOTE_DYNAMIC}}</ul>',
        value                 = { devices : { 0 : { id : 1, label : 'Lights' },
                                              1 : { id : 3, label : 'Television' } } },
        fragments             = { switch : '<li><h2>{{SUB_DEVICE_NAME}}</h2><a href="/?{{DEVICE_ID}}=subdevice-on-{{SUB_DEVICE_ID}}" class="fa fa-lightbulb-o device-active" title="{{SUB_DEVICE_NAME}}"><span>{{i18n_ON}}</span></a> <a href="/?{{DEVICE_ID}}=subdevice-off-{{SUB_DEVICE_ID}}" class="fa fa-lightbulb-o" title="{{SUB_DEVICE_NAME}}"><span>{{i18n_OFF}}</span></a></li>' },
        goodMarkup            = raspberryRemoteParser.raspberryRemote('dummy', markup, 'ok', value, fragments),
        badMarkup             = raspberryRemoteParser.raspberryRemote('dummy', markup, 'ok', null,  fragments);

    test.notStrictEqual(goodMarkup.indexOf('<li><h2>Lights</h2><a href="/?{{DEVICE_ID}}=subdevice-on-Lights" class="fa fa-lightbulb-o device-active" title="Lights"><span>{{i18n_ON}}</span></a> <a href="/?{{DEVICE_ID}}=subdevice-off-Lights" class="fa fa-lightbulb-o" title="Lights"><span>{{i18n_OFF}}</span></a></li>'),                     -1, 'Passed markup validated');
    test.notStrictEqual(goodMarkup.indexOf('<li><h2>Television</h2><a href="/?{{DEVICE_ID}}=subdevice-on-Television" class="fa fa-lightbulb-o device-active" title="Television"><span>{{i18n_ON}}</span></a> <a href="/?{{DEVICE_ID}}=subdevice-off-Television" class="fa fa-lightbulb-o" title="Television"><span>{{i18n_OFF}}</span></a></li>'), -1, 'Passed markup validated');
    test.strictEqual(badMarkup.indexOf('{{'),         -1, 'All values replaced');
    test.strictEqual(badMarkup, '<h1>Foo</h1> <ul></ul>', 'Passed markup validated');

    test.done();
  }
};
