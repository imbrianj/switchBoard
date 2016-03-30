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
 * @fileoverview Unit test for devices/smartthings/parser.js
 */

exports.smartthingsParserTest = {
  parser : function (test) {
    'use strict';

    var smartthingsParser = require(__dirname + '/../../../../devices/smartthings/parser'),
        markup            = '<h1>Foo</h1> <div>{{SMARTTHINGS_DYNAMIC}}</div>',
        value             = { groups  : { 'GROUP1' : ['Label Foo', 'Label Bar'],
                                          'GROUP2' : ['Label Baz', 'Label Bang', 'Label Bif'],
                                          'GROUP3' : ['Label Bam + Temp'] },
                              mode    : 'Home',
                              devices : { 'FOO'  : { type : 'switch',   state : 'on',  label : 'Label Foo' },
                                          'BAR'  : { type : 'lock',     state : 'off', label : 'Label Bar' },
                                          'BAZ'  : { type : 'contact',  state : 'on',  label : 'Label Baz', peripheral : { temp : 70 } },
                                          'BANG' : { type : 'water',    state : 'off', label : 'Label Bang' },
                                          'BIF'  : { type : 'motion',   state : 'off', label : 'Label Bif' },
                                          'BAM'  : { type : 'presence', state : 'on',  label : 'Label Bam + Temp', peripheral : { temp : 70 } },
                                          }
                            },
        ungrouped         = { mode    : 'Away',
                              devices : { 'FOO'  : { type : 'switch',   state : 'on',  label : 'Label Foo' },
                                          'BAR'  : { type : 'lock',     state : 'off', label : 'Label Bar' },
                                          'BAZ'  : { type : 'contact',  state : 'on',  label : 'Label Baz', peripheral : { temp : 70 } },
                                          'BANG' : { type : 'water',    state : 'off', label : 'Label Bang' },
                                          'BIF'  : { type : 'motion',   state : 'off', label : 'Label Bif' },
                                          'BAM'  : { type : 'presence', state : 'on',  label : 'Label Bam + Temp', peripheral : { temp : 70 } },
                                          }
                            },
        fragments         = { action   : '<a href="/?TEST=subdevice-toggle-{{SUB_DEVICE_ID}}" class="fa {{SUB_DEVICE_CLASS}}{{SUB_DEVICE_STATE}}"><span>{{SUB_DEVICE_NAME}}</span></a>',
                              static   : '<span class="fa {{SUB_DEVICE_CLASS}}{{SUB_DEVICE_STATE}}"><span>{{SUB_DEVICE_NAME}}</span></span>',
                              group    : '<li class="sub-device-group {{GROUP_CLASS}}"><h4>{{GROUP_TITLE}}</h4><ul>{{SUB_DEVICE_LIST}}</ul></li>' },
        goodMarkup        = smartthingsParser.smartthings('dummy', markup, 'ok', value, fragments),
        ungroupedMarkup   = smartthingsParser.smartthings('dummy', markup, 'ok', ungrouped, fragments),
        noValue           = smartthingsParser.smartthings('dummy', markup, 'ok', null, fragments);

    test.strictEqual(goodMarkup.indexOf('{{'),        -1, 'All values replaced');

    test.notStrictEqual(goodMarkup.indexOf('<h4>GROUP1</h4><ul><a href="/?TEST=subdevice-toggle-Label+Foo" class="fa fa-lightbulb-o device-active"><span>Label Foo</span></a><a href="/?TEST=subdevice-toggle-Label+Bar" class="fa fa-unlock-alt"><span>Label Bar</span></a>'), -1, 'Passed markup validation 1');
    test.notStrictEqual(goodMarkup.indexOf('<h4>GROUP2</h4><ul><span class="fa fa-columns device-active"><span>Label Baz (70&deg;)</span></span><span class="fa fa-tint"><span>Label Bang</span></span><span class="fa fa-paw"><span>Label Bif</span></span>'),                 -1, 'Passed markup validation 2');
    test.notStrictEqual(goodMarkup.indexOf('<h4>GROUP3</h4><ul><span class="fa fa-male device-active"><span>Label Bam + Temp (70&deg;)</span></span>'),                                                                                                                         -1, 'Passed markup validation 3');

    test.strictEqual(ungroupedMarkup.indexOf('{{'),   -1, 'All values replaced');
    test.strictEqual(ungroupedMarkup.indexOf('<h4>'), -1, 'No group headers printed');

    test.strictEqual(noValue.indexOf('{{'),           -1, 'All values replaced');
    test.strictEqual(noValue, '<h1>Foo</h1> <div></div>', 'Passed markup validated');

    test.done();
  }
};
