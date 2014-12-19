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
   * @fileoverview Fake controller for Gerty.  This basically just runs the
   *               callback, which will include apps to do a number of simple
   *               tasks.
   */
  return {
    version : 20141218,

    inputs  : ['command', 'text'],

    /**
     * Whitelist of available emotion key codes to use.
     */
    keymap  : ['ANGRY', 'EXCITED', 'HAPPY', 'INDIFFERENT', 'LOVE', 'PLAYFUL', 'SAD', 'SCARED', 'SLEEP', 'STRESSED'],

    /**
     * Randomly select an emoji that fits the mood.
     */
    getEmojiType : function (command) {
      var emojis;

      switch(command) {
        case 'ANGRY'       :
          emojis = ['😡', '😠', '😫', '😣'];
        break;

        case 'EXCITED'     :
          emojis = ['😋', '😂', '😁'];
        break;

        case 'HAPPY'       :
          emojis = ['😄', '😃', '😀', '😊', '😉', '😎', '😋', '😁', '😛', '😝', '😜']; // '
        break;

        case 'INDIFFERENT' :
          emojis = ['😑', '😶', '😐', '😒', '😌']; // '
        break;

        case 'LOVE'        :
          emojis = ['😍', '😘', '😚', '😗', '😙', '😏', '😇']; // ' Comments to fix Atoms syntax highlighter
        break;

        case 'PLAYFUL'     :
          emojis = ['😜', '😝', '😏', '😇', '😈', '😎', '😋', '😛', '😝', '😜', '😏', '😎', '😋', '😆', '😛', '😝', '😜']; // ''''''
        break;

        case 'SAD'         :
          emojis = ['😕', '😧', '😟', '😖', '😨', '😥', '😪', '😭', '😢', '😞', '😔']; // '''
        break;

        case 'SCARED'      :
          emojis = ['😕', '😮', '😧', '😦', '😟', '😲', '😵', '😱']; // '
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
    getActionType : function (personality) {
      var random  = Math.random(),
          actions = ['bounce', 'roll', 'shrink', 'walk'],
          action  = '';

      if(personality > random) {
        // At a rare random event, Gerty should have some added personality.
        if((random - 0.75) > 0.2) {
          action = actions[Math.floor(Math.random() * actions.length)];
        }
      }

      return action;
    },

    /**
     * Gerty should default to being happy and active.
     */
    init : function (controller, config) {
      var runCommand = require(__dirname + '/../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'HAPPY', controller.config.deviceId);
    },

    state : function (controller, config, callback) {
      var runCommand  = require(__dirname + '/../lib/runCommand'),
          deviceState = require(__dirname + '/../lib/deviceState'),
          gertyState = deviceState.getDeviceState(controller.config.deviceId),
          personality = (controller.config.personality / 100) || 0.5,
          random      = Math.random(),
          gerty      = {};

      if((gertyState) && (gertyState.value) && (personality > random)) {
        // At a rare random event, Gerty should have some added personality.
        if(((random - 0.75) > 0.2) && (gertyState.value.description !== 'SLEEPING')) {
          gertyState.value.description = 'PLAYFUL';
        }

        runCommand.runCommand(controller.config.deviceId, gertyState.value.description, controller.config.deviceId);
      }
    },

    send : function (config) {
      var gerty = {},
          value,
          action;

      gerty.command     = config.command     || '';
      gerty.text        = config.text        || '';
      gerty.personality = config.personality || 0.5;
      gerty.callback    = config.callback    || function () {};

      value  = this.getEmojiType(gerty.command);
      action = this.getActionType(gerty.personality);

      if((value) && (gerty.command)) {
        gerty.callback(null, { emoji : value, description : gerty.command, action : action });
      }

      if(gerty.text) {
        gerty.callback(null, gerty.text, true);
      }
    }
  };
}());
