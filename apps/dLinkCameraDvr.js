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
 * @fileoverview Record D-Link video and audio to disc, while monitoring and
 *               deleting old files to stay within capacity.
 * @requires fs, child_process
 * @note Requires the installation of ffmpeg.  You can download a .deb for
 *       Raspbian here (just follow step 1):
 *       https://github.com/ccrisan/motioneye/wiki/Install-On-Raspbian
 */

module.exports = (function () {
  'use strict';

  var Devices = {};

  return {
    version : 20191207,

    lastEvents : { space : 0, thumbnail : 0 },

    dvrProcess : null,

    getFirstFile : function (files) {
      var staticAssets = require(__dirname + '/../lib/staticAssets'),
          i            = 0,
          file         = null;

      for (i; i < files.length; i += 1) {
        file = staticAssets.getFilename(files[i], ['jpg', 'gif', 'mp4']);

        if (file) {
          break;
        }
      }

      return file;
    },

    deleteFile : function (filename, title) {
      var fs = require('fs');

      fs.stat(filename, function (err) {
        if (!err) {
          fs.unlink(filename);

          console.log('\x1b[35m' + title + '\x1b[0m: DVR files for ' + filename + ' deleted');
        }
      });
    },

    deleteOldest : function (controller) {
      var fs         = require('fs'),
          self       = this,
          runCommand = require(__dirname + '/../lib/runCommand'),
          mp4Path    = 'images/dLinkCamera/dvr',
          gifPath    = 'images/dLinkCamera/thumb',
          jpgPath    = gifPath,
          title      = controller.config.title,
          filename;

      fs.readdir(mp4Path, function(err, items) {
        filename = self.getFirstFile(items);

        if (filename) {
          self.deleteFile(mp4Path + '/' + filename + '.mp4', title);
          self.deleteFile(gifPath + '/' + filename + '.gif', title);
          self.deleteFile(jpgPath + '/' + filename + '.jpg', title);

          runCommand.runCommand(controller.config.deviceId, 'list');
        }
      });
    },

    // My testing has shown about 1MB per minute of video.
    checkDisc : function (controller, byteLimit) {
      var fs         = require('fs'),
          self       = this,
          path       = 'images/dLinkCamera/dvr',
          totalBytes = 0,
          i          = 0;

      fs.readdir(path, function(err, filenames) {
        for (i; i < filenames.length; i += 1) {
          totalBytes += fs.statSync(path + '/' + filenames[i]).size;

          if (totalBytes >= byteLimit) {
            self.deleteOldest(controller);
            break;
          }
        }
      });
    },

    checkThumbnails : function (controller, thumbByteLimit, enableThumbnail) {
      var fs           = require('fs'),
          staticAssets = require(__dirname + '/../lib/staticAssets'),
          path         = 'images/dLinkCamera/',
          i            = 0,
          self         = this;

      fs.readdir(path + 'dvr', function(err, items) {
        for (i; i < items.length; i += 1) {
          (function (filename) {
            if (filename) {
              fs.stat(path + 'dvr/' + filename + '.mp4', function (err, stats) {
                if (stats.size >= thumbByteLimit) {
                  fs.stat(path + 'thumb/' + filename + (enableThumbnail ? '.gif' : '.jpg'), function (err, stats) {
                    // If we don't have a thumbnail for a video file larger than
                    // the defined threshold, let's generate them.
                    if (!stats) {
                      self.buildThumbnails(controller, filename, enableThumbnail);
                    }
                  });
                }
              });
            }
          })(staticAssets.getFilename(items[i], ['jpg', 'gif', 'mp4']));
        }
      });
    },

    buildThumbnails : function (controller, filename, enableThumbnail) {
      var spawn             = require('child_process').spawn,
          runCommand        = require(__dirname + '/../lib/runCommand'),
          screenshotCommand = this.translateScreenshotCommand(filename),
          thumbCommand      = this.translateThumbCommand(filename),
          imageProcess;

      console.log('\x1b[35m' + controller.config.title + '\x1b[0m: Creating DVR thumbnail for ' + filename);

      // Thumbnail processing can be extremely expensive.  If you don't want to
      // show any thumbnails, let's just skip that step to keep things speedy.
      // We will continue to generate thumbnails and store video since you can
      // still access those without an interface - and screenshots are cheaply
      // generated.
      if ((enableThumbnail) && (controller.config.maxCount) && (!isNaN(controller.config.maxCount))) {
        spawn(screenshotCommand.command, screenshotCommand.params);
        imageProcess = spawn(thumbCommand.command, thumbCommand.params);
      }

      else {
        imageProcess = spawn(screenshotCommand.command, screenshotCommand.params);
      }

      if (imageProcess) {
        // Thumbnails take longer than screenshots, so we'll run the list command
        // after it's completed.
        imageProcess.once('close', function () {
          console.log('\x1b[35m' + controller.config.title + '\x1b[0m: DVR thumbnails created for ' + filename);

          runCommand.runCommand(controller.config.deviceId, 'list');
        });

        imageProcess.stderr.on('data', function (data) {
          data = data.toString();

          // If you need help debugging ffmpeg, uncomment the following line:
          // console.log(data);
        });
      }
    },

    translateScreenshotCommand : function (filename) {
      var input   = 'images/dLinkCamera/dvr/' + filename + '.mp4',
          output  = 'images/dLinkCamera/thumb/' + filename + '.jpg',
          execute = { command : 'ffmpeg', params : [] };

      execute.params.push('-ss');
      execute.params.push('00:00:00');
      execute.params.push('-i');
      execute.params.push(input);
      execute.params.push('-vframes');
      execute.params.push(1);
      execute.params.push('-q:v');
      execute.params.push('10');
      execute.params.push('-vf');
      execute.params.push('scale=200:-1');
      execute.params.push(output);

      return execute;
    },

    translateThumbCommand : function (filename) {
      var input   = 'images/dLinkCamera/dvr/' + filename + '.mp4',
          output  = 'images/dLinkCamera/thumb/' + filename + '.gif',
          execute = { command : 'ffmpeg', params : [] };

      execute.params.push('-i');
      execute.params.push(input);
      execute.params.push('-r');
      execute.params.push(5);
      execute.params.push('-vf');
      execute.params.push('setpts=0.05*PTS, scale=200:-1');
      execute.params.push(output);

      return execute;
    },

    translateVideoCommand : function (config, videoLength) {
      var now       = new Date(),
          year      = now.getFullYear(),
          month     = ('0' + (now.getMonth() + 1)).slice(-2),
          day       = ('0' + (now.getDate())).slice(-2),
          hour      = ('0' + (now.getHours())).slice(-2),
          minute    = ('0' + (now.getMinutes())).slice(-2),
          deviceId  = config.deviceId,
          inputPath = 'rtsp://' + config.username + ':' + config.password + '@' + config.deviceIp + '/live2.sdp',
          localPath = 'images/dLinkCamera/dvr',
          output    = localPath + '/' + deviceId + '-' + year + '-' + month + '-' + day + '-' + hour + '-' + minute + '-%03d.mp4',
          execute   = { command : 'ffmpeg', params : [] };

      execute.params.push('-i');
      execute.params.push(inputPath);
      execute.params.push('-use_wallclock_as_timestamps');
      execute.params.push(1);
      // Finding something with wide HTML5 support doesn't seem likely.  We'll
      // just use aac/h.264 and assume we'll view in an external app (VLC, for
      // example).
      execute.params.push('-acodec');
      execute.params.push('aac');
      execute.params.push('-vcodec');
      execute.params.push('h264');
      execute.params.push('-f');
      execute.params.push('segment');
      execute.params.push('-segment_time');
      execute.params.push(videoLength);
      execute.params.push('-reset_timestamps');
      execute.params.push(1);
      execute.params.push(output);

      return execute;
    },

    startDvr : function (controller, deviceId, videoLength) {
      var spawn       = require('child_process').spawn,
          dvrCommand  = this.translateVideoCommand(controller.config, videoLength),
          deviceTitle = controller.config.title,
          self        = this;

      console.log('\x1b[35m' + deviceTitle + '\x1b[0m: DVR started');

      Devices[deviceId].dvrProcess = spawn(dvrCommand.command, dvrCommand.params);

      Devices[deviceId].dvrProcess.stderr.on('data', function (data) {
        data = data.toString();

        // If you need help debugging ffmpeg, uncomment the following line:
        // console.log(data);
      });

      Devices[deviceId].dvrProcess.once('close', function () {
        // When recording is over, we can safely build out any remaining
        // thumbnails.
        self.checkThumbnails(controller, 0);

        console.log('\x1b[35m' + deviceTitle + '\x1b[0m: DVR stopped');
      });

      Devices[deviceId].dvrProcess.once('error', function () {
        console.log('\x1b[31m' + deviceTitle + '\x1b[0m: Exception in DVR.  Do you have ffmpeg installed?');
      });
    },

    stopDvr : function (deviceId) {
      var now = new Date().getTime();

      if (Devices[deviceId].dvrProcess) {
        Devices[deviceId].dvrProcess.kill();
        Devices[deviceId].dvrProcess = null;

        Devices[deviceId].lastEvents.thumbnail = now;
      }
    },

    dLinkCameraDvr : function (deviceId, command, controllers, values, config) {
      var deviceState     = require(__dirname + '/../lib/deviceState'),
          controller      = controllers[deviceId],
          currentState    = deviceState.getDeviceState(deviceId),
          now             = new Date().getTime(),
          delay           = (config.delay      || 300) * 1000,
          enableThumbnail = config.thumbnail   || false,
          videoLength     = config.videoLength || 600,
          bytePerMeg      = 1048576,
          roughMbPerMin   = 1,
          // Maximum MB limit for all stored videos before we start deleting
          // old files till we fall below that threshold.
          byteLimit       = (config.byteLimit || 5000) * bytePerMeg,
          // Minimum MB limit for a video file before we bother building a
          // thumbnail set for it.  Any files that are smaller than this size
          // will have thumbnails generated when recordig has ended.
          thumbByteLimit  = (config.thumbByteLimit || (roughMbPerMin * (videoLength / 60))) * bytePerMeg;

      Devices[deviceId] = Devices[deviceId] || {dvrProcess: null, lastEvents : { space : 0, thumbnail : 0 } };

      if ((currentState) && (currentState.value)) {
        if ((currentState.value.alarm === 'off') && (Devices[deviceId].dvrProcess)) {
          this.stopDvr(deviceId);
        }

        else if ((currentState.value.alarm === 'on') && (!Devices[deviceId].dvrProcess)) {
          this.startDvr(controller, deviceId, videoLength);
        }
      }

      // Only care about disc space when something will be written.
      if (Devices[deviceId].dvrProcess) {
        // Only check the disc usage after a delay (default 5 minutes) since it
        // may be expensive.
        if (now > (this.lastEvents.space + delay)) {
          this.checkDisc(controller, byteLimit);
          this.lastEvents.space = now;
        }

        if (now > (this.lastEvents.thumbnail + delay)) {
          this.checkThumbnails(controller, thumbByteLimit, enableThumbnail);
          this.lastEvents.thumbnail = now;
        }
      }
    }
  };
}());
