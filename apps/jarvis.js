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
 * @fileoverview Execute Jarvis commands.
 */

module.exports = (function () {
  'use strict';

  var mood = {};

  return {
    version : 20141218,

    jarvis : function(device, command, controllers, values, config) {
      var translate  = require(__dirname + '/../lib/translate'),
          runCommand = require(__dirname + '/../lib/runCommand'),
          deviceState = require(__dirname + '/../lib/deviceState'),
          utterance  = translate.findSynonyms('jarvis', controllers.config.language),
          message    = '',
          text       = '',
          emotion    = '',
          speak,
          getGenericDevices,
          getSubDevices,
          findKeywords,
          getGenericTerms,
          getVerbs,
          setEmotion,
          setDevice,
          smartThingsMood,
          currentDevice,
          subdevice,
          type,
          value,
          deviceId;

      getGenericDevices = function(controllers) {
        var genericTypes = { tv      : ['samsung', 'panasonic', 'lg'],
                             stereo  : ['denon', 'pioneer'],
                             camera  : ['foscam'],
                             ps3     : ['ps3'],
                             stocks  : ['stocks'],
                             weather : ['weather'] },
            unique       = {},
            notUnique    = {},
            generic,
            device;

        for(device in controllers) {
          if(device !== 'config') {
            for(generic in genericTypes) {
              if(!notUnique[generic]) {
                if(genericTypes[generic].indexOf(controllers[device].config.typeClass) !== -1) {
                  if(unique[generic]) {
                    notUnique[generic] = true;
                    unique[generic.toUpperCase()] = '';
                  }

                  else {
                    unique[generic.toUpperCase()] = device;
                  }
                }
              }
            }
          }
        }

        return unique;
      };

      getSubDevices = function(controllers) {
        var subdevices = {},
            currentState,
            device,
            subdevice,
            i;

        for(device in controllers) {
          if(device !== 'config') {
            currentState = deviceState.getDeviceState(device);

            if((currentState) && (currentState.value) && (currentState.value.devices)) {
              i = 0;
              subdevices[device] = { subDevices : [] };

              for(subdevice in currentState.value.devices) {
                subdevices[device].subDevices[i] = currentState.value.devices[subdevice].label;
                i += 1;
              }
            }
          }
        }

        return subdevices;
      };

      findKeywords = function(codes, language) {
        var translate = require(__dirname + '/../lib/translate'),
            strings   = [],
            i         = 0;

        for(i; i < codes.length; i += 1) {
          strings[codes[i]] = translate.translate('{{i18n_' + codes[i] + '}}', 'jarvis', language);
        }

        return strings;
      };

      getGenericTerms = function(language) {
        var codes = ['TV', 'STEREO', 'CAMERA', 'PLAYSTATION', 'WEATHER', 'STOCKS'];

        return findKeywords(codes, language);
      };

      getVerbs = function(language) {
        var codes = ['ON', 'OFF', 'HEAT', 'COOL', 'TOGGLE', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'ENTER', 'ARM', 'DISARM'];

        return findKeywords(codes, language);
      };

      setEmotion = function(text, device, language) {
        var synonyms   = translate.findSynonyms('jarvis', language),
            keyword    = '',
            command    = '',
            i;

        for(keyword in synonyms) {
          for(i = 0; i < synonyms[keyword].length; i += 1) {
            if(text.indexOf(synonyms[keyword][i].toUpperCase()) !== -1) {
              command = keyword;

              break;
            }
          }
        }

        if(command) {
          runCommand.runCommand(device, command);
        }

        return command !== '';
      };

      setDevice = function(rawText, controllers, device, macros, language) {
        var genericDevices = getGenericDevices(controllers),
            subDevices     = getSubDevices(controllers),
            genericTerms   = getGenericTerms(language),
            verbs          = getVerbs(language),
            commands       = { 0 : {} },
            rawMacro       = [],
            macro          = '',
            text           = [],
            keyword        = '',
            acted          = false,
            i              = 0,
            j              = 0,
            k              = 0;

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
            if((commands[j].action) && (commands[j].device)) {
              j += 1;

              commands[j] = { action : null, device : null, subdevice : null };
            }
          }

          for(keyword in genericTerms) {
            // Check for generic names "TV", "Stereo", "Playstation", etc.
            if(genericTerms[keyword] === text[i]) {
              commands[j].device = genericDevices[genericTerms[keyword]];

              // When we have a pair of action + command, we can start looking
              // for our next command.
              if((commands[j].action) && (commands[j].device)) {
                j += 1;

                commands[j] = { action : null, device : null, subdevice : null };
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
                    commands[j].device    = keyword;
                    commands[j].subDevice = subDevices[keyword].subDevices[k];

                    i += 2;

                    break;
                  }

                  else if(text[i] + ' ' + text[(i + 1)] === subDevices[keyword].subDevices[k].toUpperCase()) {
                    commands[j].device = keyword;
                    commands[j].subDevice = subDevices[keyword].subDevices[k];

                    i += 1;

                    break;
                  }

                  else if(text[i] === subDevices[keyword].subDevices[k].toUpperCase()) {
                    commands[j].device = keyword;
                    commands[j].subDevice = subDevices[keyword].subDevices[k];
                  }

                  // When we have a pair of action + command, we can start looking for
                  // our next command.
                  if((commands[j].action) && (commands[j].device)) {
                    j += 1;

                    commands[j] = { action : null, device : null, subdevice : null };
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
                commands[j].device = keyword;

                i += 2;

                break;
              }

              else if(text[i] + ' ' + text[(i + 1)] === controllers[keyword].config.title.toUpperCase()) {
                commands[j].device = keyword;

                i += 1;

                break;
              }

              else if(text[i] === controllers[keyword].config.title.toUpperCase()) {
                commands[j].device = keyword;
              }

              // When we have a pair of action + command, we can start looking for
              // our next command.
              if((commands[j].action) && (commands[j].device)) {
                j += 1;

                commands[j] = { action : null, device : null, subdevice : null };
              }
            }
          }
        }

        if((commands[0].device) && (commands[0].action)) {
          acted = true;

          for(keyword in commands) {
            if((commands[keyword].device) && (commands[keyword].action)) {
              if(commands[keyword].subDevice) {
                if((commands[keyword].action === 'Cool') || (commands[keyword].action === 'Heat') || (commands[keyword].action === 'Off')) {
                  commands[keyword].subDevice = commands[keyword].subDevice + '-' + commands[keyword].action.toLowerCase();
                  commands[keyword].action    = 'mode';
                }

                commands[keyword].action = 'subdevice-' + commands[keyword].action.toLowerCase() + '-' + commands[keyword].subDevice;
              }

              runCommand.runCommand(commands[keyword].device, commands[keyword].action);
            }
          }
        }

        return acted;
      };

      smartThingsMood = function(command, values, controllers) {
        var newEmotion;

        if((values) && (values.mode)) {
          if(mood.mode !== values.mode) {
            switch(values.mode) {
              case 'Home' :
                mood.emotion = 'HAPPY';
                mood.mode    = values.mode;
              break;

              case 'Away' :
                mood.emotion = 'INDIFFERENT';
                mood.mode    = values.mode;
              break;

              case 'Night' :
                mood.emotion = 'SLEEP';
                mood.mode    = values.mode;
              break;
            }

            if(emotion) {
              runCommand.runCommand(deviceId, mood.emotion);
            }
          }
        }

        else {
          switch(command) {
            case 'subdevice-mode-Away' :
              newEmotion = 'INDIFFERENT';
              mood.mode  = 'Away';
            break;

            case 'subdevice-mode-Night' :
              newEmotion = 'SLEEP';
              mood.mode  = 'Night';
            break;

            case 'subdevice-mode-Home' :
              newEmotion = 'HAPPY';
              mood.mode  = 'Home';
            break;
          }

          if((deviceId) && (newEmotion)) {
            mood.emotion = newEmotion;

            runCommand.runCommand(deviceId, mood.emotion);
          }
        }
      };

      if((controllers[device].config) && (controllers[device].config.typeClass === 'jarvis') && (command.indexOf('text-') === 0)) {
        text = command.replace('text-', '').toUpperCase();

        setEmotion(text, device, controllers.config.language);

        if(setDevice(text, controllers, device, config.macros, controllers.config.language)) {
          utterance = utterance.AFFIRMATIVE[Math.floor(Math.random() * utterance.AFFIRMATIVE.length)];
        }

        else {
          utterance = utterance.NEGATIVE[Math.floor(Math.random() * utterance.NEGATIVE.length)];
        }

        for(device in controllers) {
          if(device !== 'config') {
            if(controllers[device].config.typeClass === 'speech') {
              runCommand.runCommand(device, 'text-' + utterance);

              break;
            }
          }
        }
      }

      else if((controllers[device].config) && (controllers[device].config.typeClass === 'smartthings')) {
        smartThingsMood(command, values, controllers);
      }
    }
  };
}());
