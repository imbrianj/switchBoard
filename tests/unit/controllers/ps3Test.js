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
 * @fileoverview Unit test for controllers/ps3.js
 */

exports.ps3ControllerTest = {
  translateCommand : function (test) {
    'use strict';

    var ps3Controller = require(__dirname + '/../../../controllers/ps3'),
        PowerOn       = ps3Controller.translateCommand('PowerOn',  '12:34:56', 'linux'),
        PS            = ps3Controller.translateCommand('PS',       '12:34:56', 'win32'),
        Cross         = ps3Controller.translateCommand('Cross',    '12:34:56', 'linux'),
        Square        = ps3Controller.translateCommand('Square',   '12:34:56', 'sunos'),
        Triangle      = ps3Controller.translateCommand('Triangle', '12:34:56', 'freebsd'),
        Left          = ps3Controller.translateCommand('Left',     '12:34:56', 'darwin');

    test.deepEqual(PowerOn, { command : 'emu',       params : ['12:34:56'] },              'PS3 PowerOn command on Linux validation');
    test.deepEqual(PS,      { command : 'emuclient', params : ['--event', 'PS(255)'] },    'PS3 PS command on Windows validation');
    test.deepEqual(Cross,   { command : 'emuclient', params : ['--event', 'cross(255)'] }, 'PS3 Cross command on Linux validation');
    test.equal(Square,   '', 'Any command issued on SunOS should return null');
    test.equal(Triangle, '', 'Any command issued on FreeBSD should return null');
    test.equal(Square,   '', 'Any command issued on OSX should return null');

    test.done();
  }
};