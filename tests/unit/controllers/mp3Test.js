/*jslint white: true */
/*global module, String, require, console */

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