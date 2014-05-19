/*jslint white: true */
/*global State, module, require, console */

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

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control of mp3 playback using mpg123 / afplay.
   * @requires fs, child_process
   * @note For Linux/BSD/SunOS: Requires the installation of mpg123.
   *       On Raspbian, it's available via apt-get:
   *       sudo apt-get install mpg123
   */
  return {
    version : 20140503,

    inputs  : ['text'],

    translateCommand : function (file, platform) {
      var command = '';

      switch(platform) {
        case 'linux' :
        case 'freebsd' :
        case 'sunos' :
          command = 'mpg123 ' + file;
        break;

        case 'darwin' :
          command = 'afplay ' + file;
        break;

        default :
          console.log('MP3: MP3 playback is not supported on your platform!');
        break;
      }

      return command;
    },

    init : function (controller) {
      this.send({ text : 'magic' });
    },

    send : function (config) {
      var fs       = require('fs'),
          mp3      = {};

      mp3.file     = config.text ? __dirname + '/../mp3/' + config.text + '.mp3' : '';
      mp3.callback = config.callback || function () {};
      mp3.platform = config.platofrm || process.platform;

      if(mp3.file) {
        fs.exists(mp3.file, function(exists) {
          var exec          = require('child_process').exec,
              mp3Controller = require('./mp3');

          if(!exists) {
            console.log('MP3: Specified file not found');
          }

          else {
            exec(mp3Controller.translateCommand(mp3.file, mp3.platform), function (err, stdout, stderr) {
              var errorMsg = '';

              if(err) {
                errorMsg = 'MP3: ' + err;
                mp3.callback(errorMsg);
                console.log(errorMsg);
              }

              else {
                mp3.callback(null, stdout);
              }
            });
          }
        });
      }

      else {
        console.log('MP3: No file specified');
      }
    }
  };
}());