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
 * @fileoverview Unit test for devices/powerView/parser.js
 */

exports.powerViewParserTest = {
  parser : function (test) {
    'use strict';

    var powerViewParser = require(__dirname + '/../../../../devices/powerView/parser'),
        markup          = '<h1>Foo</h1> <div>{{POWERVIEW_DYNAMIC}}</div>',
        value           = { scenes  : [{ icon: 'arrow-up', name : 'All Up' }, { icon: 'arrow-down', name : 'All Down' }],
                            devices : [
                              { id : 1, label : 'Living Room', state : 0, battery: 55 },
                              { id : 2, label : 'Office',      state : 100 },
                              { id : 3, label : 'Bedroom',     state : 50 }
                            ]
                          },
        fragments       = { blind  : '<li><a href="{{SUB_DEVICE_ID}}">{{SUB_DEVICE_NAME}}{{SUB_DEVICE_STATE}}<span>{{SUB_DEVICE_PERCENTAGE}}</span></li>',
                            blinds : '<ol>{{POWERVIEW_BLINDS}}</ol>',
                            scene  : '<li><a href="{{SCENE_NAME_COMMAND}}">{{SCENE_NAME}} <span>{{SCENE_ICON}}</span></li>',
                            scenes : '<ol>{{POWERVIEW_SCENES}}</ol>',
                          },
        noValue         = powerViewParser.powerView('dummy', markup, 'ok', null, fragments),
        goodMarkup      = powerViewParser.powerView('dummy', markup, 'ok', value, fragments);

    test.strictEqual(noValue.indexOf('{{'),           -1, 'All values replaced');
    test.strictEqual(noValue, '<h1>Foo</h1> <div></div>', 'Empty values vaildated');
    test.strictEqual(goodMarkup.indexOf('{{'),        -1, 'All values replaced');

    test.notStrictEqual(goodMarkup.indexOf('<li><a href="living_room">Living Room (55%)<span>0</span></li>'), -1, 'Device name and values validated 1');
    test.notStrictEqual(goodMarkup.indexOf('<li><a href="office">Office<span>100</span></li>'),               -1, 'Device name and values validated 2');
    test.notStrictEqual(goodMarkup.indexOf('<li><a href="bedroom">Bedroom<span>50</span></li>'),              -1, 'Device name and values validated 3');
    test.notStrictEqual(goodMarkup.indexOf('<li><a href="All+Up">All Up <span>arrow-up</span></li><li><a href="All+Down">All Down <span>arrow-down</span></li>'), -1, 'Scene markup validated');

    test.done();
  }
};
