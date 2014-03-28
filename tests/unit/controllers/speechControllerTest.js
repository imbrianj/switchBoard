/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for speechController.js
 */

exports.speechControllerTest = {
  translateCommand : function (test) {
    'use strict';

    var speechController = require(__dirname + '/../../../controllers/speechController'),
        femaleBSD        = speechController.translateCommand('female', 'TEST female voice on FreeBSD', 'freebsd'),
        maleLinux        = speechController.translateCommand('male',   'TEST male voice on Linux',     'linux'),
        maleDarwin       = speechController.translateCommand('male',   'TEST male voice on Darwin',    'darwin'),
        femaleDarwin     = speechController.translateCommand('female', 'TEST female voice on Darwin',  'darwin');

    test.equal(femaleBSD, 'espeak -ven+f3 "TEST female voice on FreeBSD"', 'Female voice on FreeBSD validation');
    test.equal(maleLinux, 'espeak  "TEST male voice on Linux"', 'Male voice on Linux validation');
    test.equal(maleDarwin, 'say  "TEST male voice on Darwin"', 'Male voice on Darwin validation');
    test.equal(femaleDarwin, 'say -v vicki "TEST female voice on Darwin"', 'Feale voice on Darwin validation');

    test.done();
  }
};