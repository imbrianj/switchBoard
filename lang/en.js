/*jslint white: true */
/*global module, console, require */

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

/**
 * @author brian@bevey.org
 * @fileoverview English translation file.
 * @note The en file is used as the default language in the case that a given
 *       string is not available.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140903,

    strings : function () {
      return {
        container : {
          LANGUAGE     : "en",
          APPNAME      : "SwitchBoard",
          CONNECTED    : "Connected",
          CONNECTING   : "Connecting",
          DISCONNECTED : "Disconnected"
        },
        common : {
          ACTIVE         : "Active",
          BACK           : "Back",
          BLUE           : "Blue",
          CANCEL         : "Cancel",
          CHANNEL_DOWN   : "Channel Down",
          CHANNEL_UP     : "Channel Up",
          DOWN           : "Down",
          ENTER          : "Enter",
          EXIT           : "Exit",
          FAST_FORWARD   : "Fast Forward",
          FILE_NOT_FOUND : "File not found",
          GREEN          : "Green",
          HDMI           : "HDMI",
          HOME           : "Home",
          INACTIVE       : "Inactive",
          LEFT           : "Left",
          MENU           : "Menu",
          MUTE           : "Mute",
          OFF            : "Off",
          OK             : "OK",
          ON             : "On",
          PAUSE          : "Pause",
          PLAY           : "Play",
          POWER          : "Power",
          POWER_OFF      : "Power Off",
          POWER_ON       : "Power On",
          PRESENCE       : "Presence",
          RECORD         : "Record",
          RED            : "Red",
          RETURN         : "Return",
          REWIND         : "Rewind",
          RIGHT          : "Right",
          SELECT         : "Select",
          SOURCE         : "Source",
          STOP           : "Stop",
          SUBMIT         : "Submit",
          TEXT_INPUT     : "Text Input",
          UP             : "Up",
          VOLUME_UP      : "Volume Up",
          VOLUME_DOWN    : "Volume Down",
          YELLOW         : "Yellow"
        },
        denon : {
          DENON             : "Denon",
          AAC_DOLBY_EX      : "AAC + Dolby EX",
          AAC_NEO_X_C       : "AAC + Neo:X Cinema",
          AAC_NEO_X_G       : "AAC + Neo:X Game",
          AAC_NEO_X_M       : "AAC + Neo:X Music",
          AAC_PL2X_C        : "AAC + ProLogic IIx Cinema",
          AAC_PL2X_M        : "AAC + ProLogic IIx Music",
          AAC_PL2Z_H        : "AAC + ProLogic IIz Height",
          ALL_ZONE_STEREO   : "All Zone Stereo",
          AUX1              : "Aux1",
          AUX2              : "Aux2",
          BD                : "Blu-ray",
          CD                : "CD",
          DIRECT            : "Direct",
          DOLBY_D_          : "Dolby Digital Plus",
          DOLBY_DIGITAL     : "Dolby Digital",
          DOLBY_D_EX        : "Dolby Digital EX",
          DOLBY_D_NEO_X_C   : "Dolby Digital + Neo:X Cinema",
          DOLBY_D_NEO_X_G   : "Dolby Digital + Neo:X Game",
          DOLBY_D_NEO_X_M   : "Dolby Digital + Neo:X Music",
          DOLBY_D_PL2X_C    : "Dolby Digital + ProLogic IIx Cinema",
          DOLBY_D_PL2X_M    : "Dolby Digital + ProLogic IIx Music",
          DOLBY_D_PL2Z_H    : "Dolby Digital + ProLogic IIz Height",
          DOLBY_D___EX      : "Dolby Digital Plus + EX",
          DOLBY_D___NEO_X_C : "Dolby Digital Plus + Neo:X Cinema",
          DOLBY_D___NEO_X_G : "Dolby Digital Plus + Neo:X Cinema",
          DOLBY_D___NEO_X_M : "Dolby Digital Plus + Neo:X Music",
          DOLBY_D___PL2X_C  : "Dolby Digital Plus + ProLogic IIx Cinema",
          DOLBY_D___PL2X_M  : "Dolby Digital Plus + ProLogic IIx Music",
          DOLBY_D___PL2Z_H  : "Dolby Digital Plus + ProLogic IIz Height",
          DOLBY_HD          : "Dolby HD",
          DOLBY_HD_EX       : "Dolby HD + EX",
          DOLBY_HD_NEO_X_C  : "Dolby HD + Neo:X Cinema",
          DOLBY_HD_NEO_X_G  : "Dolby HD + Neo:X Game",
          DOLBY_HD_NEO_X_M  : "Dolby HD + Neo:X Music",
          DOLBY_HD_PL2X_C   : "Dolby HD + ProLogic IIx Cinema",
          DOLBY_HD_PL2X_M   : "Dolby HD + ProLogic IIx Music",
          DOLBY_HD_PL2Z_H   : "Dolby HD + ProLogic IIz Height",
          DOLBY_PL2X_C      : "Dolby ProLogic IIx Cinema",
          DOLBY_PL2X_G      : "Dolby ProLogic IIx Game",
          DOLBY_PL2X_M      : "Dolby ProLogic IIx Music",
          DOLBY_PL2Z_H      : "Dolby ProLogic IIz Height",
          DOLBY_PL2_C       : "Dolby ProLogic II Cinema",
          DOLBY_PL2_G       : "Dolby ProLogic II Game",
          DOLBY_PL2_M       : "Dolby ProLogic II Music",
          DOLBY_TRUEHD      : "Dolby TrueHD",
          DTS96_24          : "DTS 96/24",
          DTS96_ES_MTRX     : "DTS 96 ES Matrix",
          DTS_ES_8CH_DSCRT  : "DTS ES 8 Channel Discrete",
          DTS_ES_DSCRT6_1   : "DTS ES Discrete 6.1",
          DTS_ES_MTRX6_1    : "DTS ES Matrix 6.1",
          DTS_EXPRESS       : "DTS Express",
          DTS_HD            : "DTS HD",
          DTS_HD_MSTR       : "DTS HD Master",
          DTS_HD_NEO_X_C    : "DTS HD + Neo:X Cinema",
          DTS_HD_NEO_X_G    : "DTS HD + Neo:X Game",
          DTS_HD_NEO_X_M    : "DTS HD + Neo:X Music",
          DTS_HD_PL2X_C     : "DTS HD + ProLogic IIx Cinema",
          DTS_HD_PL2X_M     : "DTS HD + ProLogic IIx Music",
          DTS_HD_PL2Z_H     : "DTS HD + ProLogic IIz Height",
          DTS_NEO_X_C       : "DTS + Neo:X Cinema",
          DTS_NEO_X_G       : "DTS + Neo:X Game",
          DTS_NEO_X_M       : "DTS + Neo:X Music",
          DTS_PL2X_C        : "DTS + ProLogic IIx Cinema",
          DTS_PL2X_M        : "DTS + ProLogic IIx Music",
          DTS_PL2Z_H        : "DTS + ProLogic IIz Height",
          DTS_SURROUND      : "DTS Surround",
          DVD               : "DVD",
          GAME              : "Game",
          INPUT             : "Input",
          IRADIO            : "Internet Radio",
          JAZZ_CLUB         : "Jazz Club",
          MATRIX            : "Matrix",
          MCH_STEREO        : "Multi Channel Stereo",
          MONO_MOVIE        : "Mono Movie",
          MOVIE             : "Movie",
          MPEG2_AAC         : "MPEG2 AAC",
          MPLAY             : "Media Player",
          MULTI_CH_IN       : "Multi Channel In",
          MULTI_CH_IN_7_1   : "Multi Channel In 7.1",
          MUSIC             : "Music",
          M_CH_IN_DOLBY_EX  : "Multi Channel In + Dolby Digital EX",
          M_CH_IN_NEO_X_C   : "Multi Channel In + Neo:X Cinema",
          M_CH_IN_NEO_X_G   : "Multi Channel In + Neo:X Game",
          M_CH_IN_NEO_X_M   : "Multi Channel In + Neo:X Music",
          M_CH_IN_PL2X_C    : "Multi Channel In + ProLogic II",
          M_CH_IN_PL2X_M    : "Multi Channel In + ProLogic IIx Music",
          M_CH_IN_PL2Z_H    : "Multi Channel In + ProLogic IIz Height",
          NET               : "Network",
          PHONO             : "Phono",
          PURE_DIRECT       : "Pure Direct",
          ROCK_ARENA        : "Rock Arena",
          SAT_CBL           : "CBL/SAT",
          SOUNDMODE         : "Sound Mode",
          STANDARD          : "Standard",
          STANDBY           : "Standby",
          STEREO            : "Stereo",
          TUNER             : "Tuner",
          TV                : "TV Audio",
          USB_IPOD          : "iPod/USB",
          VIDEO_GAME        : "Video Game",
          VIRTUAL           : "Virtual",
          VOLUME            : "Volume",
          Z1                : "Zone 1",
          Z2                : "Zone 2",
          Z3                : "Zone 3"
        },
        foscam : {
          FOSCAM          : "Foscam",
          ARM             : "Arm",
          BURST           : "Burst",
          CAMERA_ARMED    : "Camera armed",
          CAMERA_DISARMED : "Camera disarmed",
          DISARM          : "Disarm",
          PRESET          : "Preset",
          TAKE            : "Take"
        },
        jarvis : {
          JARVIS : "Jarvis"
        },
        lg : {
          LG       : "LG",
          EXTERNAL : "External",
          INFO     : "Info",
        },
        mp3 : {
          MP3 : "MP3"
        },
        nest : {
          NEST               : "Nest",
          AWAY               : "Away",
          BASEMENT           : "Basement",
          BATT               : "Batt",
          BEDROOM            : "Bedroom",
          CO                 : "CO",
          CO_DETECTED        : "{{LABEL}} CO detected!",
          COOL               : "Cool",
          DEN                : "Den",
          DINING_ROOM        : "Dining Room",
          DOWNSTAIRS         : "Downstairs",
          ENTRYWAY           : "Entryway",
          FAMILY_ROOM        : "Family Room",
          HALLWAY            : "Hallway",
          HEAT               : "Heat",
          HOME               : "Home",
          HUMIDITY           : "Humidity",
          KIDS_ROOM          : "Kids Room",
          KITCHEN            : "Kitchen",
          LEAF               : "Leaf",
          LIVING_ROOM        : "Living Room",
          MASTER_BEDROOM     : "Master Bedroom",
          OFFICE             : "Office",
          PROTECT            : "Protect",
          SET_TEMPERATURE    : "Set Temperature",
          SMOKE              : "Smoke",
          SMOKE_DETECTED     : "{{LABEL}} smoke detected!",
          TARGET             : "Target",
          TARGET_TEMPERATURE : "Target Temperature",
          TEMP               : "Temp",
          THERMOSTAT         : "Thermostat",
          UPSTAIRS           : "Upstairs"
        },
        panasonic : {
          PANASONIC    : "Panasonic",
          CHANGE_INPUT : "Change Input",
          INFO         : "Info",
          INTERNET     : "Internet",
          SUBMENU      : "Submenu",
          VIERA_LINK   : "Viera Link"
        },
        pioneer : {
          PIONEER        : "Pioneer",
          BD             : "BD",
          CD             : "CD",
          CDR_TAPE       : "CD-R/Tape",
          DVD            : "DVD",
          DVR_BDR        : "DVR/BDR",
          INTERNET_RADIO : "Internet Radio",
          IPOD_USB       : "iPod/USB",
          PANDORA        : "Pandora",
          ROKU           : "Roku",
          SIRIUS_XM      : "Sirius XM",
          TUNER          : "Tuner",
          TV_SAT         : "TV/Sat",
          VIDEO          : "Video"
        },
        ps3 : {
          PS3      : "PS3",
          CIRCLE   : "Circle",
          CROSS    : "Cross",
          L1       : "L1",
          L2       : "L2",
          PS       : "PS",
          R1       : "R1",
          R2       : "R2",
          SELECT   : "Select",
          START    : "Start",
          TRIANGLE : "Triangle"
        },
        pushover : {
          PUSHOVER : "Pushover"
        },
        raspberryRemote : {
          RASPBERRY_REMOTE : "Raspberry Remote"
        },
        roku : {
          ROKU           : "Roku",
          BACKSPACE      : "Backspace",
          FORWARD        : "Forward",
          INSTANT_REPLAY : "Instant Replay"
        },
        samsung : {
          SAMSUNG          : "Samsung",
          CEC_SPEAKERS     : "CEC Speakers",
          CHANNEL_LISTING  : "Channel Listing",
          MORE             : "More",
          PREVIOUS_CHANNEL : "Previous Channel",
          SMART_HUB        : "Smart Hub",
          TOOLS            : "Tools",
          WEB_BROWSER      : "Web Browser"
        },
        smartthings : {
          SMARTTHINGS    : "SmartThings",
          ARRIVED        : "{{LABEL}} has just arrived",
          AWAY           : "Away",
          HOME           : "Home",
          LEFT           : "{{LABEL}} has just left",
          NIGHT          : "Night",
          WATER_DETECTED : "{{LABEL}} has detected water!"
        },
        sms : {
          SMS : "SMS"
        },
        speech : {
          SPEECH : "Speech"
        },
        stocks : {
          STOCKS  : "Stocks",
          BUY     : "Your {{LABEL}} stock is low at ${{PRICE}}.  Think about buying?",
          LOSS    : "Loss",
          GAIN    : "Gain",
          NEUTRAL : "Neutral",
          SELL    : "Your {{LABEL}} stock is doing well at ${{PRICE}}.  Think about selling?"
        },
        travis : {
          TRAVIS        : "Travis",
          BUILD_FAILURE : "Travis build failure!",
          BUILD_STATUS  : "Build Status"
        },
        weather : {
          WEATHER     : "Weather",
          CURRENT     : "Current Weather",
          UNAVAILABLE : "Weather data unavailable"
        },
        welcome : {
          WELCOME   : "Welcome",
          HEADER    : "Welcome!",
          SUCCESS   : "Welcome to SwitchBoard.  If you're seeing this message, it means you've got everything set up and you'll just need to configure your remote.",
          CONFIGURE : "Open up the config/config.js file which contains a series of standard device types.  Find any device that looks like one you'd like configured and plug in your relevant information.  For anything that's maybe not super obvious, there should be ample comments to help guide you.  While you're in there, you may also want to mark the \"welcome\" device as disabled: true to prevent this message from showing up anymore.",
          SUPPORT   : "Stuck?  Have questions?  Something go wrong or have any suggestions?  Feel free to <a href=\"https://github.com/imbrianj/switchBoard/issues/new\" rel=\"external\">file a ticket</a> or send me an email at <a href=\"mailto:brian@bevey.org\" rel=\"external\">brian@bevey.org</a>."
        },
        wemo : {
          WEMO : "Wemo"
        },
        xbmc : {
          XBMC        : "XBMC",
          MOVIE       : 'Movie',
          SCREENSAVER : 'Screensaver'
        }
      };
    }
  };
}());
