/*jslint white: true */
/*global exports, String, Buffer, require, console */

exports.ps3Controller = exports.ps3Controller || (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control over PS3 pre-configured GIMX setup.
   * @requires child_process
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
      var value       = '',
          // Tweak the sensitivity of the button press
          magicNumber = 250,
          sleep       = '.1';

      switch(this.command) {
        case 'PowerOn' :
          // Create a lock file so we can query if the device is still on.
          value = 'echo Starting up PS3 && date > ./ps3.lock && emu ' + this.deviceMac + ' > /dev/null && rm ./ps3.lock && echo PS3 is shut down';
        break;

        case 'Left' :
          value = 'emuclient --event "left(' + magicNumber + ')" && sleep ' + sleep + ' && emuclient --event "left(0)"';
        break;

        case 'Right' :
          value = 'emuclient --event "right(' + magicNumber + ')" && sleep ' + sleep + ' && emuclient --event "right(0)"';
        break;

        case 'Up' :
          value = 'emuclient --event "up(' + magicNumber + ')" && sleep ' + sleep + ' && emuclient --event "up(0)"';
        break;

        case 'Down' :
          value = 'emuclient --event "down(' + magicNumber + ')" && sleep ' + sleep + ' && emuclient --event "down(0)"';
        break;

        case 'PS' :
          value = 'emuclient --event "PS(255)"';
        break;

        case 'Select'   :
        case 'Start'    :
        case 'Triangle' :
        case 'Circle'   :
        case 'Cross'    :
        case 'Square'   :
          value = 'emuclient --event "' + this.command.toLowerCase() + '(255)"';
        break;
      }

      return value;
    },

    dynamicContent : function (data, devices, index, dataResponse) {
      var config = devices[index];

      data = data.replace('{{' + config.config.prefix.toUpperCase() + '_DYNAMIC}}', 'TESTING');

      if(index > 0) {
        devices[index - 1]['controller']['dynamicContent'](data, devices, index - 1, dataResponse);
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
          exec       = require('child_process').exec;

      exec(this.translateCommand(), function(error) {
        console.log('Executing: ' + that.command);

        if(error) {
          console.log(error);
        }
      });
    }
  };
} ());