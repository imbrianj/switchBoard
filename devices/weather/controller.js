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
   * @requires fs, https
   * @fileoverview Basic weather information, Powered by Dark Sky:
   *               https://darksky.net/poweredby/
   */
  return {
    version : 20190115,

    readOnly: true,

    inputs  : ['list'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { forecast : fs.readFileSync(__dirname + '/fragments/weather.tpl', 'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      return { host   : config.host,
               port   : config.port,
               path   : config.path.split(' ').join('%20'),
               method : config.method };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    /**
     * Accept a raw forecast object and celsius flag.  Parse through, sanitizing
     * and converting values as necessary.
     */
    formatForecast : function (forecast, celsius) {
      var util      = require(__dirname + '/../../lib/sharedUtil').util,
          formatted = { days : [] },
          i         = 0,
          days      = { 0 : 'SUN',
                        1 : 'MON',
                        2 : 'TUE',
                        3 : 'WED',
                        4 : 'THUR',
                        5 : 'FRI',
                        6 : 'SAT' },
          day;

      formatted.summary = forecast.summary;
      formatted.code    = forecast.icon;

      for (i; i < forecast.data.length; i += 1) {
        day = forecast.data[i];

        formatted.days.push({
          code : util.sanitize(day.icon),
          date : parseInt(new Date(day.time * 1000).getDate()),
          day  : days[(new Date(day.time * 1000).getDay())],
          high : util.sanitize(celsius ? util.fToC(day.temperatureHigh) : parseInt(day.temperatureHigh, 10)),
          low  : util.sanitize(celsius ? util.fToC(day.temperatureLow)  : parseInt(day.temperatureLow, 10)),
          text : util.sanitize(day.summary)
        });
      }

      return formatted;
    },

    /**
     * Accept a Unix timestamp and convert to a string with hour / minute.
     */
    formatTime : function (unixTime) {
      var date = new Date(unixTime * 1000);

      return date.getHours() + ':' + ('0' + date.getMinutes()).substr(-2);
    },

    /**
     * Accept sunrise and sunset times as deliverd from the API - and determine
     * what the current sun phase is.  Can either be "Day" or "Night".
     */
    findSunPhase : function (sunrise, sunset) {
      var now   = new Date().getTime(),
          state = '';

      // The sun hasn't come up yet.
      if ((sunrise * 1000) > now) {
        state = 'Night';
      }

      // The sun has come up - but has not gone down.
      else if ((sunset * 1000) > now) {
        state = 'Day';
      }

      // The sun has gone down.
      else {
        state = 'Night';
      }

      return state;
    },

    send : function (config) {
      var that      = this,
          https     = require('https'),
          weather   = {},
          dataReply = '',
          request;

      weather.deviceId  = config.device.deviceId;
      weather.token     = config.device.token;
      weather.latitude  = config.device.latitude;
      weather.longitude = config.device.longitude;
      weather.language  = config.config.language ? config.config.language.split('-')[0] : 'en';
      weather.celsius   = config.config.celsius || false;
      weather.host      = config.host           || 'api.darksky.net';
      weather.path      = config.path           || '/forecast/' + weather.token + '/' + weather.latitude + ',' + weather.longitude + '?lang=' + weather.language + '&exclude=minutely,alerts,flags';
      weather.port      = config.port           || 443;
      weather.method    = config.method         || 'GET';
      weather.callback  = config.callback       || function () {};

      if ((weather.latitude !== null) || (weather.longitude !== null)) {
        console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

        request = https.request(this.postPrepare(weather), function (response) {
                    response.setEncoding('utf8');

                    response.on('data', function (response) {
                      dataReply += response;
                    });

                    response.once('end', function () {
                      var util        = require(__dirname + '/../../lib/sharedUtil').util,
                          weatherData = {},
                          errMessage  = 'err',
                          temp,
                          data;

                      if (dataReply) {
                        try {
                          data = JSON.parse(dataReply);
                        }

                        catch (catchErr) {
                          errMessage = 'API returned an unexpected value';
                        }

                        if (data && data.currently && data.hourly && data.daily) {
                          errMessage  = null;

                          temp        = data.currently.temperature;

                          if (weather.celsius) {
                            temp = util.fToC(temp);
                          }

                          weatherData = { 'temp'     : util.sanitize(parseInt(temp, 10)),
                                          'text'     : util.sanitize(data.currently.summary),
                                          'hourly'   : util.sanitize(data.hourly.summary),
                                          'humidity' : util.sanitize(parseInt(data.currently.humidity, 10)),
                                          'dew'      : util.sanitize(parseInt(data.currently.dewPoint, 10)),
                                          'sunrise'  : that.formatTime(util.sanitize(parseInt(data.daily.data[0].sunriseTime, 10))),
                                          'sunset'   : that.formatTime(util.sanitize(parseInt(data.daily.data[0].sunsetTime, 10))),
                                          'code'     : util.sanitize(data.currently.icon),
                                          'forecast' : that.formatForecast(data.daily, weather.celsius),
                                          'phase'    : that.findSunPhase(data.daily.data[0].sunriseTime, data.daily.data[0].sunsetTime)
                                        };
                        }

                        else {
                          errMessage = 'No data returned from API';
                        }
                      }

                      else {
                        errMessage = 'No data returned from API';
                      }

                      weather.callback(errMessage, weatherData);
                    });
                  });

        request.once('error', function (err) {
          weather.callback(err);
        });

        request.end();
      }

      else {
        weather.callback('No latitude or longitude specified');
      }
    }
  };
}());
