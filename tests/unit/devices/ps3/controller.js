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
 * @fileoverview Unit test for devices/ps3/controller.js
 */

exports.ps3ControllerTest = {
  translateCommand : function (test) {
    'use strict';

    var ps3Controller = require(__dirname + '/../../../../devices/ps3/controller'),
        PowerOn       = ps3Controller.translateCommand('POWERON',  '12:34:56', '127.0.0.1', '8181', 'linux'),
        PS            = ps3Controller.translateCommand('PS',       '12:34:56', '127.0.0.1', '8181', 'win32'),
        Cross         = ps3Controller.translateCommand('CROSS',    '12:34:56', '127.0.0.1', '8181', 'linux'),
        Square        = ps3Controller.translateCommand('SQUARE',   '12:34:56', '127.0.0.1', '8181', 'sunos'),
        Triangle      = ps3Controller.translateCommand('TRIANGLE', '12:34:56', '127.0.0.1', '8181', 'freebsd'),
        Left          = ps3Controller.translateCommand('LEFT',     '12:34:56', '127.0.0.1', '8181', 'darwin'),
        L1            = ps3Controller.translateCommand('L1',       '12:34:56', '127.0.0.1', '8181', 'linux'),
        L2            = ps3Controller.translateCommand('L2',       '12:34:56', '127.0.0.1', '8181', 'linux'),
        R1            = ps3Controller.translateCommand('R1',       '12:34:56', '127.0.0.1', '8181', 'linux'),
        R2            = ps3Controller.translateCommand('R2',       '12:34:56', '127.0.0.1', '8181', 'linux'),
        BadCommand    = ps3Controller.translateCommand('B2',       '12:34:56', '127.0.0.1', '8181', 'linux');

    test.deepEqual(PowerOn,      { command : 'gimx', params : ['--type', 'Sixaxis', '--src', '127.0.0.1:8181', '--bdaddr', '12:34:56'] }, 'PS3 PowerOn command on Linux validation');
    test.deepEqual(PS,           { command : 'gimx', params : ['--dst', '127.0.0.1:8181', '--event', 'PS(255)'] },                        'PS3 PS command on Windows validation');
    test.deepEqual(Cross,        { command : 'gimx', params : ['--dst', '127.0.0.1:8181', '--event', 'cross(255)'] },                     'PS3 Cross command on Linux validation');
    test.deepEqual(L1,           { command : 'gimx', params : ['--dst', '127.0.0.1:8181', '--event', 'l1(255)'] },                     'PS3 Cross command on Linux validation');
    test.deepEqual(L2,           { command : 'gimx', params : ['--dst', '127.0.0.1:8181', '--event', 'l2(255)'] },                     'PS3 Cross command on Linux validation');
    test.deepEqual(R1,           { command : 'gimx', params : ['--dst', '127.0.0.1:8181', '--event', 'r1(255)'] },                     'PS3 Cross command on Linux validation');
    test.deepEqual(R2,           { command : 'gimx', params : ['--dst', '127.0.0.1:8181', '--event', 'r2(255)'] },                     'PS3 Cross command on Linux validation');
    test.strictEqual(Square,     '', 'Any command issued on SunOS should return null');
    test.strictEqual(Triangle,   '', 'Any command issued on FreeBSD should return null');
    test.strictEqual(Square,     '', 'Any command issued on OSX should return null');
    test.strictEqual(BadCommand, '', 'Any bad command issued should return null');

    test.done();
  }
};
