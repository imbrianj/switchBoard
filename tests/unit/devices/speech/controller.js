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
 * @fileoverview Unit test for devices/speech/controller.js
 */

exports.speechControllerTest = {
  translateCommand : function (test) {
    'use strict';

    var speechController = require(__dirname + '/../../../../devices/speech/controller'),
        femaleBSD        = speechController.translateCommand('female', 'TEST female voice on FreeBSD', 'freebsd'),
        maleLinux        = speechController.translateCommand('male',   'TEST male voice on Linux',     'linux'),
        maleDarwin       = speechController.translateCommand('male',   'TEST male voice on Darwin',    'darwin'),
        femaleDarwin     = speechController.translateCommand('female', 'TEST female voice on Darwin',  'darwin'),
        maleWin32        = speechController.translateCommand('male',   'TEST male voice on Win32',     'win32');

    test.deepEqual(femaleBSD,    { command : 'espeak', params : ['-ven+f3', 'TEST female voice on FreeBSD'] },    'Female voice on FreeBSD validation');
    test.deepEqual(maleLinux,    { command : 'espeak', params : ['TEST male voice on Linux'] },                   'Male voice on Linux validation');
    test.deepEqual(maleDarwin,   { command : 'say',    params : ['TEST male voice on Darwin'] },                  'Male voice on Darwin validation');
    test.deepEqual(femaleDarwin, { command : 'say',    params : ['-v', 'vicki', 'TEST female voice on Darwin'] }, 'Female voice on Darwin validation');
    test.strictEqual(maleWin32,  '',                                                                              'Male Win32 should return null as it\'s not supported');

    test.done();
  }
};
