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
 * @fileoverview Record Foscam video and audio to disc, while monitoring and
 *               deleting old files to stay within capacity.
 * @requires fs, child_process
 * @note Huge thanks for the ffmpeg syntax found here:
 *       http://foscam.us/forum/post33382.html#p33382
 * @note Requires the installation of ffmpeg.  You can download a .deb for
 *       Raspbian here:
 *       https://github.com/ccrisan/motioneye/wiki/Install-On-Raspbian
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20161016,

    lastEvents : { space : 0 },

    dvrProcess : null,

    deleteOldest : function (controller) {
      var fs = require('fs'),
          path = 'images/foscam/dvr';

      fs.readdir(path, function(err, items) {
        fs.unlink(path + '/' + items[0]);

        console.log('\x1b[35m' + controller.config.title + '\x1b[0m: DVR file ' + items[0] + ' deleted');
      });
    },

    // My testing has shown about 15MB per minute of video.
    checkDisc : function (controller, byteLimit) {
      var fs         = require('fs'),
          path       = 'images/foscam/dvr',
          totalBytes = 0,
          i          = 0;

      fs.readdir(path, function(err, filenames) {
        for (i; i < filenames.length; i += 1) {
          totalBytes += fs.statSync(path + '/' + filenames[i]).size;

          if (totalBytes >= byteLimit) {
            this.deleteOldest(controller);
            break;
          }
        }
      });
    },

    translateCommand : function (config, videoLength) {
      var now       = new Date(),
          year      = now.getFullYear(),
          month     = now.getMonth() + 1,
          day       = now.getDate(),
          hour      = now.getHours(),
          minute    = now.getMinutes(),
          videoPath = 'http://' + config.deviceIp + '/videostream.cgi?user=' + config.username + '&pwd=' + config.password,
          audioPath = 'http://' + config.deviceIp + '/videostream.asf?user=' + config.username + '&pwd=' + config.password,
          localPath = 'images/foscam/dvr',
          filename  = localPath + '/' + year + '-' + month + '-' + day + '-' + hour + '-' + minute + '-%03d.mkv',
          execute   = { command : 'ffmpeg', params : [] };

      execute.params.push('-use_wallclock_as_timestamps');
      execute.params.push(1);
      execute.params.push('-f');
      execute.params.push('mjpeg');
      execute.params.push('-i');
      execute.params.push(videoPath);
      execute.params.push('-i');
      execute.params.push(audioPath);
      execute.params.push('-map');
      execute.params.push('0:v');
      execute.params.push('-map');
      execute.params.push('1:a');
      execute.params.push('-acodec');
      execute.params.push('copy');
      execute.params.push('-vcodec');
      execute.params.push('copy');
      execute.params.push('-f');
      execute.params.push('segment');
      execute.params.push('-segment_time');
      execute.params.push(videoLength);
      execute.params.push('-reset_timestamps');
      execute.params.push(1);
      execute.params.push(filename);

      return execute;
    },

    startDvr : function (controller, videoLength) {
      var spawn       = require('child_process').spawn,
          dvrCommand  = this.translateCommand(controller.config, videoLength),
          deviceTitle = controller.config.title;

      console.log('\x1b[35m' + deviceTitle + '\x1b[0m: DVR started');

      this.dvrProcess = spawn(dvrCommand.command, dvrCommand.params);

      this.dvrProcess.once('close', function () {
        console.log('\x1b[35m' + deviceTitle + '\x1b[0m: DVR stopped');
      });
    },

    stopDvr : function () {
      if (this.dvrProcess) {
        this.dvrProcess.kill();
        this.dvrProcess = null;
      }
    },

    foscamDvr : function (device, command, controllers, values, config) {
      var deviceState  = require(__dirname + '/../lib/deviceState'),
          controller   = controllers[device],
          currentState = deviceState.getDeviceState(device),
          now          = new Date().getTime(),
          delay        = (config.delay || 300) * 1000,
          videoLength  = config.videoLength || 600,
          bytePerMeg   = 1048576,
          byteLimit    = (config.byteLimit || 5120) * bytePerMeg;

      if ((currentState) && (currentState.value)) {
        if ((currentState.value === 'off') && (this.dvrProcess)) {
          this.stopDvr(controller);
        }

        else if ((currentState.value === 'on') && (!this.dvrProcess)) {
          this.startDvr(controller, videoLength);
        }
      }

      // Only care about disc space when something will be written.
      if (this.dvrProcess) {
        // Only check the disc usage after a delay (default 5 minutes) since it
        // may be expensive.
        if (now > (this.lastEvents.space + delay)) {
          this.checkDisc(controller, byteLimit);
          this.lastEvents.space = now;
        }
      }
    }
  };
}());
