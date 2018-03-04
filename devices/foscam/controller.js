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
   * @requires http, fs
   * @fileoverview Basic control of Foscam IP camera.
   */
  return {
    version : 20180303,

    inputs  : ['command', 'list'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap  : ['ALARM_OFF', 'ALARM_ON', 'DOWN', 'LEFT', 'PRESET1', 'PRESET2', 'PRESET3', 'RIGHT', 'STOP', 'UP', 'TAKE'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { photos : fs.readFileSync(__dirname + '/fragments/photos.tpl', 'utf-8'),
               photo  : fs.readFileSync(__dirname + '/fragments/photo.tpl',  'utf-8'),
               videos : fs.readFileSync(__dirname + '/fragments/videos.tpl', 'utf-8'),
               video  : fs.readFileSync(__dirname + '/fragments/video.tpl',  'utf-8'),
               thumb  : fs.readFileSync(__dirname + '/fragments/thumb.tpl',  'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      var path   = '',
          login  = '?user=' + config.username + '&amp;pwd=' + config.password + '&amp;',
          keymap = { 'ALARM_OFF' : '/set_alarm.cgi' + login + 'motion_armed=0',
                     'ALARM_ON'  : '/set_alarm.cgi' + login + 'motion_armed=1',
                     'DOWN'      : '/decoder_control.cgi' + login + 'command=2',
                     'LEFT'      : '/decoder_control.cgi' + login + 'command=6',
                     'PRESET1'   : '/decoder_control.cgi' + login + 'command=31',
                     'PRESET2'   : '/decoder_control.cgi' + login + 'command=33',
                     'PRESET3'   : '/decoder_control.cgi' + login + 'command=35',
                     'RIGHT'     : '/decoder_control.cgi' + login + 'command=4',
                     'STOP'      : '/decoder_control.cgi' + login + 'command=1',
                     'UP'        : '/decoder_control.cgi' + login + 'command=0',
                     'TAKE'      : '/snapshot.cgi' + login,
                     'PARAMS'    : '/get_params.cgi' + login };

      path = keymap[config.command];

      return { host   : config.deviceIp,
               port   : config.devicePort,
               path   : path,
               method : 'GET' };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.  We'll also take
     * this opportunity to alter the default markup template with the correct
     * path for the image since it will always be part of a data attribute.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'state', controller.config.deviceId);
      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);

      controller.markup = controller.markup.replace('{{FOSCAM_DYNAMIC}}', 'http://' + controller.config.deviceIp + '/videostream.cgi?user=' + controller.config.username + '&amp;pwd=' + controller.config.password);

      return controller;
    },

    getFilename : function (filename) {
      var validTypes = ['jpg', 'gif', 'mkv'],
          extension  = filename.split('.').pop(),
          clean      = null;

      if (validTypes.indexOf(extension) !== -1) {
        clean = filename.slice(0, -4);
      }

      return clean;
    },

    getRawPhoto : function (foscam, fileName) {
      var title     = foscam.title,
          http      = require('http'),
          postData  = this.postPrepare(foscam),
          imageUrl  = 'http://' + postData.host + ':' + postData.port + postData.path,
          request,
          dataReply = [],
          path      = '/images/foscam/photos/';

      request = http.request(imageUrl).on('response', function (response) {
                  response.on('data', function (response) {
                    dataReply.push(response);
                  });

                  response.once('end', function () {
                    console.log('\x1b[35m' + title + '\x1b[0m: Read raw image');

                    foscam.callback(null, { rawImage : Buffer.concat(dataReply), fileName : path + fileName }, true);
                  });
                });

      request.end();
    },

    /**
     * Grab all thumbnail path and assume corresponding screenshot and videos.
     */
    getStoredVideos : function (foscam) {
      var fs           = require('fs'),
          deviceState  = require(__dirname + '/../../lib/deviceState'),
          path         = 'images/foscam/thumb',
          that         = this,
          videos       = [],
          currentVideo = {},
          filename;

      fs.readdir(path, function(err, items) {
        var foscamData = deviceState.getDeviceState(foscam.deviceId) || { value : null },
            i          = 0;

        foscamData.value = foscamData.value || {};

        for (i; i < items.length; i += 1) {
          filename = items[i];

          if (filename.split('.').pop() === 'jpg') {
            filename = that.getFilename(filename);

            if (filename.indexOf(foscam.deviceId + '-') === 0) {
              currentVideo = {
                name   : filename,
                video  : 'images/foscam/dvr/' + filename + '.mkv',
                screen : 'images/foscam/thumb/' + filename + '.jpg'
              };

              if (fs.existsSync('images/foscam/thumb/' + filename + '.gif')) {
                currentVideo.thumb = 'images/foscam/thumb/' + filename + '.gif';
              }

              videos.push(currentVideo);
            }
          }
        }

        // We want reverse chron for more natural display.
        videos.reverse();

        // But we want to chop off any beyond a decent threshold.
        foscamData.value.videos = videos.slice(0, foscam.maxCount);

        foscam.callback(null, foscamData.value);
      });
    },

    /**
     * Grab all snapshot photo paths.
     */
    getStoredPhotos : function (foscam) {
      var fs          = require('fs'),
          deviceState = require(__dirname + '/../../lib/deviceState'),
          path        = '/images/foscam/photos/',
          that        = this,
          photos      = [],
          filename;

      fs.readdir((__dirname + '/../..' + path), function(err, items) {
        var foscamData = deviceState.getDeviceState(foscam.deviceId) || { value : null },
            i          = 0;

        foscamData.value = foscamData.value || {};

        for (i; i < items.length; i += 1) {
          filename = items[i];

          if (filename.split('.').pop() === 'jpg') {
            filename = that.getFilename(filename);

            if (filename.indexOf(foscam.deviceId + '-') === 0) {
              photos.push({
                name  : filename,
                photo : path + filename + '.jpg'
              });
            }
          }
        }

        // We want reverse chron for more natural display.
        photos.reverse();

        // But we want to chop off any beyond a decent threshold.
        foscamData.value.photos = photos.slice(0, foscam.maxCount);

        foscam.callback(null, foscamData.value);
      });
    },

    /**
     * Prepares and calls send() to request the current state.
     */
    state : function (controller, config, callback) {
      var deviceState = require(__dirname + '/../../lib/deviceState'),
          foscam      = { device : {}, config : {} };

      callback                   = callback || function () {};
      foscam.command             = 'state';
      foscam.device.deviceId     = controller.config.deviceId;
      foscam.device.deviceIp     = controller.config.deviceIp;
      foscam.device.localTimeout = controller.config.localTimeout || config.localTimeout;
      foscam.device.username     = controller.config.username;
      foscam.device.password     = controller.config.password;
      foscam.command             = 'PARAMS';

      foscam.callback = function (err, reply) {
        var foscamData = deviceState.getDeviceState(foscam.device.deviceId) || { value : null };

        foscamData.value = foscamData.value || {};

        if (reply) {
          if (reply.toString().indexOf('var alarm_motion_armed=0') !== -1) {
            foscamData.value.alarm = 'off';
          }

          else if (reply.toString().indexOf('var alarm_motion_armed=1') !== -1) {
            foscamData.value.alarm = 'on';
          }

          callback(foscam.device.deviceId, null, foscamData.value, foscamData);
        }

        else if (err) {
          callback(foscam.device.deviceId, 'err', 'err');
        }
      };

      this.send(foscam);
    },

    send : function (config) {
      var http      = require('http'),
          fs        = require('fs'),
          that      = this,
          foscam    = {},
          dataReply = '',
          request,
          title     = config.device.title,
          now       = new Date(),
          year      = now.getFullYear(),
          month     = ('0' + (now.getMonth() + 1)).slice(-2),
          day       = ('0' + (now.getDate())).slice(-2),
          hour      = ('0' + (now.getHours())).slice(-2),
          minute    = ('0' + (now.getMinutes())).slice(-2),
          second    = ('0' + (now.getSeconds())).slice(-2),
          localPath = __dirname + '/../../images/foscam/photos/',
          fileName  = config.device.deviceId + '-' + year + '-' + month + '-' + day + '-' + hour + '-' + minute + '-' + second + '.jpg',
          callback  = config.callback || function () {};

      foscam.deviceId   = config.device.deviceId;
      foscam.title      = config.device.title;
      foscam.deviceIp   = config.device.deviceIp;
      foscam.timeout    = config.device.localTimeout || config.config.localTimeout;
      foscam.username   = config.device.username;
      foscam.password   = config.device.password;
      foscam.payload    = config.payload;
      foscam.maxCount   = config.device.maxCount     || 20;
      foscam.command    = config.command             || '';
      foscam.list       = config.list                || '';
      foscam.devicePort = config.device.devicePort   || 80;
      foscam.callback   = callback;
      foscam.issuer     = config.issuer              || 'localhost';

      if (foscam.list) {
        this.getStoredPhotos(foscam);
        this.getStoredVideos(foscam);
      }

      if (foscam.command === 'TAKE') {
        fs.stat(localPath + fileName, function(err, data) {
          if (err) {
            foscam.callback = function(err, dataReply) {
              var rawImage = dataReply.rawImage;

              if (rawImage) {
                fs.writeFile(localPath + fileName, rawImage, 'binary', function(err) {
                  var runCommand;

                  if (err) {
                    console.log('\x1b[31m' + title + '\x1b[0m: Unable to save ' + fileName);
                  }

                  else {
                    // Issue a full command to ensure we have the right
                    // callback.
                    runCommand = require(__dirname + '/../../lib/runCommand');
                    runCommand.runCommand(foscam.deviceId, 'list', foscam.deviceId);

                    console.log('\x1b[35m' + title + '\x1b[0m: Image saved as ' + fileName);
                  }
                });
              }

              callback(err, dataReply, !dataReply.photos);
            };

            that.getRawPhoto(foscam, fileName);
          }

          else if (data) {
            console.log('\x1b[35m' + title + '\x1b[0m: Skipping photo - already exists');
          }
        });
      }

      else {
        request = http.request(this.postPrepare(foscam), function (response) {
          response.on('data', function (response) {
            dataReply += response;
          });

          response.once('end', function () {
            if(dataReply) {
              foscam.callback(null, dataReply, true);
            }
          });
        });

        if (foscam.command === 'state') {
          request.setTimeout(foscam.timeout, function () {
            request.destroy();
            foscam.callback({ code : 'ETIMEDOUT' }, null, true);
          });
        }

        request.once('error', function (err) {
          if ((err.code !== 'ETIMEDOUT') || (foscam.command !== 'state')) {
            foscam.callback(err, null, true);
          }
        });

        request.end();
      }
    }
  };
}());
