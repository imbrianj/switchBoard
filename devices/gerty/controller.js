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

  var Users = { length : 0 };

  /**
   * @author brian@bevey.org
   * @fileoverview Register comments to Gerty.
   */
  return {
    version : 20161221,

    inputs  : ['command', 'text'],

    /**
     * Whitelist of available emotion key codes to use.
     */
    keymap  : ['ANGRY', 'EXCITED', 'HAPPY', 'INDIFFERENT', 'LOVE', 'PLAYFUL', 'SAD', 'SCARED', 'SLEEP', 'STRESSED'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { comment : fs.readFileSync(__dirname + '/fragments/comment.tpl', 'utf-8') };
    },

    /**
     * Randomly select an emoji that fits the mood.
     */
    getEmojiType : function (command) {
      var emojis;

      switch (command) {
        case 'ANGRY'       :
          emojis = ['😡', '😠', '😫', '😣'];
        break;

        case 'EXCITED'     :
          emojis = ['😋', '😂', '😁'];
        break;

        case 'HAPPY'       :
          emojis = ['😄', '😃', '😀', '😊', '😉', '😎', '😋', '😁', '😛', '😝', '😜'];
        break;

        case 'INDIFFERENT' :
          emojis = ['😑', '😶', '😐', '😒', '😌'];
        break;

        case 'LOVE'        :
          emojis = ['😍', '😘', '😚', '😗', '😙', '😏', '😇'];
        break;

        case 'PLAYFUL'     :
          emojis = ['😜', '😝', '😏', '😇', '😈', '😎', '😋', '😛'];
        break;

        case 'SAD'         :
          emojis = ['😕', '😧', '😟', '😖', '😥', '😪', '😭', '😢', '😞', '😔'];
        break;

        case 'SCARED'      :
          emojis = ['😕', '😮', '😧', '😦', '😟', '😲', '😵', '😱'];
        break;

        case 'SLEEP'       :
          emojis = ['😴'];
        break;

        case 'STRESSED'    :
          emojis = ['😕', '😧', '😦', '😟', '😲', '😵', '😖', '😱', '😨', '😫', '😩', '😓', '😥'];
        break;

        default            :
          emojis = [command];
        break;
      }

      return emojis[Math.floor(Math.random() * emojis.length)];
    },

    /**
     * Random and rare classes should be applied that will have Gerty have
     * simple animations.
     */
    getActionType : function (personality, command) {
      var random  = Math.random() * 1000,
          actions = ['bounce', 'roll', 'shrink', 'shake'],
          action  = '';

      // If you're asleep, you shouldn't be very active.
      if (command !== 'SLEEP') {
        // At a rare random event, Gerty should have some added personality.
        if ((personality > random) && (random % 2)) {
          action = actions[Math.floor(Math.random() * actions.length)];
        }
      }

      return action;
    },

    /**
     * Take in an IP address and offer a more suitable name and class name for
     * display.
     */
    getUser : function (config) {
      var issuer = config.issuer,
          names  = config.names || {},
          user   = {};

      if (Users[issuer]) {
        user = Users[issuer];
      }

      else {
        if (issuer === 'localhost') {
          user.name = config.title;
          user.code = 'gerty';
        }

        else {
          if (names[issuer]) {
            user.name = names[issuer];
          }

          else {
            user.name = issuer.split('.').slice(-1)[0];
          }

          // Each code will have an assigned style, but we'll max out at 10.
          user.code = 'user-' + (Users.length % 10);

          Users.length += 1;
        }

        Users[issuer] = user;
      }

      return user;
    },

    /**
     * Gerty should accept comments from users and from device interactions and
     * collate them for display as a running chat-log.
     */
    getComments : function (config) {
      var deviceState = require(__dirname + '/../../lib/deviceState'),
          gertyState  = deviceState.getDeviceState(config.deviceId),
          comment     = config.text,
          maxCount    = config.maxCount || 100,
          user        = this.getUser(config),
          allComments = [],
          now;

      if (gertyState && gertyState.value && gertyState.value.comments) {
        allComments = gertyState.value.comments;
      }

      if (comment) {
        now = new Date().getTime();

        if (allComments.length) {
          allComments.push({ text : comment, time : now, name : user.name, code : user.code });
        }

        else {
          allComments = [{ text : comment, time : now, name : user.name, code : user.code }];
        }
      }

      // We don't need to keep a full log as it'd be too heavy to update with
      // long uptimes.
      return allComments.slice(Math.max(0, (allComments.length - maxCount)), allComments.length);
    },

    /**
     * Speech dictation can be a bit rough, so we'll try to do some simple text
     * replacement to convert "bedroom lambs" to "bedroom lamps", etc.
     *
     * For temperatures and percentags, we likely mean "Set the blind to 42
     * percent" instead of "Set the blind 242 percent" - so we'll try to clean
     * up numeric values as well.
     */
    getCorrectedText : function (text, config) {
      var correctionHash = config.corrections || {},
          term           = '';

      if (text) {
        for (term in correctionHash) {
          if (term) {
            if (correctionHash.hasOwnProperty(term)) {
              text = text.split(term).join(correctionHash[term]);
            }
          }
        }
      }

      return text;
    },

    /**
     * Gerty should default to being happy and active.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'HAPPY', controller.config.deviceId);
    },

    state : function (controller) {
      var runCommand  = require(__dirname + '/../../lib/runCommand'),
          deviceState = require(__dirname + '/../../lib/deviceState'),
          gertyState  = deviceState.getDeviceState(controller.config.deviceId),
          personality = (controller.config.personality / 100) || 0.5,
          random      = Math.random();

      if ((gertyState) && (gertyState.value) && (personality > random)) {
        // At a rare random event, Gerty should have some added personality.
        if ((random > 0.95) && (gertyState.value.description !== 'SLEEPING')) {
          gertyState.value.description = 'PLAYFUL';
        }

        runCommand.runCommand(controller.config.deviceId, gertyState.value.description, controller.config.deviceId);
      }
    },

    send : function (config) {
      var deviceState = require(__dirname + '/../../lib/deviceState'),
          gertyState  = deviceState.getDeviceState(config.device.deviceId) || {},
          gerty       = {},
          value,
          action,
          comments;

      gertyState.value  = gertyState.value                                  || {};
      gerty.deviceId    = config.device.deviceId;
      gerty.command     = config.command                                    || '';
      gerty.text        = this.getCorrectedText(config.text, config.device) || '';
      gerty.personality = config.device.personality                         || 0.5;
      gerty.comments    = config.comments                                   || [];
      gerty.callback    = config.callback                                   || function () {};
      gerty.issuer      = config.issuer;
      gerty.names       = config.device.names                               || {};
      gerty.title       = config.device.title;
      gerty.source      = config.source;

      value    = this.getEmojiType(gerty.command)                           || gertyState.value.emoji;
      action   = this.getActionType(gerty.personality, gerty.command);
      comments = this.getComments(gerty)                                    || gertyState.value.comments;

      gerty.callback(null, { emoji : value, description : gerty.command, action : action, comments : comments }, false, { source : gerty.source });
    }
  };
}());
