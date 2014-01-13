/*jslint white: true */
/*global exports, String, Buffer, require, console */

exports.ps3Controller = exports.ps3Controller || (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control over PS3 pre-configured GIMX setup.
   * @requires child_process, fs
   */
  return {
    version : '0.0.0.0.1 alpha',
    /**
     * Whitelist of available key codes to use.  We could support all buttons,
     * as they are supported in GIMX, but timing of events for unnecessary
     * buttons in the context of media control seems pointless.
     */
    keymap  : ['PowerOn', 'Left', 'Right', 'Up', 'Down', 'PS', 'Select', 'Start', 'Triangle', 'Circle', 'Cross', 'Square'],

    translateCommand : function () {
      var value  = '';

      switch(this.command) {
        case 'PowerOn' :
          value = 'date > tmp/ps3.lock && echo "Connecting to PS3" && emu ' + this.deviceMac + ' > /dev/null && echo "Disconnecting from PS3" && rm tmp/ps3.lock';
        break;

        case 'PS' :
          value = 'emuclient --event "PS(255)"';
        break;

        case 'Left'     :
        case 'Right'    :
        case 'Up'       :
        case 'Down'     :
        case 'Select'   :
        case 'Start'    :
        case 'Triangle' :
        case 'Circle'   :
        case 'Cross'    :
        case 'Square'   :
          value = 'emuclient --event "' + this.command.toLowerCase() + '(255)" & sleep .01 && emuclient --event "' + this.command.toLowerCase() + '(0)"';
        break;
      }

      return value;
    },

    findState : function () {
    },

    init : function () {
      var fs     = require('fs'),
          exists = fs.exists;

      // PS3 requires a lock file to determine if the daemon is running.
      // If the server is just started up, we should assume it is not.
      exists('tmp/ps3.lock', function(exists) {
        if(exists) {
          fs.unlink('tmp/ps3.lock', function(error) {
            if(error) {
              console.log(error);
            }
          });
        }
      });
    },

    onload : function (data, devices, index, dataResponse) {
      var config = devices[index];

      data = data.replace('{{' + config.config.typeClass.toUpperCase() + '_DYNAMIC}}', '');

      if(index > 0) {
        devices[index - 1]['controller']['onload'](data, devices, index - 1, dataResponse);
      }

      else {
        dataResponse.end(data);
      }
    },

    send : function (config) {
      this.deviceMac = config.deviceMac;
      this.command   = config.command   || '';
      this.cbConnect = config.cbConnect || function () {};
      this.cbError   = config.cbError   || function () {};

      var that       = this,
          fs         = require('fs'),
          exists     = fs.exists;

      // PS3 requires a lock file to determine if the daemon is running.
      // If the server is just started up, we should assume it is not.
      exists('tmp/ps3.lock', function(exists) {
        var exec = require('child_process').exec;

        if(exists) {
          // If the PS3 is already on, we shouldn't execute PowerOn again.
          if(that.command === 'PowerOn') {
            console.log('PS3 looks on already.  Changing command to PS');

            that.command = 'PS';
          }
        }

        else {
          // Regarldess of what command is desired, if the ps3 isn't on, we
          // need to execute PowerOn first.
          console.log('PS3 doesn\'t look on - connecting.');

          that.command = 'PowerOn';
        }

        exec(that.translateCommand(), function (error, stdout, stderr) {
          that.cbConnect();

          if(error) {
            that.cbError();
            console.log(error);
          }
        });
      });
    }
  };
} ());