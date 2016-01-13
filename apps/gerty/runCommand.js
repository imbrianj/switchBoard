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

/**
 * @author brian@bevey.org
 * @fileoverview Gerty methods related to running commands issued via voice.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20150829,

    /**
     * Take in a typeClass and return the type of device it's categorized as.
     */
    findDeviceType : function (typeClass) {
      var deviceType = '';

      switch(typeClass) {
        case 'smartthings' :
          deviceType = 'smartthings';
        break;

        case 'nest' :
          deviceType = 'nest';
        break;

        case 'foscam' :
          deviceType = 'security';
        break;

        case 'samsung'   :
        case 'lg'        :
        case 'panasonic' :
          deviceType = 'tv';
        break;

        case 'pioneer' :
        case 'denon'   :
          deviceType = 'stereo';
        break;

        case 'ps3'  :
        case 'xbmc' :
          deviceType = 'entertainment';
        break;

        case 'stocks' :
          deviceType = 'stocks';
        break;

        case 'weather' :
          deviceType = 'weather';
        break;

        case 'travis' :
          deviceType = 'travis';
        break;
      }

      return deviceType;
    },

    /**
     * Takes inputted spoken text and tries to derive the intended devices and
     * actions to execute.
     */
    setDevice : function (rawText, controllers, device, macros, language) {
      var translate      = require(__dirname + '/../../lib/translate'),
          runCommand     = require(__dirname + '/../../lib/runCommand'),
          gertyLanguage  = require(__dirname + '/language'),
          genericDevices = gertyLanguage.getGenericDevices(controllers),
          subDevices     = gertyLanguage.getSubDevices(controllers),
          genericTerms   = gertyLanguage.getGenericTerms(language),
          verbs          = gertyLanguage.getVerbs(language),
          inquiry        = gertyLanguage.getInquiry(language),
          implied        = translate.translate('{{i18n_AND}}', 'gerty', language),
          commands       = [{ action : null, implied : false }],
          questions      = [{ action : null, implied : false }],
          devices        = [{ device : null, typeClass : null, subDevice : null }],
          rawMacro       = [],
          macro          = '',
          text           = [],
          keyword        = '',
          acted          = false,
          i              = 0,
          j              = 0,
          k              = 0,
          x              = 0;

      text = rawText.split(' ');

      if(macros) {
        // Loop through all configured macros anywhere in the inputted text.
        for(keyword in macros) {
          if(rawText.indexOf(keyword.toUpperCase()) !== -1) {
            rawMacro = macros[keyword].split(';');

            for(macro in rawMacro) {
              runCommand.macroCommands(rawMacro[macro]);
            }

            acted = true;
          }
        }
      }

      for(i = 0; i < text.length; i += 1) {
        // If you have a series of commands, you don't want to have to repeat
        // the same word.  So we'll use "AND" to assume the same action.
        if((commands.length > 1) && (text[i] === implied.toUpperCase())) {
          commands[j].action  = commands[(j - 1)].action;
          commands[j].implied = true;
        }

        // Loop through looking for action words.  Once we have one, store it
        // so we can act on it once we find a suitable device.
        for(keyword in verbs) {
          // Look ahead for "Channel Up" to not confuse with just "Up".
          if(text[i] + ' ' + text[(i + 1)] === verbs[keyword].toUpperCase()) {
            commands[j].action = verbs[keyword];

            i += 1;

            break;
          }

          else if(text[i] === verbs[keyword].toUpperCase()) {
            commands[j].action = verbs[keyword];

            break;
          }

          // When we have a pair of action + command, we can start looking for
          // our next command.
          if((commands[j].action) && (devices[j].device)) {
            j += 1;

            commands[j] = { action : null, implied : false };
            devices[j]  = { device : null, typeClass : null, subDevice : null };
          }
        }

        // Loop through looking for inquiry words.  Once we have one, store it
        // so we can act on it once we find a suitable device.
        for(keyword in inquiry) {
          if(text[i] === inquiry[keyword].toUpperCase()) {
            questions[x].action = inquiry[keyword];

            break;
          }

          // When we have a pair of action + command, we can start looking for
          // our next command.
          if((questions[x].action) && (devices[j].device)) {
            x += 1;

            questions[x] = { action : null, implied : false };
            devices[j]   = { device : null, typeClass : null, subDevice : null };
          }
        }

        for(keyword in genericTerms) {
          // Check for generic names "TV", "Stereo", "Playstation", etc.
          if(genericTerms[keyword].toUpperCase() === text[i]) {
            if(controllers[genericDevices[genericTerms[keyword].toUpperCase()]]) {
              devices[j].device    = genericDevices[genericTerms[keyword].toUpperCase()];
              devices[j].typeClass = controllers[genericDevices[genericTerms[keyword].toUpperCase()]].config.typeClass;

              // When we have a pair of action + command, we can start looking
              // for our next command.
              if((commands[j].action) && (devices[j].device)) {
                j += 1;

                commands[j] = { action : null, implied : false };
                devices[j]  = { device : null, typeClass : null, subDevice : null };
              }
            }
          }
        }

        // Look through any registered subdevices that may need to be acted
        // upon.
        for(keyword in controllers) {
          if(keyword !== 'config') {
            if((subDevices) && (subDevices[keyword]) && (subDevices[keyword].subDevices)) {
              for(k = 0; k < subDevices[keyword].subDevices.length; k += 1) {
                // Look ahead for device names that may be multiple words.
                if(text[i] + ' ' + text[(i + 1)] + ' ' + text[(i + 2)] === subDevices[keyword].subDevices[k].toUpperCase()) {
                  devices[j].device    = keyword;
                  devices[j].typeClass = controllers[keyword].config.typeClass;
                  devices[j].subDevice = subDevices[keyword].subDevices[k];

                  i += 2;

                  break;
                }

                else if(text[i] + ' ' + text[(i + 1)] === subDevices[keyword].subDevices[k].toUpperCase()) {
                  devices[j].device    = keyword;
                  devices[j].typeClass = controllers[keyword].config.typeClass;
                  devices[j].subDevice = subDevices[keyword].subDevices[k];

                  i += 1;

                  break;
                }

                else if(text[i] === subDevices[keyword].subDevices[k].toUpperCase()) {
                  devices[j].device = keyword;
                  devices[j].typeClass = controllers[keyword].config.typeClass;
                  devices[j].subDevice = subDevices[keyword].subDevices[k];
                }

                // When we have a pair of action + command, we can start looking for
                // our next command.
                if((commands[j].action) && (devices[j].device)) {
                  j += 1;

                  commands[j] = { action : null, implied : false };
                  devices[j]  = { device : null, typeClass : null, subDevice : null };
                }
              }
            }
          }
        }

        // Look through each device and compare with the "title" used in the
        // navigation.
        for(keyword in controllers) {
          if(keyword !== 'config') {
            // Look ahead for device names that may be multiple words.
            if(text[i] + ' ' + text[(i + 1)] + ' ' + text[(i + 2)] === controllers[keyword].config.title.toUpperCase()) {
              commands[j].device    = keyword;
              commands[j].typeClass = controllers[keyword].config.typeClass;

              i += 2;

              break;
            }

            else if(text[i] + ' ' + text[(i + 1)] === controllers[keyword].config.title.toUpperCase()) {
              commands[j].device    = keyword;
              commands[j].typeClass = controllers[keyword].config.typeClass;

              i += 1;

              break;
            }

            else if(text[i] === controllers[keyword].config.title.toUpperCase()) {
              commands[j].device    = keyword;
              commands[j].typeClass = controllers[keyword].config.typeClass;
            }

            // When we have a pair of action + command, we can start looking for
            // our next command.
            if((commands[j].action) && (commands[j].device)) {
              j += 1;

              commands[j] = { action : null, device : null, typeClass: null, subDevice : null };
            }
          }
        }
      }

      // If we have a question that's not related to any device.
      // "What time is it?"
      // "What is the date?"
      // "Do I need a coat?"
      // "How are you doing?"
      if((!devices[0].device) && (!commands[0].action) && (questions[0].action)) {
// Register questions
      }

      else if((devices[0].device) && ((commands[0].action) || (questions[0].action))) {

// Figure out how to coordinate "questions" with "commands"

        // If we have more commands than devices, there's probably some
        // ambiguity with a conjunction, such as:
        // "Turn off the hall light and office light"
        // Which "and" should imply that both devices be "off".  However, a
        // structure such as:
        // "Turn off the hall light and turn on the office light"
        // This would produce an extra element in the "commands" list, which is
        // what we'll try and filter here.
        if(commands.length > devices.length) {
          for(i = 0; i < commands.length; i += 1) {
            if(commands[i].implied === true) {
              commands.splice(i, 1);
            }
          }
        }

        // We should have a perfect matching between devices and commands.  If
        // we do not, then we clearly misunderstand part (or all) of a message,
        // so it's probably best to not act on it rather than act incorrectly
        // on it.
        if(commands.length === devices.length) {
          for(i = 0; i < commands.length; i += 1) {
            if((devices[i].device) && (commands[i].action)) {
              // Only at this point should we assume a command will actually be
              // acted upon.
              acted = true;

              if(devices[i].subDevice) {
                if(devices[i].typeClass === 'nest') {
                  devices[i].subDevice = devices[i].subDevice + '-' + commands[i].action.toLowerCase();
                  commands[i].action   = 'mode';
                }

                commands[i].action = 'subdevice-' + commands[i].action.toLowerCase() + '-' + devices[i].subDevice;
              }

              switch(this.findDeviceType(devices[i].typeClass)) {
                case 'tv'            :
                case 'entertainment' :
                case 'stereo'        :
                  switch(commands[i].action.toUpperCase()) {
                    case 'OFF' :
                      commands[i].action = 'PowerOff';
                    break;

                    case 'ON' :
                      commands[i].action = 'PowerOn';
                    break;
                  }
                break;

                case 'security' :
                  switch(commands[i].action.toUpperCase()) {
                    case 'ARM' :
                      commands[i].action = 'Alarm_On';
                    break;

                    case 'DISARM' :
                      commands[i].action = 'Alarm_Off';
                    break;
                  }
                break;
              }

              runCommand.runCommand(devices[i].device, commands[i].action);
            }
          }
        }
      }

      return acted;
    },

    /**
     * For commands that are executed against certain devices (or subdevices),
     * we'll determine what impact those have on the mood of Gerty.
     */
    setDeviceUpdate : function (deviceId, typeClass, command, values, controllers) {
      var gertyMood   = require(__dirname + '/mood'),
          deviceState = require(__dirname + '/../../lib/deviceState'),
          mood        = { comfortable : 0, entertained : 0, excited : 0, scared : 0, social : 0, comments: [] },
          date,
          state,
          deviceType,
          deviceCommand,
          deviceMood,
          device;

      for(device in controllers) {
        deviceType = null;

        if(device !== 'config') {
          deviceType = this.findDeviceType(controllers[device].config.typeClass);

          if(deviceType) {
            state         = deviceState.getDeviceState(device);
            deviceCommand = require(__dirname + '/' + deviceType);
            deviceMood    = deviceCommand[deviceType](state, command);

            if(deviceMood) {
              mood.comfortable += deviceMood.comfortable || 0;
              mood.entertained += deviceMood.entertained || 0;
              mood.excited     += deviceMood.excited     || 0;
              mood.scared      += deviceMood.scared      || 0;
              mood.social      += deviceMood.social      || 0;

              if(deviceMood.comment) {
                date = new Date();
                mood.comments.push({ comment : deviceMood.comment,
                                     device  : device,
                                     updated : date.getTime() });
              }
            }
          }
        }
      }

      mood.comfortable = Math.min(mood.comfortable,  10);
      mood.comfortable = Math.max(mood.comfortable, -10);
      mood.entertained = Math.min(mood.entertained,  10);
      mood.entertained = Math.max(mood.entertained, -10);
      mood.excited     = Math.min(mood.excited,      10);
      mood.excited     = Math.max(mood.excited,     -10);
      mood.scared      = Math.min(mood.scared,       10);
      mood.scared      = Math.max(mood.scared,      -10);
      mood.social      = Math.min(mood.social,       10);
      mood.social      = Math.max(mood.social,      -10);

      gertyMood.deriveMood(mood, controllers);
    }
  };
}());
