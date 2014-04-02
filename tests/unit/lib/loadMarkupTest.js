/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for loadMarkup.js
 */

exports.loadMarkupTest = {
  loadMarkup : function (test) {
    'use strict';

    var fs          = require('fs'),
        loadMarkup  = require('../../../lib/loadMarkup'),
        template    = fs.readFileSync(__dirname + '/../../../templates/markup.html').toString(),
        controllers = { config  : { theme  : 'TEST-theme', default : 'TEST-default' },
                        samsung : { config : { deviceId : 'TEST-deviceId',
                                               title    : 'TEST-title' },
                                    markup : '<span>{{DEVICE_ID}} {{TEST_KEY}}</span>',
                                    controller : { onload : function(device) { return device.markup.replace('{{TEST_KEY}}', 'PASSED'); } } },
                        speech  : { config : { deviceId      : 'Test-deviceId2',
                                               title         : 'TEST-another-title',
                                               disableMarkup : true },
                                    markup : '<span>{{DEVICE_ID}} {{TEST_KEY}}</span>',
                                    controller : { onload : function(device) { return device.markup.replace('{{TEST_KEY}}', 'This should never be printed!'); } } } },
        markup      = loadMarkup.loadMarkup(template, controllers, null);

    test.ok((markup.indexOf('class="theme-TEST-theme"') !== -1), 'Markup theme populated');
    test.ok((markup.indexOf('class="TEST-default"') !== -1),     'Markup active device populated');
    test.ok((markup.indexOf('<li class="TEST-deviceId"><a href="#TEST-deviceId">TEST-title</a></li>') !== -1), 'Markup for nav populated');
    test.ok((markup.indexOf('<span>TEST-deviceId PASSED</span>') !== -1), 'Markup for device populated');
    test.ok((markup.indexOf('This should never be printed!') !== -1), 'Module with disabled markup should be omitted');

    test.done();
  }
};