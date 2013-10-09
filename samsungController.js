/*jslint white: true */
/*global SamsungController, String, Buffer, require, console */

var SamsungController = SamsungController || (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control over Samsung SmartTVs from 2011 onward via TCP
   *               web sockets using Node.js.
   * @note This is a full-scale rip-off of the fine work done here:
   *       http://forum.samygo.tv/viewtopic.php?f=12&t=1792
   */
  return {
    version : '0.0.0.0.1 alpha',
    /**
     * Whitelist of available key codes to use.  I'll probably put these in a
     * validator or something.
     */
    keymap  : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'UP', 'DOWN', 'LEFT', 'RIGHT',
               'MENU', 'PRECH', 'GUIDE', 'INFO', 'RETURN', 'CH_LIST', 'EXIT', 'ENTER', 'SOURCE',
               'AD', 'PLAY', 'PAUSE', 'MUTE', 'PICTURE_SIZE', 'VOLUP', 'VOLDOWN', 'TOOLS',
               'POWEROFF', 'CHUP', 'CHDOWN', 'CONTENTS', 'W_LINK', 'RSS', 'MTS', 'CAPTION',
               'REWIND', 'FF', 'REC', 'STOP', 'TV', 'CONTENT', 'INTERNET', 'PC', 'HDMI1', 'OFF',
               'POWER', 'STANDBY', 'DUAL', 'SUBT', 'CHANUP', 'CHAN_UP', 'PROGUP', 'PROG_UP'
              ],

    base64_encode : function (string) {
      return new Buffer(string).toString('base64');
    },

    /**
     * Once the connection has been established, this chunk seems to validate
     * input source.
     * "This is who I am."
     */
    chunkOne : function () {
      var ipencoded  = this.base64_encode(this.myip),
          macencoded = this.base64_encode(this.mymac),
          message    = String.fromCharCode(0x64) + String.fromCharCode(0x00) + String.fromCharCode(ipencoded.length) + String.fromCharCode(0x00) + ipencoded + String.fromCharCode(macencoded.length) + String.fromCharCode(0x00) + macencoded + String.fromCharCode(this.base64_encode(this.remotename).length) + String.fromCharCode(0x00) + this.base64_encode(this.remotename);

      return String.fromCharCode(0x00) + String.fromCharCode(this.appstring.length) + String.fromCharCode(0x00) + this.appstring + String.fromCharCode(message.length) + String.fromCharCode(0x00) + message;
    },

    /**
     * This chunk seems to ask for permission to be used.  Once executed, it
     * should prompt you on your TV to allow the connection.
     * "May I come in?"
     */
    // TODO: Figure out how to intelligently ignore this method if already authenticated
    chunkTwo : function () {
      var message = String.fromCharCode(0xc8) + String.fromCharCode(0x00); // TODO: Something may be wrong here

      console.log('Authenticating');

      return String.fromCharCode(0x00) + String.fromCharCode(this.appstring.length) + String.fromCharCode(0x00) + this.appstring + String.fromCharCode(message.length) + String.fromCharCode(0x00) + message;
    },

    /**
     * This chunk seems to tell the TV which command to execute - or, text to
     * be inputted into fields.
     * "Will you please do this for me?"
     */
    // TODO: Allow text input.
    chunkThree : function () {
      var command = 'KEY_' + this.command,
          message = String.fromCharCode(0x00) + String.fromCharCode(0x00) + String.fromCharCode(0x00) + String.fromCharCode(this.base64_encode(command).length) + String.fromCharCode(0x00) + this.base64_encode(command);

      console.log('Executing: ' + this.command);

      return String.fromCharCode(0x00) + String.fromCharCode(this.tvappstring.length) + String.fromCharCode(0x00) + this.tvappstring + String.fromCharCode(message.length) + String.fromCharCode(0x00) + message;
    },

    send : function (config) {
      this.tvip        = config.tvip;
      this.myip        = config.myip;
      this.mymac       = config.mymac;
      this.command     = config.command     || '';
      this.text        = config.text        || '';
      this.tvport      = config.tvport      || 55000;
      this.appstring   = config.appstring   || "iphone..iapp.samsung";
      this.tvappstring = config.tvappstring || "iphone.UN60ES8000.iapp.samsung";
      this.remotename  = config.remotename  || "Raspberry Pi Samsung Remote";

      var that         = this,
          net          = require('net'),
          socket       = net.connect(this.tvport, this.tvip);

      socket.on('connect', function() {
        console.log('connected');

        socket.write(that.chunkOne());
      //   socket.write(that.chunkTwo());
        socket.write(that.chunkThree());

        socket.end();
      });

      socket.on('error', function(error) {
        console.log(error);
      });
    }
  };
} ());

// Example Usage (for now):
SamsungController.send({ command: 'VOLDOWN', tvip: '192.168.1.100', myip: '192.168.1.101', mymac: "00-00-00-00-00-00" });