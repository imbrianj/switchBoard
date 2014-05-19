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
 * @fileoverview Unit test for loadController.js
 */

State = {};

exports.loadControllerTest = {
  loadControllerFile : function(test) {
    'use strict';

    var loadController   = require(__dirname + '/../../../lib/loadController'),
        controllerConfig = { typeClass : 'samsung',
                             title     : 'TEST samsung' },
        controller       = loadController.loadControllerFile(controllerConfig, 'samsung');

    test.equal(controller.controller.keymap.length, 242, 'Controller file loaded');
    test.ok((controller.markup.indexOf('control-block') !== -1), 'Controller markup loaded');

    test.done();
  },

  loadController : function(test) {
    'use strict';

    var loadController = require('../../../lib/loadController'),
        devices        = { config    : { default : 'samsung' },
                           samsung   : { title : 'TEST Samsung SmartTV' },
                           panasonic : { title : 'TEST Panasonic', disabled : true } },
        controller     = loadController.loadController(devices);

    test.deepEqual(controller.config, { default : 'samsung' }, 'Config object is not populated');
    test.ok(!controller.panasonic, 'Disabled devices are omitted');

    test.done();
  }
};