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
 * @fileoverview Simple machine learning used to find simple patterns with
 *               previous events - and suggest or act on any that may be useful.
 * @note Yes, I know this is more "machine learning" than "ai", but it's easier
 *       to abbreviate.
 * @requires fs
 */

module.exports = (function () {
  'use strict';

  var PROCESSED = null;

  return {
    version : 20180801,

    /**
     * Find all unprocessed, raw DB files that need to be processed.
     */
    getUnprocessedFiles : function () {
      var fs       = require('fs'),
          files,
          newFiles = [],
          filename = '',
          dateName = '',
          i        = 0;

      this.readSummaryFile();

      files = fs.readdirSync(__dirname + '/../cache/db/');

      for (i; i < files.length; i += 1) {
        filename = files[i];

        if ((filename !== 'processed.json') && (filename !== '.gitignore')) {
          dateName = parseInt(filename.split('-').join('').split('.json').join(''), 10);

          if ((!PROCESSED) || (dateName > PROCESSED.last)) {
            newFiles.push(filename);
          }
        }
      }

      return newFiles;
    },

    /**
     * Write the processed summary file to disc for persistence.
     */
    writeSummaryFile : function () {
      var fs = require('fs');

      if (PROCESSED) {
        fs.writeFile(__dirname + '/../cache/db/processed.json', JSON.stringify(PROCESSED));
      }
    },

    /**
     * Read in processed summary to memory from disc.
     */
    readSummaryFile : function () {
      var fs = require('fs'),
          data,
          processed;

      try {
        data = fs.readFileSync(__dirname + '/../cache/db/processed.json', 'utf-8');
      }

      catch (catchErr) {
        console.log('\x1b[35mAI\x1b[0m: Processed DB file could not be read');
      }

      if (data) {
        try {
          processed = JSON.parse(data);
        }

        catch (catchErr) {
          console.log('\x1b[31mAI\x1b[0m: Processed DB file could not be parsed');
        }

        if (processed) {
          console.log('\x1b[35mAI\x1b[0m: Processed DB file imported.');

          PROCESSED = processed;
        }
      }
    },

    /**
     * Accept a timestamp and return the generic time category.
     */
    getTimeCategory : function (timestamp) {
      var timeCategory = 0,
          dayCategory  = '',
          days         = { 0 : 'Sun',
                           1 : 'Mon',
                           2 : 'Tue',
                           3 : 'Wed',
                           4 : 'Thur',
                           5 : 'Fri',
                           6 : 'Sat' },
          hour;

      timestamp   = timestamp ? new Date(timestamp) : new Date();
      hour        = timestamp.getHours();
      dayCategory = days[timestamp.getDay()];

      // Behaviors change throughout the day, so we'll bucket data into each
      // distinct hour.
      timeCategory = (hour < 10) ? '0' + hour : hour;

      return dayCategory + '-' + timeCategory;
    },

    /**
     * Run through all logged files that are newer than the last processed, then
     * have that updated processed object be written to file.
     */
    processFiles : function () {
      var fs               = require('fs'),
          unprocessedFiles = this.getUnprocessedFiles(),
          writeSummaryFile = this.writeSummaryFile,
          i                = 0,
          that             = this;

      for (i; i < unprocessedFiles.length; i += 1) {
        (function (filename) {
          fs.readFile(__dirname + '/../cache/db/' + filename, 'utf-8', function (err, data) {
            var unprocessed    = null,
                category       = '',
                j              = 0,
                k              = 0,
                l              = 0,
                deviceId       = '',
                command        = '',
                stateDevice    = {},
                stateDeviceId  = '',
                stateSubDevice = {};

            if (data) {
              try {
                unprocessed = JSON.parse(data);
              }

              catch (catchErr) {
                console.log('\x1b[31mAI\x1b[0m: Unprocessed DB file could not be read');
              }

              if (unprocessed) {
                for (j; j < unprocessed.length; j += 1) {
                  deviceId = unprocessed[j].deviceId;
                  command  = unprocessed[j].command;
                  category = that.getTimeCategory(unprocessed[j].timestamp);

                  PROCESSED                                    = PROCESSED                                    || {};
                  PROCESSED[category]                          = PROCESSED[category]                          || {};
                  PROCESSED[category][deviceId]                = PROCESSED[category][deviceId]                || {};
                  PROCESSED[category][deviceId][command]       = PROCESSED[category][deviceId][command]       || { count: 0 };
                  PROCESSED[category][deviceId][command].state = PROCESSED[category][deviceId][command].state || {};

                  PROCESSED[category][deviceId][command].count += 1;

                  for (k = 0; k < unprocessed[j].globalState.length; k += 1) {
                    stateDevice   = unprocessed[j].globalState[k];
                    stateDeviceId = stateDevice.deviceId;

                    PROCESSED[category][deviceId][command].state[stateDeviceId] = PROCESSED[category][deviceId][command].state[stateDeviceId] || {};

                    // "state" is only "ok" or "err", so we can easily find
                    // quantifiable values.
                    PROCESSED[category][deviceId][command].state[stateDeviceId][stateDevice.state]  = PROCESSED[category][deviceId][command].state[stateDeviceId][stateDevice.state] || 0;
                    PROCESSED[category][deviceId][command].state[stateDeviceId][stateDevice.state] += 1;

                    // At least for now, we'll ignore the valuable "value" field
                    // since it can contain any type of data value - making it
                    // pretty heavy to both store and parse.

                    if (stateDevice.devices) {
                      for (l = 0; l < stateDevice.devices.length; l += 1) {
                        stateSubDevice = stateDevice.devices[l];

                        if (stateSubDevice && stateSubDevice.state) {
                          PROCESSED[category][deviceId][command].state[stateDeviceId]                                                     = PROCESSED[category][deviceId][command].state[stateDeviceId]                                                     || {};
                          PROCESSED[category][deviceId][command].state[stateDeviceId].devices                                             = PROCESSED[category][deviceId][command].state[stateDeviceId].devices                                             || {};
                          PROCESSED[category][deviceId][command].state[stateDeviceId].devices[stateSubDevice.label]                       = PROCESSED[category][deviceId][command].state[stateDeviceId].devices[stateSubDevice.label]                       || {};
                          PROCESSED[category][deviceId][command].state[stateDeviceId].devices[stateSubDevice.label][stateSubDevice.state] = PROCESSED[category][deviceId][command].state[stateDeviceId].devices[stateSubDevice.label][stateSubDevice.state] || 0;
                          // TODO: Subdevice "state" is typically just
                          // "on"/"off", but "peripheral" or even non-standard
                          // values are possible.
                          PROCESSED[category][deviceId][command].state[stateDeviceId].devices[stateSubDevice.label][stateSubDevice.state] += 1;
                        }
                      }
                    }
                  }
                }
              }

              PROCESSED.last = parseInt(filename.split('-').join('').split('.json').join(''), 10);

              if (unprocessedFiles[unprocessedFiles.length - 1] === filename) {
                writeSummaryFile();
              }
            }
          });
        })(unprocessedFiles[i]);
      }
    },

    /**
     * Accept a deviceID and subdevice name and return it's current state.
     */
    findDevice : function (deviceId, subdeviceId, controllers, eventCooldownMinutes) {
      var deviceState  = require(__dirname + '/deviceState'),
          currentState = deviceState.getDeviceState(deviceId),
          now,
          returnState,
          i            = 0;

      if (currentState) {
        if ((!subdeviceId) && (!controllers[deviceId].readOnly)) {
          returnState = currentState;
        }

        else if ((currentState.value) && (currentState.value.devices)) {
          for (i; i < currentState.value.devices.length; i += 1) {
            if (subdeviceId === currentState.value.devices[i].label) {
              now = new Date().getTime();

              if (!currentState.value.devices[i].readOnly) {
                if (((!currentState.value.devices[i].lastOn) && (!currentState.value.devices[i].lastOff))                                       ||
                    ((currentState.value.devices[i].lastOn)  && (now > currentState.value.devices[i].lastOn  + (eventCooldownMinutes * 60000))) ||
                    ((currentState.value.devices[i].lastOff) && (now > currentState.value.devices[i].lastOff + (eventCooldownMinutes * 60000)))) {
                  returnState = currentState.value.devices[i];
                }

                else {
                  console.log('\x1b[35mAI\x1b[0m: Ignoring ' + currentState.value.devices[i].label + ' since it recently changed state.');
                }
              }

              break;
            }
          }
        }
      }

      return returnState;
    },

    /**
     * Accept a deviceID and command to determine if there's a state change that
     * can be correlated with a defined level of confidence.
     */
    findActionConfidence : function (deviceId, command, config, controllers) {
      var category             = this.getTimeCategory(),
          summary              = PROCESSED && PROCESSED[category] && PROCESSED[category][deviceId] ? PROCESSED[category][deviceId][command] : null,
          subdevice            = {},
          device               = '',
          subdeviceId          = '',
          intendedDevice       = {},
          valueType            = '',
          values               = {},
          total                = 0,
          intent               = [],
          minimumThreshold     = config.ai.minimumThreshold     || 60,
          eventCooldownMinutes = config.ai.eventCooldownMinutes || 120,
          confidence;

      if (summary) {
        if (summary.count > minimumThreshold) {
          for (device in summary.state) {
            // summary.state[i] will have a "ok"/"err" values, but we won't
            // worry about them for now.

            // For now, we'll only care about subdevices.
            if (summary.state[device].devices) {
              for (subdeviceId in summary.state[device].devices) {
                if (summary.state[device].devices[subdeviceId]) {
                  values    = {};
                  total     = 0;
                  subdevice = summary.state[device].devices[subdeviceId];

                  for (valueType in subdevice) {
                    if (subdevice[valueType]) {
                      values[valueType] = subdevice[valueType];
                      total            += subdevice[valueType];
                    }
                  }

                  // We need to check both the triggering event for threshold
                  // since it's quick - but we will also need to check the
                  // threshold of the target subdevice since it may be installed
                  // after the triggering device.
                  if ((total) && (total > minimumThreshold)) {
                    for (valueType in values) {
                      if (values[valueType]) {
                        confidence = parseInt(((values[valueType] / total) * 100), 10);

                        // Only indicate intent if it differs from the current
                        // state or is not read only.
                        intendedDevice = this.findDevice(deviceId, subdeviceId, controllers, eventCooldownMinutes);

                        if (confidence > config.ai.confidence) {
                          if ((intendedDevice) && (intendedDevice.state) && (intendedDevice.state !== valueType)) {
                            console.log('\x1b[35mAI\x1b[0m: Intent available with ' + confidence + '% confidence that ' + subdeviceId + ' should be ' + valueType + '.');

                            intent.push({ device     : device,
                                          subdevice  : subdeviceId,
                                          command    : valueType,
                                          confidence : confidence });
                          }

                          else if ((intendedDevice) && (intendedDevice.state)) {
                            console.log('\x1b[35mAI\x1b[0m: Already set, but ' + confidence + '% confident ' + subdeviceId + ' should be ' + valueType + '.');
                          }
                        }

                        else if (intendedDevice) {
                          console.log('\x1b[35mAI\x1b[0m: Only ' + confidence + '% confident ' + subdeviceId + ' should be ' + valueType + '.');
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        else {
          console.log('\x1b[35mAI\x1b[0m: Only ' + summary.count + ' events for ' + deviceId + ' ' + command + '.');
        }
      }

      return intent;
    }
  };
}());
