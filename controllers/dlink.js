/*jslint white: true */
/*global State, module, require, console */

/**
 * Copyright (c) 2014 markewest@gmail.com
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

module.exports = (function () {
  'use strict';

  /**
   * @author markewest@gmail.com
   * @requires http, fs, request
   * @fileoverview Basic control of D-Link IP camera.
   */
  return {
    version : 20140619,

    inputs  : ['command', 'list'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['Take'],

    postPrepare : function (config) {
      var path  = '',
          login = '?user=' + config.username + '&amp;pwd=' + config.password + '&amp;';

      switch(config.command) {

        case 'Take' :
          path = '/snapshot.cgi' + login;
        break;

      return { host   : config.deviceIp,
               port   : config.devicePort,
               path   : path,
               method : 'GET' };
    },

    init : function (controller, config) {

      controller.markup = controller.markup.replace('{{FOSCAM_DYNAMIC}}', 'http://' + controller.config.deviceIp + '/mjpeg.cgi?user=' + controller.config.username + '&amp;password=' + controller.config.password);

      console.log(controller.markup);

      return controller;
    },

}());
