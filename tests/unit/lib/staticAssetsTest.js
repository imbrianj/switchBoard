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
 * @fileoverview Unit test for staticAssets.js
 */

exports.staticAssetsTest = {
  getDirectory : function(test) {
    'use strict';

    var staticAssets = require('../../../lib/staticAssets'),
        css          = staticAssets.getDirectory('.css', '/css/TEST-min.css'),
        js           = staticAssets.getDirectory('.js', '/js/TEST-min.js'),
        roku         = staticAssets.getDirectory('.png', '/images/roku/TEST.png'),
        png          = staticAssets.getDirectory('.png', '/images/TEST/TEST.png'),
        ico          = staticAssets.getDirectory('.ico', '/images/icons/TEST.ico'),
        woff         = staticAssets.getDirectory('.woff', '/font/TEST.woff');

    test.equal(css, 'css', 'CSS lives in the CSS directory');
    test.equal(js, 'js', 'JS lives in the JS directory');
    test.equal(roku, 'images/roku', 'Images live in their designated directories');
    test.equal(png, 'images/TEST', 'Images live in their designated directories');
    test.equal(ico, 'images/icons', 'Icons live in the images directory');
    test.equal(woff, 'font', 'Fonts live in the fonts directory');

    test.done();
  }
};