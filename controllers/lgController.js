/*jslint white: true */
/*global exports, String, Buffer, require, console */

exports.lgController = exports.lgController || (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control of LG Smart TV
   * @requires http
   * @note Huge thanks for the unofficial documentation found here:
   *       http://forum.loxone.com/enen/software/4876-lg-tv-http-control.html#post32692
   */
  return {
    version : '0.0.0.0.1 alpha',
    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['0', '1', '2', '3', '3D_LR', '3D_VID', '4', '5', '6', '7', '8', '9', 'AUD_DESC', 'AV_MODE', 'BACK', 'BLUE', 'CH_DOWN', 'CH_UP', 'DASH', 'DOWN', 'ENERGY', 'EPG', 'EXIT', 'EXTERNAL', 'FAV', 'FF', 'FLASH_BACK', 'GREEN', 'HOME', 'INFO', 'LEFT', 'LIST', 'LIVE', 'MARK', 'MENU', 'MUTE', 'MY_APPS', 'NETCAST', 'NEXT', 'OK', 'PAUSE', 'PIP', 'PIP_DOWN', 'PIP_UP', 'PLAY', 'POWER', 'PREV', 'QUICK_MENU', 'RATIO', 'REC', 'REC_LIST', 'RED', 'REPEAT', 'RES_PROG_LIST', 'REW', 'RIGHT', 'SIMPLINK', 'STOP', 'SUBTITLE', 'TEXT_OPTION', 'TTL', 'UP', 'VID_SWITCH', 'VOL_DOWN', 'VOL_UP', 'YELLOW'],

    /**
     * Since I want to abstract commands, I'd rather deal with semi-readable
     * key names - so this hash table will convert the pretty names to numeric
     * values LG expects.
     */
    hashTable : { 'POWER'         : 1,
                  '0'             : 2,
                  '1'             : 3,
                  '2'             : 4,
                  '3'             : 5,
                  '4'             : 6,
                  '5'             : 7,
                  '6'             : 8,
                  '7'             : 9,
                  '8'             : 10,
                  '9'             : 11,
                  'UP'            : 12,
                  'DOWN'          : 13,
                  'LEFT'          : 14,
                  'RIGHT'         : 15,
                  // Nothing documented from 15 - 20
                  'OK'            : 20,
                  'HOME'          : 21,
                  'MENU'          : 22,
                  'BACK'          : 23,
                  'VOL_UP'        : 24,
                  'VOL_DOWN'      : 25,
                  'MUTE'          : 26,
                  'CH_UP'         : 27,
                  'CH_DOWN'       : 28,
                  'BLUE'          : 29,
                  'GREEN'         : 30,
                  'RED'           : 31,
                  'YELLOW'        : 32,
                  'PLAY'          : 33,
                  'PAUSE'         : 34,
                  'STOP'          : 35,
                  'FF'            : 36,
                  'REW'           : 37,
                  'NEXT'          : 38,
                  'PREV'          : 39,
                  'REC'           : 40,
                  'REC_LIST'      : 41,
                  'REPEAT'        : 42,
                  'LIVE'          : 43,
                  'EPG'           : 44,
                  'INFO'          : 45,
                  'RATIO'         : 46,
                  'EXTERNAL'      : 47,
                  'PIP'           : 48,
                  'SUBTITLE'      : 49,
                  'LIST'          : 50,
                  'TTL'           : 51,
                  'MARK'          : 52,
                  // Nothing from 52 - 400
                  '3D_VID'        : 400,
                  '3D_LR'         : 401,
                  'DASH'          : 402,
                  'FLASH_BACK'    : 403,
                  'FAV'           : 404,
                  'QUICK_MENU'    : 405,
                  'TEXT_OPTION'   : 406,
                  'AUD_DESC'      : 407,
                  'NETCAST'       : 408,
                  'ENERGY'        : 409,
                  'AV_MODE'       : 410,
                  'SIMPLINK'      : 411,
                  'EXIT'          : 412,
                  'RES_PROG_LIST' : 413,
                  'PIP_UP'        : 414,
                  'PIP_DOWN'      : 415,
                  'VID_SWITCH'    : 416,
                  'MY_APPS'       : 417 },

    translateCommand : function () {
      return this.hashTable[this.command];
    },

    findState : function () {
    }
  };
} ());