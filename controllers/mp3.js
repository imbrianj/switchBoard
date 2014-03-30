/*jslint white: true */
/*global module, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control of mp3 playback using mpg123 / afplay.
   * @requires child_process
   * @note For Linux/BSD/SunOS: Requires the installation of mpg123.
   *       On Raspbian, it's available via apt-get:
   *       sudo apt-get install mpg123
   */
  return {
    version : 20140329,

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

    send : function (config) {
      var fs       = require('fs'),
          mp3      = {};

      mp3.file     = config.text ? __dirname + '/../mp3/' + config.text : '';
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