/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for staticAssets.js
 */

exports.staticAssetsTest = {
  getDirectory : function (test) {
    'use strict';

    var staticAssets = require('../../../lib/staticAssets'),
        css          = staticAssets.getDirectory('.css', '/css/TEST-min.css'),
        js           = staticAssets.getDirectory('.js', '/js/TEST-min.js'),
        roku         = staticAssets.getDirectory('.png', '/images/roku/TEST.png'),
        png          = staticAssets.getDirectory('.png', '/images/TEST/TEST.png'),
        ico          = staticAssets.getDirectory('.ico', '/images/TEST.ico'),
        woff         = staticAssets.getDirectory('.woff', '/font/TEST.woff');

    test.equal(css, 'css', 'CSS lives in the CSS directory');
    test.equal(js, 'js', 'JS lives in the JS directory');
    test.equal(roku, 'images/roku', 'Images live in their designated directories');
    test.equal(png, 'images/TEST', 'Images live in their designated directories');
    test.equal(ico, 'images', 'Icons live in the images directory');
    test.equal(woff, 'font', 'Fonts live in the fonts directory');

    test.done();
  }
};