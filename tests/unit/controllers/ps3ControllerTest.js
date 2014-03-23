/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for ps3Controller.js
 */

exports.ps3ControllerTest = {
  translateCommand : function (test) {
    'use strict';

    var ps3Controller = require(__dirname + '/../../../controllers/ps3Controller.js'),
        PowerOn       = ps3Controller.translateCommand('PowerOn', '12:34:56'),
        PS            = ps3Controller.translateCommand('PS', '12:34:56'),
        Cross         = ps3Controller.translateCommand('Cross', '12:34:56');

    test.equal(PowerOn, 'date > tmp/ps3.lock && echo "Connecting to PS3" && emu 12:34:56 > /dev/null && echo "Disconnecting from PS3" && rm tmp/ps3.lock', 'PS3 PowerOn command validation');
    test.equal(PS, 'emuclient --event "PS(255)"', 'PS3 PS command validation');
    test.equal(Cross, 'emuclient --event "cross(255)" & sleep .01 && emuclient --event "cross(0)"', 'PS3 Cross command validation');

    test.done();
  }
};