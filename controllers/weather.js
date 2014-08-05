/*jslint white: true */
/*global State, module, require, console */

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
    version : 20140720,

    inputs  : ['list'],

    postPrepare : function (config) {
      return { host   : config.host,
               port   : config.port,
               path   : config.path.split(' ').join('%20'),
               method : config.method };
    },

    init : function (controller) {
      this.send({ device : { deviceId: controller.config.deviceId, zip : controller.config.zip } });
    },

    onload : function (controller) {
      var fs           = require('fs'),
          deviceState  = require(__dirname + '/../lib/deviceState'),
          weatherState = deviceState.getDeviceState(controller.config.deviceId),
          parser       = require(__dirname + '/../parsers/weather').weather,
          fragment     = fs.readFileSync(__dirname + '/../templates/fragments/weather.tpl').toString();

      return parser(controller.deviceId, controller.markup, weatherState.state, weatherState.value, { forecast : fragment });
    },

    send : function (config) {
      var https     = require('https'),
          weather   = {},
          dataReply = '',
          request;

      weather.deviceId = config.device.deviceId;
      weather.zip      = config.device.zip;
      weather.host     = config.host     || 'query.yahooapis.com';
      weather.path     = config.path     || '/v1/public/yql?format=json&q=select * from weather.forecast where location=' + weather.zip;
      weather.port     = config.port     || 443;
      weather.method   = config.method   || 'GET';
      weather.callback = config.callback || function () {};

      if(weather.zip !== null) {
        request = https.request(this.postPrepare(weather), function(response) {
                    response.setEncoding('utf8');

                    console.log('\x1b[32mWeather\x1b[0m: Connected');

                    response.on('data', function(response) {
                      dataReply += response;
                    });

                    response.once('end', function() {
                      var deviceState = require('../lib/deviceState'),
                          weatherData = {},
                          city,
                          i = 0;

                      if(dataReply) {
                        dataReply = JSON.parse(dataReply);
                        city      = dataReply.query.results.channel;

                        if(city.title.indexOf('Error') !== -1) {
                          deviceState.updateState(weather.deviceId, 'weather', { state : 'err', value : city.title });
                        }

                        else {
                          weatherData = { 'city'     : city.location.city,
                                          'temp'     : city.item.condition.temp,
                                          'text'     : city.item.condition.text,
                                          'humidity' : city.atmosphere.humidity,
                                          'sunrise'  : city.astronomy.sunrise,
                                          'sunset'   : city.astronomy.sunset,
                                          'code'     : city.item.condition.code,
                                          'forecast' : city.item.forecast
                                        };

                          deviceState.updateState(weather.deviceId, 'weather', { state : 'ok', value : weatherData });
                        }
                      }

                      weather.callback(null, weatherData);
                    });
                  });

        request.once('error', function(err) {
          var errorMsg = '';

          if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
            errorMsg = '\x1b[31mWeather\x1b[0m: API is unreachable';
          }

          else {
            errorMsg = '\x1b[31mWeather\x1b[0m: ' + err.code;
          }

          console.log(errorMsg);

          weather.callback(errorMsg);
        });

        request.end();

        return dataReply;
      }

      else {
        console.log('\x1b[31mWeather\x1b[0m: No zip code specified');
      }
    }
  };
}());
