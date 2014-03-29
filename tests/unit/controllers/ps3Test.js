/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for ps3Controller.js
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

    test.equal(PowerOn, 'date > tmp/ps3.lock && echo "Connecting to PS3" && emu 12:34:56 > /dev/null && echo "Disconnecting from PS3" && rm tmp/ps3.lock', 'PS3 PowerOn command on Linux validation');
    test.equal(PS, 'emuclient --event "PS(255)"', 'PS3 PS command on Windows validation');
    test.equal(Cross, 'emuclient --event "cross(255)" & sleep .01 && emuclient --event "cross(0)"', 'PS3 Cross command on Linux validation');
    test.equal(Square, '', 'Any command issued on SunOS should return null');
    test.equal(Triangle, '', 'Any command issued on FreeBSD should return null');
    test.equal(Square, '', 'Any command issued on OSX should return null');

    test.done();
  }
};