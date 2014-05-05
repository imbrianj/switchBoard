/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for controllers/smartthings.js
 */

exports.smartthingsControllerTest = {
  translateCommand : function (test) {
    'use strict';

    var smartthingsController = require(__dirname + '/../../../controllers/smartthings'),
        config                = { host    : 'TEST-host',
                                  port    : '443',
                                  path    : '/TEST/',
                                  method  : 'GET',
                                  badData : 'FAILURE' },
        subDevicesRepeat      = { 0 : { label : 'Some Light' }, 1 : { label : 'Some Light' }, 2 : { label : 'Light 3' } },
        subDevicesUnique      = { 0 : { label : 'Light 1' },    1 : { label : 'Light 2' },    2 : { label : 'Light 3' } },
        testSubDevicesRepeat  = smartthingsController.findSubDevices('Some Light', subDevicesRepeat),
        testSubDevicesUnique  = smartthingsController.findSubDevices('Light 2',    subDevicesUnique),
        testPostPrepare       = smartthingsController.postPrepare(config);

    test.deepEqual(testSubDevicesRepeat, [ { label: 'Some Light' }, { label: 'Some Light' } ], 'Two lights should be returned if they both have the same name');
    test.deepEqual(testSubDevicesUnique, [ { label: 'Light 2' } ],                             'Only one light is returned as its unique');
    test.deepEqual(testPostPrepare, { host : 'TEST-host', port : '443', path : '/TEST/', method : 'GET', headers : { 'Accept': 'application/json', 'Accept-Charset' : 'utf-8', 'User-Agent' : 'node-universal-controller' } }, 'Additional params are filtered out.');

    test.done();
  }
};