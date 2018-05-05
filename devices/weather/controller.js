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
   * @fileoverview Basic weather information, courtesy of Yahoo.
   */
  return {
    version : 20171029,

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
     * Accept a plain-text time ("7:52 pm") and find the unix timestamp for that
     * time on the current day.
     */
    formatTime : function (time) {
      var hour   = parseInt(time.split(':')[0], 10),
          minute = parseInt(time.split(':')[1].split(' ')[0], 10),
          ampm   = time.split(' ')[1];

      hour = ampm === 'pm' ? (hour + 12) : hour;

      return { hour : hour, minute : minute };
    },

    /**
     * Accept a raw forecast object and celsius flag.  Parse through, sanitizing
     * and converting values as necessary.
     */
    formatForecast : function (forecast, celsius) {
      var util      = require(__dirname + '/../../lib/sharedUtil').util,
          formatted = [],
          i         = 0;

      for (i; i < forecast.length; i += 1) {
        formatted.push({
          code : util.sanitize(forecast[i].code),
          date : util.sanitize(forecast[i].date),
          day  : util.sanitize(forecast[i].day),
          high : util.sanitize(celsius ? util.fToC(forecast[i].high) : parseInt(forecast[i].high, 10)),
          low  : util.sanitize(celsius ? util.fToC(forecast[i].low)  : parseInt(forecast[i].low,  10)),
          text : util.sanitize(forecast[i].text)
        });
      }

      return formatted;
    },

    /**
     * Accept sunrise and sunset times as deliverd from the API - and determine
     * what the current sun phase is.  Can either be "Day" or "Night".
     */
    findSunPhase : function (sunriseRaw, sunsetRaw) {
      var sunrise = this.formatTime(sunriseRaw),
          sunset  = this.formatTime(sunsetRaw),
          now     = new Date(),
          unixNow = now.getTime(),
          year    = now.getFullYear(),
          month   = now.getMonth(),
          date    = now.getDate(),
          state   = '';

      sunrise.unix = new Date(year, month, date, sunrise.hour, sunrise.minute).getTime();
      sunset.unix  = new Date(year, month, date, sunset.hour,  sunset.minute).getTime();

      // The sun hasn't come up yet.
      if (sunrise.unix > unixNow) {
        state = 'Night';
      }

      // The sun has come up - but has not gone down.
      else if (sunset.unix > unixNow) {
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

      weather.deviceId = config.device.deviceId;
      weather.zip      = config.device.zip;
      weather.woeid    = config.device.woeid;
      weather.celsius  = config.config.celsius || false;
      weather.host     = config.host           || 'query.yahooapis.com';
      weather.path     = config.path           || '/v1/public/yql?format=json&q=select * from weather.forecast where ' + (weather.woeid ? 'woeid=' + weather.woeid : 'location=' + weather.zip);
      weather.port     = config.port           || 443;
      weather.method   = config.method         || 'GET';
      weather.callback = config.callback       || function () {};

      if ((weather.zip !== null) || (weather.woeid !== null)) {
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
                          data,
                          city;

                      if (dataReply) {
                        try {
                          data = JSON.parse(dataReply);
                        }

                        catch (catchErr) {
                          errMessage = 'API returned an unexpected value';
                        }

                        if (data && data.query && data.query.results) {
                          city = data.query.results.channel;

                          if (city && city.title && city.title.indexOf('Error') === -1) {
                            errMessage  = null;

                            temp        = city.item.condition.temp;

                            if (weather.celsius) {
                              temp = util.fToC(temp);
                            }

                            weatherData = { 'city'     : util.sanitize(city.location.city),
                                            'temp'     : util.sanitize(parseInt(temp, 10)),
                                            'text'     : util.sanitize(city.item.condition.text),
                                            'humidity' : util.sanitize(parseInt(city.atmosphere.humidity, 10)),
                                            'sunrise'  : util.sanitize(city.astronomy.sunrise),
                                            'sunset'   : util.sanitize(city.astronomy.sunset),
                                            'code'     : util.sanitize(parseInt(city.item.condition.code, 10)),
                                            'forecast' : that.formatForecast(city.item.forecast, weather.celsius),
                                            'phase'    : that.findSunPhase(city.astronomy.sunrise, city.astronomy.sunset)
                                          };
                          }
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
        weather.callback('No zip code specified');
      }
    }
  };
}());
