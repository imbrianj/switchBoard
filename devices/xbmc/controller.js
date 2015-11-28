/*jslint white: true */
/*global module, Buffer, String, require, console */

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

  var Socket = null;

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control of XBMC (aka Kodi)
   * @requires net
   * @note Refernce docs:
   *       http://wiki.xbmc.org/index.php?title=JSON-RPC_API/Examples
   */
  return {
    version : 20150921,

    inputs  : ['command', 'text', 'list'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['UP', 'DOWN', 'LEFT', 'RIGHT', 'HOME', 'SELECT', 'BACK', 'POWEROFF'],

    /**
     * Map inputted commands to the values the device or API is expecting.
     */
    hashTable : { 'UP'       : 'Up',
                  'DOWN'     : 'Down',
                  'LEFT'     : 'Left',
                  'RIGHT'    : 'Right',
                  'HOME'     : 'Home',
                  'SELECT'   : 'Select',
                  'BACK'     : 'Back',
                  'POWEROFF' : 'Shutdown' },

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { current : fs.readFileSync(__dirname + '/fragments/xbmc.tpl', 'utf-8') };
    },

    /**
     * Prepare the JSON data to be sent via socket connection.
     */
    postData : function (xbmc) {
      var value;

      value = { id      : xbmc.appId || 1,
                jsonrpc : '2.0',
                method  : 'Input.' + xbmc.command };

      if(xbmc.list) {
        value.method = 'Player.GetItem';
        value.params = { properties : ['title', 'album', 'artist', 'showtitle'],
                         playerid   : xbmc.player };
        value.id     = 'VideoGetItem';
      }

      if(xbmc.text) {
        value.id = 0;
        value.method = 'Input.SendText';
        value.params = { text : xbmc.text, done : false };
      }

      return JSON.stringify(value);
    },

    /**
     * Prepares and calls send() to request the current state.
     */
    state : function (controller, config, callback) {
      var xbmc = { device : {}, config : {}};

      callback                 = callback || function () {};
      xbmc.command             = 'state';
      xbmc.device.deviceId     = controller.config.deviceId;
      xbmc.device.deviceIp     = controller.config.deviceIp;
      xbmc.device.devicePort   = controller.config.devicePort;
      xbmc.device.localTimeout = controller.config.localTimeout || config.localTimeout;

      xbmc.callback = function (err, reply) {
        if(reply) {
          callback(xbmc.device.deviceId, null, 'ok');
        }

        else if(err) {
          callback(xbmc.device.deviceId, err);
        }
      };

      this.send(xbmc);
    },

    send : function (config) {
      var net         = require('net'),
          sharedUtil  = require(__dirname + '/../../lib/sharedUtil').util,
          xbmc        = {},
          that        = this;

      xbmc.deviceIp   = config.device.deviceIp;
      xbmc.devicePort = config.device.devicePort       || 9090;
      xbmc.player     = config.player                  || '';
      xbmc.list       = config.list                    || '';
      xbmc.state      = config.command === 'state';
      xbmc.timeout    = config.device.localTimeout     || config.config.localTimeout;
      xbmc.command    = this.hashTable[config.command] || '';
      xbmc.text       = config.text                    || '';
      xbmc.callback   = config.callback                || function () {};

      if((Socket) && (!Socket.destroyed) && (xbmc.command)) {
        if(!xbmc.state) {
          Socket.write(that.postData(xbmc));
        }

        xbmc.callback(null, 'ok');
      }

      else if((xbmc.command) || (xbmc.state)) {
        Socket = new net.Socket();
        Socket.connect(xbmc.devicePort, xbmc.deviceIp);

        Socket.once('connect', function () {
          if(xbmc.command) {
            Socket.write(that.postData(xbmc));
          }

          xbmc.callback(null, 'ok');
        });

        if(xbmc.state) {
          Socket.setTimeout(xbmc.timeout, function () {
            Socket.destroy();

            xbmc.callback({ code : 'ETIMEDOUT' });
          });
        }

        Socket.on('data', function (dataReply) {
          var reply   = JSON.parse(dataReply.toString()),
              current = '';

          if(reply) {
            // We know you're watching a video.  Now we need to send a request
            // for what the video title is.
            if((reply.params) && (reply.params.data) && (reply.params.data.player) && (reply.params.data.player.playerid)) {
              config.list   = true;
              config.player = reply.params.data.player.playerid;

              that.send(config);
            }

            // This should now have the video title.
            if((reply.result) && (reply.result.item)) {
              // First try to grab the official title.  Otherwise, the filename.
              // Failing that, we'll revert to generic "Movie".
              current = reply.result.item.title || reply.result.item.label || sharedUtil.translate('MOVIE', 'xbmc', config.language);
            }

            // Catch other methods - such as screensaver.
            else if(reply.method) {
              if(reply.method === 'GUI.OnScreensaverActivated') {
                current = sharedUtil.translate('SCREENSAVER', 'xbmc', config.language);
              }
            }

            xbmc.callback(null, { current : current });
          }
        });

        Socket.once('end', function () {
          var deviceState = require(__dirname + '/../../lib/deviceState'),
              xbmcState   = deviceState.getDeviceState(config.deviceId);

          Socket = null;

          xbmc.callback({ code : 'ETIMEDOUT' }, xbmcState);
        });

        Socket.once('error', function (err) {
          var deviceState = require(__dirname + '/../../lib/deviceState'),
              xbmcState   = deviceState.getDeviceState(config.deviceId);

          if((err.code !== 'ETIMEDOUT') || (!xbmc.state)) {
            xbmc.callback(err, xbmcState);
          }
        });
      }
    }
  };
}());
