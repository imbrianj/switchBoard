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
 * @fileoverview Unit test for devices/powerView/controller.js
 */

exports.powerViewControllerTest = {
  fragments : function (test) {
    'use strict';

    var powerViewController = require(__dirname + '/../../../../devices/powerView/controller'),
        fragments           = powerViewController.fragments();

    test.strictEqual(typeof fragments.blinds, 'string', 'Blinds fragment verified');
    test.strictEqual(typeof fragments.blind,  'string', 'Blind fragment verified');
    test.strictEqual(typeof fragments.scenes, 'string', 'Scenes fragment verified');
    test.strictEqual(typeof fragments.scene,  'string', 'Scene fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var powerViewController = require(__dirname + '/../../../../devices/powerView/controller'),
        deviceConfig        = { deviceIp   : '127.0.0.1',
                                devicePort : '80',
                                percentage : 100,
                                blindId    : 123,
                                badData    : 'FAILURE' },
        listConfig          = { deviceIp   : '127.0.0.1',
                                devicePort : '80',
                                badData    : 'FAILURE' },
        testDevice          = powerViewController.postPrepare(deviceConfig),
        testConfig          = powerViewController.postPrepare(listConfig);

    test.deepEqual(testDevice, { host : '127.0.0.1', port : '80', path : '/api/shades/123', method : 'PUT'},  'Additional params are filtered out.');
    test.deepEqual(testConfig, { host : '127.0.0.1', port : '80', path : '/api/shades?',    method : 'GET' }, 'Additional params are filtered out.');

    test.done();
  },

  valueToPercent : function (test) {
    'use strict';

    var powerViewController = require(__dirname + '/../../../../devices/powerView/controller');

    test.strictEqual(powerViewController.valueToPercent(65535),   100,  'Convert 65535');
    test.strictEqual(powerViewController.valueToPercent(0),       0,    'Convert 0');
    test.strictEqual(powerViewController.valueToPercent(-50),     0,    'Convert -50%');
    test.strictEqual(powerViewController.valueToPercent(16384),   25,   'Convert 25%');
    test.strictEqual(powerViewController.valueToPercent(false),   0,    'Convert boolean');
    test.strictEqual(powerViewController.valueToPercent('dog'),   null, 'Convert string');

    test.strictEqual(powerViewController.valueToPercent(155, 168), 92, 'Convert other value types');

    test.done();
  },

  percentToValue : function (test) {
    'use strict';

    var powerViewController = require(__dirname + '/../../../../devices/powerView/controller');

    test.strictEqual(powerViewController.percentToValue(100),   65535, 'Convert 100%');
    test.strictEqual(powerViewController.percentToValue(999),   65535, 'Convert 999%');
    test.strictEqual(powerViewController.percentToValue(0),     0,     'Convert 0%');
    test.strictEqual(powerViewController.percentToValue(-50),   0,     'Convert -50%');
    test.strictEqual(powerViewController.percentToValue(25),    16384, 'Convert 25%');
    test.strictEqual(powerViewController.percentToValue(false), 0,     'Convert boolean');
    test.strictEqual(powerViewController.percentToValue('dog'), null,  'Convert string');

    test.done();
  },

  sortBlinds : function (test) {
    'use strict';

    var powerViewController = require(__dirname + '/../../../../devices/powerView/controller'),
        blinds              = [{label: 'Blind 1'}, {label: 'Blind 4'}, {label: 'Blind 2'}, {label: 'Blind 3'}],
        order               = ['Blind 1', 'Blind 2', 'Blind 3', 'Blind 4'],
        sorted              = powerViewController.sortBlinds(blinds, order);

    test.deepEqual(sorted, [{label: 'Blind 1'}, {label: 'Blind 2'}, {label: 'Blind 3'}, {label: 'Blind 4'}], 'Ordered blinds array');

    test.done();
  },

  findScenes : function (test) {
    'use strict';

    var powerViewController = require(__dirname + '/../../../../devices/powerView/controller'),
        scenes              = [{Tester : {icon : 'foo', devices : {something : 0, somethingElse : 100}}}, {Testing2 : {icon : 'fam', devices : {this : 0, that : 50}}}];

    test.deepEqual(powerViewController.findScenes(scenes), [{name : 'Tester', icon : 'foo'}, {name : 'Testing2', icon : 'fam'}], 'Finds scene names');

    test.done();
  }
};
