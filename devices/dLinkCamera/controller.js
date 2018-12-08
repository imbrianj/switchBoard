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
   * @fileoverview Basic control of D-Link IP camera.
   */
  return {
    version : 20181205,

    inputs  : ['command', 'list', 'stream'],

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
      var auth   = new Buffer(config.username + ':' + config.password).toString('base64'),
          keymap = { 'ALARM_OFF' : '/config/motion.cgi?enable=no',
                     'ALARM_ON'  : '/config/motion.cgi?enable=yes',
                     'DOWN'      : '/cgi-bin/longcctvmove.cgi?action=move&direction=down&panstep=1&tiltstep=1',
                     'LEFT'      : '/cgi-bin/longcctvmove.cgi?action=move&direction=left&panstep=1&tiltstep=1',
                     'PARAMS'    : '/config/motion.cgi',
                     'PRESET1'   : '/cgi-bin/longcctvpst.cgi?action=goto&number=1',
                     'PRESET2'   : '/cgi-bin/longcctvpst.cgi?action=goto&number=2',
                     'PRESET3'   : '/cgi-bin/longcctvpst.cgi?action=goto&number=3',
                     'RIGHT'     : '/cgi-bin/longcctvmove.cgi?action=move&direction=right&panstep=1&tiltstep=1',
                     'STOP'      : '/cgi-bin/longcctvhome.cgi?action=gohome',
                     'UP'        : '/cgi-bin/longcctvmove.cgi?action=move&direction=up&panstep=1&tiltstep=1',
                     'STREAM'    : '/video/mjpg.cgi',
                     'TAKE'      : '/image/jpeg.cgi' };

      config.command = config.stream ? 'STREAM' : config.command;

      return { host    : config.deviceIp,
               port    : config.devicePort,
               path    : keymap[config.command],
               method  : 'GET',
               headers : {
                 Authorization : 'Basic ' + auth
               }
             };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.  We'll also take
     * this opportunity to alter the default markup template with the correct
     * path for the image since it will always be part of a data attribute.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand'),
          deviceId   = controller.config.deviceId;

      runCommand.runCommand(deviceId, 'state', deviceId);
      runCommand.runCommand(deviceId, 'list', deviceId);

      controller.markup = controller.markup.replace('{{DLINKCAMERA_DYNAMIC}}', '/?' + deviceId + '=stream');

      return controller;
    },

    getFilename : function (filename) {
      var validTypes = ['jpg', 'gif', 'mp4'],
          extension  = filename.split('.').pop(),
          clean      = null;

      if (validTypes.indexOf(extension) !== -1) {
        clean = filename.slice(0, -4);
      }

      return clean;
    },

    getRawPhoto : function (dLinkCamera, fileName) {
      var title     = dLinkCamera.title,
          http      = require('http'),
          postData  = this.postPrepare(dLinkCamera),
          request,
          dataReply = [],
          path      = '/images/dlink/photos/';

      request = http.request(postData).on('response', function (response) {
                  response.on('data', function (response) {
                    dataReply.push(response);
                  });

                  response.once('end', function () {
                    console.log('\x1b[35m' + title + '\x1b[0m: Read raw image');

                    dLinkCamera.callback(null, { rawImage : Buffer.concat(dataReply), fileName : path + fileName }, true);
                  });
                });

      request.once('error', function () {
        console.log('\x1b[31m' + title + '\x1b[0m: Error fetching raw photo');
      });

      request.end();
    },

    /**
     * Grab all thumbnail path and assume corresponding screenshot and videos.
     */
    getStoredVideos : function (dLinkCamera) {
      var fs           = require('fs'),
          deviceState  = require(__dirname + '/../../lib/deviceState'),
          path         = 'images/dLinkCamera/thumb',
          that         = this,
          videos       = [],
          currentVideo = {},
          filename;

      fs.readdir(path, function(err, items) {
        var dLinkCameraData = deviceState.getDeviceState(dLinkCamera.deviceId) || { value : null },
            i          = 0;

        dLinkCameraData.value = dLinkCameraData.value || {};

        for (i; i < items.length; i += 1) {
          filename = items[i];

          if (filename.split('.').pop() === 'jpg') {
            filename = that.getFilename(filename);

            if (filename.indexOf(dLinkCamera.deviceId + '-') === 0) {
              currentVideo = {
                name   : filename,
                video  : 'images/dlink/dvr/' + filename + '.mp4',
                screen : 'images/dlink/thumb/' + filename + '.jpg'
              };

              if (fs.existsSync('images/dlink/thumb/' + filename + '.gif')) {
                currentVideo.thumb = 'images/dlink/thumb/' + filename + '.gif';
              }

              videos.push(currentVideo);
            }
          }
        }

        // We want reverse chron for more natural display.
        videos.reverse();

        // But we want to chop off any beyond a decent threshold.
        dLinkCameraData.value.videos = videos.slice(0, dLinkCamera.maxCount);

        dLinkCamera.callback(null, dLinkCameraData.value);
      });
    },

    /**
     * Grab all snapshot photo paths.
     */
    getStoredPhotos : function (dLinkCamera) {
      var fs          = require('fs'),
          deviceState = require(__dirname + '/../../lib/deviceState'),
          path        = '/images/dLinkCamera/photos/',
          that        = this,
          photos      = [],
          filename;

      fs.readdir((__dirname + '/../..' + path), function(err, items) {
        var dLinkCameraData = deviceState.getDeviceState(dLinkCamera.deviceId) || { value : null },
            i         = 0;

        dLinkCameraData.value = dLinkCameraData.value || {};

        for (i; i < items.length; i += 1) {
          filename = items[i];

          if (filename.split('.').pop() === 'jpg') {
            filename = that.getFilename(filename);

            if (filename.indexOf(dLinkCamera.deviceId + '-') === 0) {
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
        dLinkCameraData.value.photos = photos.slice(0, dLinkCamera.maxCount);

        dLinkCamera.callback(null, dLinkCameraData.value);
      });
    },

    /**
     * Prepares and calls send() to request the current state.
     */
    state : function (controller, config, callback) {
      var deviceState = require(__dirname + '/../../lib/deviceState'),
          dLinkCamera      = { device : {}, config : {} };

      callback                        = callback || function () {};
      dLinkCamera.command             = 'state';
      dLinkCamera.device.deviceId     = controller.config.deviceId;
      dLinkCamera.device.deviceIp     = controller.config.deviceIp;
      dLinkCamera.device.localTimeout = controller.config.localTimeout || config.localTimeout;
      dLinkCamera.device.username     = controller.config.username;
      dLinkCamera.device.password     = controller.config.password;
      dLinkCamera.command             = 'PARAMS';

      dLinkCamera.callback = function (err, reply) {
        var dLinkCameraData = deviceState.getDeviceState(dLinkCamera.device.deviceId) || { value : null };

        dLinkCameraData.value = dLinkCameraData.value || {};

        if (reply) {
          if (reply.toString().indexOf('enable=no') !== -1) {
            dLinkCameraData.value.alarm = 'off';
          }

          else if (reply.toString().indexOf('enable=yes') !== -1) {
            dLinkCameraData.value.alarm = 'on';
          }

          callback(dLinkCamera.device.deviceId, null, dLinkCameraData.value, dLinkCameraData);
        }

        else if (err) {
          callback(dLinkCamera.device.deviceId, 'err', 'err');
        }
      };

      this.send(dLinkCamera);
    },

    send : function (config) {
      var http        = require('http'),
          fs          = require('fs'),
          that        = this,
          dLinkCamera = {},
          dataReply   = '',
          request,
          title       = config.device.title,
          now         = new Date(),
          year        = now.getFullYear(),
          month       = ('0' + (now.getMonth() + 1)).slice(-2),
          day         = ('0' + (now.getDate())).slice(-2),
          hour        = ('0' + (now.getHours())).slice(-2),
          minute      = ('0' + (now.getMinutes())).slice(-2),
          second      = ('0' + (now.getSeconds())).slice(-2),
          localPath   = __dirname + '/../../images/dLinkCamera/photos/',
          fileName    = config.device.deviceId + '-' + year + '-' + month + '-' + day + '-' + hour + '-' + minute + '-' + second + '.jpg',
          callback    = config.callback || function () {};

      dLinkCamera.deviceId   = config.device.deviceId;
      dLinkCamera.title      = config.device.title;
      dLinkCamera.deviceIp   = config.device.deviceIp;
      dLinkCamera.timeout    = config.device.localTimeout || config.config.localTimeout;
      dLinkCamera.username   = config.device.username     || 'admin';
      dLinkCamera.password   = config.device.password;
      dLinkCamera.payload    = config.payload;
      dLinkCamera.response   = config.response;
      dLinkCamera.request    = config.request;
      dLinkCamera.stream     = config.stream              || false;
      dLinkCamera.maxCount   = config.device.maxCount     || 20;
      dLinkCamera.command    = config.command             || '';
      dLinkCamera.list       = config.list                || '';
      dLinkCamera.devicePort = config.device.devicePort   || 80;
      dLinkCamera.callback   = callback;
      dLinkCamera.issuer     = config.issuer              || 'localhost';

      if (dLinkCamera.list) {
        this.getStoredPhotos(dLinkCamera);
        this.getStoredVideos(dLinkCamera);
      }

      if (dLinkCamera.stream) {
        dLinkCamera.response.writeHead(200, { 'Content-Type'  : 'multipart/x-mixed-replace;boundary=myboundary',
                                              'Cache-Contorl' : 'multipart/x-mixed-replace;boundary=myboundary',
                                              'Pragma'        : 'no-cache' });

        request = http.request(this.postPrepare(dLinkCamera), function (response) {
          response.on('data', function (response) {
            dLinkCamera.response.write(response);
          });
        });

        request.once('error', function (err) {
          if ((err.code !== 'ETIMEDOUT') || (dLinkCamera.command !== 'state')) {
            dLinkCamera.callback(err, null, true);
          }
        });

        request.end();

        // If the streaming client disconnects or otherwise ends their stream
        // request, we need to abort the stream request from the camera or else
        // it'll keep pulling bytes and writing them to a completed request.
        dLinkCamera.request.once('close', function () {
          request.abort();
        });

        dLinkCamera.request.once('end', function () {
          request.abort();
        });
      }

      else if (dLinkCamera.command === 'TAKE') {
        fs.stat(localPath + fileName, function(err, data) {
          if (err) {
            dLinkCamera.callback = function(err, dataReply) {
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
                    runCommand.runCommand(dLinkCamera.deviceId, 'list', dLinkCamera.deviceId);

                    console.log('\x1b[35m' + title + '\x1b[0m: Image saved as ' + fileName);
                  }
                });
              }

              callback(err, dataReply, !dataReply.photos);
            };

            that.getRawPhoto(dLinkCamera, fileName);
          }

          else if (data) {
            console.log('\x1b[35m' + title + '\x1b[0m: Skipping photo - already exists');
          }
        });
      }

      else {
        request = http.request(this.postPrepare(dLinkCamera), function (response) {
          response.on('data', function (response) {
            dataReply += response;
          });

          response.once('end', function () {
            if(dataReply) {
              dLinkCamera.callback(null, dataReply, true);
            }
          });
        });

        if (dLinkCamera.command === 'state') {
          request.setTimeout(dLinkCamera.timeout, function () {
            request.destroy();
            dLinkCamera.callback({ code : 'ETIMEDOUT' }, null, true);
          });
        }

        request.once('error', function (err) {
          if ((err.code !== 'ETIMEDOUT') || (dLinkCamera.command !== 'state')) {
            dLinkCamera.callback(err, null, true);
          }
        });

        request.end();
      }
    }
  };
}());
