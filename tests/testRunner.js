/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test runner.
 */

module.exports = (function () {
  var reporter = require('nodeunit').reporters.default;

  reporter.run(['tests/unit/lib/loadControllerTest.js',
                'tests/unit/lib/loadMarkupTest.js']);
}());
