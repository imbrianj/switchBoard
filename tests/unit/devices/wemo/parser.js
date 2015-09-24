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
 * @fileoverview Unit test for devices/wemo/parser.js
 */

exports.wemoParserTest = {
  parser : function (test) {
    'use strict';

    var wemoParser = require(__dirname + '/../../../../devices/wemo/parser'),
        markup            = '<h1>Foo</h1> <div>{{WEMO_DYNAMIC}}</div>',
        value             = { groups  : { 'GROUP1' : ['Label Foo', 'Label Bar'],
                                          'GROUP2' : ['Label Baz', 'Label Bang', 'Label Bif'],
                                          'GROUP3' : ['Label Bam'] },
                              devices : { 'FOO'  : { type : 'switch', state : 'on',  label : 'Label Foo' },
                                          'BAR'  : { type : 'switch', state : 'off', label : 'Label Bar' },
                                          'BAZ'  : { type : 'switch', state : 'on',  label : 'Label Baz' },
                                          'BANG' : { type : 'switch', state : 'off', label : 'Label Bang' },
                                          'BIF'  : { type : 'switch', state : 'off', label : 'Label Bif' },
                                          'BAM'  : { type : 'switch', state : 'on',  label : 'Label Bam' },
                                          }
                            },
        ungrouped         = { devices : { 'FOO'  : { type : 'switch', state : 'on',  label : 'Label Foo' },
                                          'BAR'  : { type : 'switch', state : 'off', label : 'Label Bar' },
                                          'BAZ'  : { type : 'switch', state : 'on',  label : 'Label Baz' },
                                          'BANG' : { type : 'switch', state : 'off', label : 'Label Bang' },
                                          'BIF'  : { type : 'switch', state : 'off', label : 'Label Bif' },
                                          'BAM'  : { type : 'switch', state : 'on',  label : 'Label Bam' },
                                          }
                            },
        fragments         = { switch   : '<a href="/?TEST=subdevice-toggle-{{SUB_DEVICE_ID}}" class="fa fa-lightbulb-o{{SUB_DEVICE_STATE}}"><span>{{SUB_DEVICE_NAME}}</span></a>',
                              group    : '<li class="sub-device-group {{GROUP_CLASS}}"><h4>{{GROUP_TITLE}}</h4><ul>{{SUB_DEVICE_LIST}}</ul></li>' },
        goodMarkup        = wemoParser.wemo('dummy', markup, 'ok', value, fragments),
        ungroupedMarkup   = wemoParser.wemo('dummy', markup, 'ok', ungrouped, fragments),
        noValue           = wemoParser.wemo('dummy', markup, 'ok', null, fragments);

    test.strictEqual(goodMarkup.indexOf('{{'),        -1, 'All values replaced');

    test.notStrictEqual(goodMarkup.indexOf('<h4>GROUP1</h4><ul><a href="/?TEST=subdevice-toggle-Label+Foo" class="fa fa-lightbulb-o device-active"><span>Label Foo</span></a><a href="/?TEST=subdevice-toggle-Label+Bar" class="fa fa-lightbulb-o"><span>Label Bar</span>'),                                                                                                   -1, 'Passed markup validation 1');
    test.notStrictEqual(goodMarkup.indexOf('<h4>GROUP2</h4><ul><a href="/?TEST=subdevice-toggle-Label+Baz" class="fa fa-lightbulb-o device-active"><span>Label Baz</span></a><a href="/?TEST=subdevice-toggle-Label+Bang" class="fa fa-lightbulb-o"><span>Label Bang</span></a><a href="/?TEST=subdevice-toggle-Label+Bif" class="fa fa-lightbulb-o"><span>Label Bif</span>'), -1, 'Passed markup validation 2');
    test.notStrictEqual(goodMarkup.indexOf('<h4>GROUP3</h4><ul><a href="/?TEST=subdevice-toggle-Label+Bam" class="fa fa-lightbulb-o device-active"><span>Label Bam</span>'),                                                                                                                                                                                                   -1, 'Passed markup validation 3');

    test.strictEqual(ungroupedMarkup.indexOf('{{'),   -1, 'All values replaced');
    test.strictEqual(ungroupedMarkup.indexOf('<h4>'), -1, 'No group headers printed');

    test.strictEqual(noValue.indexOf('{{'),           -1, 'All values replaced');
    test.strictEqual(noValue, '<h1>Foo</h1> <div></div>', 'Passed markup validated');

    test.done();
  }
};
