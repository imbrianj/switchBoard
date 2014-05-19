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
 * @fileoverview Unit test for controllers/mp3.js
 */

exports.mp3ControllerTest = {
  translateCommand : function (test) {
    'use strict';

    var mp3Controller = require(__dirname + '/../../../controllers/mp3'),
        BSD           = mp3Controller.translateCommand('foo', 'freebsd'),
        Linux         = mp3Controller.translateCommand('foo', 'linux'),
        Darwin        = mp3Controller.translateCommand('foo', 'darwin'),
        Win32         = mp3Controller.translateCommand('foo', 'win32');

    test.equal(BSD, 'mpg123 foo', 'MP3 on FreeBSD validation');
    test.equal(Linux, 'mpg123 foo', 'MP3 on Linux validation');
    test.equal(Darwin, 'afplay foo', 'MP3 on Darwin validation');
    test.equal(Win32, '', 'Win32 should return null as it\'s not supported');

    test.done();
  }
};