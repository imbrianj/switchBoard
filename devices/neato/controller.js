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
   * @fileoverview Control of Neato botvac.
   * @requires https, crypto
   */
  return {
    version : 20200412,

    inputs  : ['command', 'list'],

    /**
     * Whitelist of available key codes to use.
     */
    keymap : ['START', 'STOP', 'RETURN', 'PAUSE', 'RESUME', 'ENABLE_SCHEDULE', 'DISABLE_SCHEDULE', 'GET_STATE'],

    reqid : 0,

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (neato) {
      var crypto = require('crypto'),
          data,
          date,
          hmac,
          postData = neato.postRequest,
          config   = { host    : neato.host,
                       port    : neato.port,
                       path    : neato.path,
                       method  : neato.method || 'GET',
                       headers : { 'Accept-Charset' : 'utf-8',
                                   'User-Agent'     : 'node-switchBoard',
                                   'Content-Type'   : 'application/json',
                                   'X-Agent'        : 'node-switchBoard' } };

      if ((neato.list || neato.command) && neato.auth && neato.auth.robot) {
        neato.serial = neato.auth.robot.serial;
        neato.secret = neato.auth.robot.secret;
        config.host  = 'nucleo.neatocloud.com';
        config.port  = 4443;
        config.path  = '/vendors/neato/robots/' + neato.serial + '/messages';

        if ((neato.serial) && (neato.secret)) {
          date = new Date().toUTCString();
          data = neato.serial.toLowerCase() + "\n" + date + "\n" + postData;
          data = [neato.serial.toLowerCase(), date, postData].join("\n");
          hmac = crypto.createHmac('sha256', neato.secret).update(data).digest('hex');

          config.headers.Date = date;
          config.headers.Authorization = 'NEATOAPP ' + hmac;
        }
      }

      if (!neato.auth && neato.username && neato.password) {
        if (config.host.indexOf('beehive') !== -1) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        else {
          config.headers['Content-Type'] = 'application/json';
        }
      }

      if (config.host.indexOf('beehive') !== -1) {
        config.headers.Accept = 'application/vnd.neato.beehive.v1+json';

        if ((neato.auth) && (neato.auth.token)) {
          config.headers.Authorization = 'Bearer ' + neato.auth.token;
        }
      }

      else if (config.host.indexOf('nucleo') !== -1) {
        config.method         = 'POST';
        config.headers.Accept = 'application/vnd.neato.nucleo.v1';
      }

      if (config.method === 'POST') {
        config.headers['Content-Length'] = postData.length;
      }

      return config;
    },

    /**
     * Prepare the POST data to be sent.
     */
    postData : function (neato, increment) {
      var querystring = require('querystring'),
          command     = neato.list ? 'GET_STATE' : neato.command,
          postData    = '{}',
          commands    = {
            START            : 'startCleaning',
            STOP             : 'stopCleaning',
            RETURN           : 'sendToBase',
            PAUSE            : 'pauseCleaning',
            RESUME           : 'resumeCleaning',
            ENABLE_SCHEDULE  : 'enableSchedule',
            DISABLE_SCHEDULE : 'disableSchedule',
            GET_STATE        : 'getRobotState'
          };

      if (command && commands[command]) {
        postData = JSON.stringify({
                     reqId  : this.reqid,
                     cmd    : commands[command],
                     params : command === 'START' && {
                       category       : neato.nogo ? 4 : 2,
                       mode           : neato.eco  ? 1 : 2,
                       modifier       : 1,
                       navigationMode : neato.extraCare ? 2 : 1
                     }
                   });

        if (increment) {
          this.reqid += 1;
        }
      }

      else {
        postData = querystring.stringify({
                     email    : neato.username,
                     password : neato.password
                   });
      }

      return postData;
    },

    /**
     * Query - then cache your auth information into a file for later recall.
     */
    getAuth : function (config, controller) {
      var that  = this,
          neato = {
            device : {
              title    : config.device.title,
              deviceId : config.device.deviceId,
              host     : 'beehive.neatocloud.com',
              path     : '/sessions',
              username : config.device.username,
              password : config.device.password,
              method   : 'POST'
            }
          };

      // This request is for your token.
      neato.callback = function (error, response) {
        var fs         = require('fs'),
            auth       = {},
            cache,
            neatoRobot = {
              device : {
                title    : config.device.title,
                deviceId : config.device.deviceId,
                host     : 'beehive.neatocloud.com',
                path     : '/users/me/robots',
                username : config.device.username,
                password : config.device.password,
                method   : 'GET',
                auth     : {}
              }
            };

        if (!error) {
          if (response.error) {
            console.log('\x1b[31m' + controller.config.title + '\x1b[0m: ' + response.error_description);
          }

          else {
            auth.token             = response.access_token;
            auth.time              = new Date(response.current_time).getTime();
            neatoRobot.device.auth = auth;

            // This request is for your robot info.
            neatoRobot.callback = function (err, robotResponse) {
              if (err) {
                console.log('\x1b[31m' + controller.config.title + '\x1b[0m: ' + err);
              }

              else {
                auth.robot = that.findRobot(robotResponse, config);
                controller.config.auth = auth;

                cache = fs.createWriteStream(__dirname + '/../../cache/neatoAuth-' + controller.config.deviceId + '.json');
                cache.once('open', function () {
                  console.log('\x1b[35m' + controller.config.title + '\x1b[0m: Auth data cached with URL');

                  cache.write(JSON.stringify(auth));
                });
              }
            };

            that.send(neatoRobot);
          }
        }
      };

      this.send(neato);
    },

    /**
     * For each map, fetch it's image and save it locally for quicker and
     * offline recall.  If the image is already cached, it will be retained.
     */
    cacheImage : function (map, config) {
      var fs        = require('fs'),
          fileName  = config.deviceId + '-' + new Date(map.id).getTime() + '.png',
          filePath  = __dirname + '/../../images/neato/' + fileName,
          https,
          request,
          dataReply = '',
          image;

      try {
        image = fs.statSync(filePath);
      }

      catch (catchErr) {
        https   = require('https');

        request = https.request(map.url).on('response', function (response) {
                    response.setEncoding('binary');

                    response.on('data', function (response) {
                      dataReply += response;
                    });

                    response.once('end', function () {
                      console.log('\x1b[35m' + config.deviceId + '\x1b[0m: Saved image for ' + fileName);

                      fs.writeFile(filePath, dataReply, 'binary', function(err) {
                        if (err) {
                          console.log('\x1b[31m' + config.deviceId + '\x1b[0m: Unable to save ' + fileName);
                        }
                      });
                    });
                  });

        request.end();
      }

      return '/images/neato/' + fileName;
    },

    /**
     * Grabs cleaning maps and caches them to disc for persistent and easy
     * display.
     */
    getMaps : function (config) {
      var that  = this,
          neato = {
            list   : true,
            device : {
              title    : config.title,
              deviceId : config.deviceId,
              host     : 'beehive.neatocloud.com',
              path     : '/maps',
              username : config.username,
              password : config.password,
              maxCount : config.maxCount,
              method   : 'GET'
            }
          };

      // This request is for your token.
      neato.callback = function (error, response) {
        var i = 0;

        if (!error) {
          if (response.error) {
            console.log('\x1b[31m' + config.title + '\x1b[0m: ' + response.error_description);
          }

          else {
            for (i; i < response.maps.length; i += 1) {
              // Images are pretty small - let's just cache all of them, even if
              // we only want to display our maxCount.
              that.cacheImage(response.maps[i], config);
            }
          }
        }
      };
// TODO - this doesn't work.  Think it needs some postPrepare love
      this.send(neato);
    },

    /**
     * Grab all map image paths.
     */
    getStoredImages : function (neato) {
      var fs          = require('fs'),
          deviceState = require(__dirname + '/../../lib/deviceState'),
          neatoData   = deviceState.getDeviceState(neato.deviceId) || { value : null },
          path        = '/images/neato/',
          filenames   = fs.readdirSync(__dirname + '/../..' + path),
          photos      = [],
          i           = 0,
          filename;

      neatoData.value = neatoData.value || {};

      for (i; i < filenames.length; i += 1) {
        filename = filenames[i];

        if (filename.split('.').pop() === 'png') {
          filename = filename.slice(0, -4);

          if (filename.indexOf(neato.deviceId + '-') === 0) {
            photos.push({
              name  : filename,
              photo : path + filename + '.png'
            });
          }
        }

        // We want reverse chron for more natural display.
        photos.reverse();

        // But we want to chop off any beyond a decent threshold.
        neatoData.value.photos = photos.slice(0, neato.maxCount);

        return neatoData.value.photos;
      }
    },

    /**
     * Accept a raw API resonse of the current robot state.  Returns an object
     * of filtered values to store in state.
     */
    getRobotState : function (neatoData, neato) {
      var util       = require(__dirname + '/../../lib/sharedUtil').util,
          neatoState = {};

      if (neatoData && neatoData.details) {
        neatoState.charging = !!util.sanitize(neatoData.details.isCharging);
        neatoState.docked   = !!util.sanitize(neatoData.details.isDocked);
        neatoState.battery  = util.sanitize(neatoData.details.charge);
      }

      this.getMaps(neato);

      neatoState.value = { photos : this.getStoredImages(neato) };

      return neatoState;
    },

    /**
     * Accept a raw dashboard payload and return the specific robot information
     * for the given config.
     */
    findRobot : function (robotData, config) {
      var i = 0,
          robot;

      if (robotData) {
        for (i; i < robotData.length; i += 1) {
          if (robotData[i].name === config.device.title) {
            robot = robotData[i];

            return {
              serial : robot.serial,
              name   : robot.name,
              secret : robot.secret_key
            };
          }
        }
      }
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     *
     * If you don't have registered auth information, we can check for that now.
     */
    init : function (controller) {
      var fs             = require('fs'),
          runCommand     = require(__dirname + '/../../lib/runCommand'),
          authFilePath   = __dirname + '/../../cache/neatoAuth-' + controller.config.deviceId + '.json',
          authFileExists = fs.existsSync(authFilePath),
          authFile;

      if (authFileExists) {
        authFile = fs.readFileSync(authFilePath, 'utf-8');

        try {
          controller.config.auth = JSON.parse(authFile);
        }

        catch (catchErr) {
          console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Auth cache could not be read');
        }

        if (controller.config && controller.config.auth && controller.config.auth.robot) {
          console.log('\x1b[35m' + controller.config.title + '\x1b[0m: Auth cache looks complete');

          runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
        }

        else {
          // If we have a presumed good auth token, we can populate the device
          // list.
          if (controller.config.auth) {
            this.getAuth({ device : { title: controller.config.title, deviceId : controller.config.deviceId, username : controller.config.username, password : controller.config.password } }, controller);
          }

          else {
            console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Auth cache is empty.');
          }
        }
      }

      // We need to retrieve the auth token.
      else {
        this.getAuth({ device : { title: controller.config.title, deviceId : controller.config.deviceId, username : controller.config.username, password : controller.config.password } }, controller);
      }

      return controller;
    },

    send : function (config) {
      var https      = require('https'),
          runCommand = require(__dirname + '/../../lib/runCommand'),
          that       = this,
          neato      = {},
          dataReply  = '',
          request;

      neato.title       = config.device.title;
      neato.deviceId    = config.device.deviceId;
      neato.list        = config.list              || '';
      neato.host        = config.device.host;
      neato.path        = config.device.path;
      neato.username    = config.device.username;
      neato.password    = config.device.password;
      neato.maxCount    = config.device.maxCount   || 20;
      neato.eco         = config.device.eco        || false;
      neato.extraCare   = config.device.extraCare !== false;
      neato.nogo        = config.device.nogo      !== false;
      neato.command     = config.command           || '';
      neato.auth        = config.device.auth       || null;
      neato.port        = config.device.port       || 443;
      neato.method      = config.device.method     || 'GET';
      neato.callback    = config.callback          || function () {};
      neato.postRequest = this.postData(neato, true);

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

      request = https.request(this.postPrepare(neato), function (response) {
        response.setEncoding('utf8');

        response.on('data', function (response) {
          dataReply += response;
        });

        response.once('end', function () {
          var neatoData = null;

          if (dataReply) {
            try {
              neatoData = JSON.parse(dataReply);
            }

            catch (catchErr) {
              neato.callback('API returned an unexpected value');
            }

            if (neatoData) {
              if (!neato.list) {
                runCommand.runCommand(neato.deviceId, 'list', neato.deviceId);
              }

              neato.callback(null, neatoData.details ? that.getRobotState(neatoData, neato) : neatoData);
            }
          }
        });
      });

      request.once('error', function (err) {
        neato.callback(err);
      });

      request.end(neato.postRequest);
    }
  };
}());
