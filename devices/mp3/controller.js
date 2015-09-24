/*jslint white: true */
/*global module, require, console */

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
    version : 20150921,

    inputs  : ['text'],

    /*
     * Find the correct path to execute the given file on the given platform.
     */
    translateCommand : function (file, platform) {
      var execute = { command : '', params : [] };

      switch(platform) {
        case 'linux' :
        case 'freebsd' :
        case 'sunos' :
          execute.command = 'mpg123';

          execute.params.push(file);
        break;

        case 'darwin' :
          execute.command = 'afplay';

          execute.params.push(file);
        break;

        default :
          execute = '';
        break;
      }

      return execute;
    },

    /**
     * Issue a command to play a short sound to indicate that SwitchBoard has
     * started up.  This will also force the correct state to be recorded once
     * the sound has finished.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'text-magic', controller.config.deviceId);
    },

    send : function (config) {
      var fs       = require('fs'),
          mp3      = {};

      mp3.file     = config.text ? __dirname + '/../../mp3/' + config.text + '.mp3' : '';
      mp3.callback = config.callback || function () {};
      mp3.platform = config.platofrm || process.platform;
      mp3.execute  = this.translateCommand(mp3.file, mp3.platform);

      if(mp3.execute) {
        if(mp3.file) {
          fs.exists(mp3.file, function(exists) {
            var spawn = require('child_process').spawn,
                mpg123;

            if((exists) && (mp3.execute)) {
              mpg123 = spawn(mp3.execute.command, mp3.execute.params);

              mpg123.once('error', function(err) {
                mp3.callback(err);
              });

              mpg123.once('close', function(code) {
                mp3.callback(null, 'ok');
              });
            }

            else {
              mp3.callback('Specified file not found');
            }
          });
        }

        else {
          mp3.callback('No file specified');
        }
      }

      else {
        mp3.callback('MP3 playback is not supported on your platform!');
      }
    }
  };
}());
