/*jslint white: true */
/*global module, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic weather information, courtesy of Yahoo.
   */
  return {
    version : 20140326,

    inputs  : ['list', 'launch'],

    postPrepare : function (config) {
      return { host   : config.host,
               port   : config.port,
               path   : config.path.split(' ').join('%20'),
               method : config.method };
    },

    init : function (controller) {
      this.send({ zip : controller.config.zip, callback : function(err, response) {
        var fs      = require('fs'),
            weather = {},
            city,
            cache,
            i = 0;

        if(err) {
          if(err === 'EHOSTUNREACH') {
            console.log('Weather: API is unreachable');
          }

          else {
            console.log('Weather: ' + err);
          }
        }

        else {
          if(response) {
            response = JSON.parse(response);
            city     = response.query.results.channel;

            weather = { 'city'     : city.location.city,
                        'humidity' : city.atmosphere.humidity,
                        'sunrise'  : city.astronomy.sunrise,
                        'sunset'   : city.astronomy.sunset,
                        'forecast' : city.item.forecast
                      };

            cache = fs.createWriteStream(__dirname + '/../tmp/weather.json');
            cache.write(JSON.stringify(weather));
          }
        }
      }});
    },

    send : function (config) {
      var http        = require('http'),
          weather     = {},
          dataReply   = '',
          request;

      weather.zip      = config.zip;
      weather.host     = config.host       || 'query.yahooapis.com';
      weather.path     = config.path       || '/v1/public/yql?format=json&q=select * from weather.forecast where location=' + weather.zip;
      weather.port     = config.port       || 80;
      weather.method   = config.method     || 'GET';
      weather.callback = config.callback   || function () {};

      if(weather.zip !== null) {
        request = http.request(this.postPrepare(weather), function(response) {
                    response.on('data', function(response) {
                      console.log('Weather: Connected');

                      dataReply += response;
                    });

                    response.on('end', function() {
                      weather.callback(null, dataReply);
                    });
                  });

        request.on('error', function(error) {
          var errorMsg = '';

          if(error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
            errorMsg = 'Weather: API is unreachable';
          }

          else {
            errorMsg = 'Weather: ' + error.code;
          }

          console.log(errorMsg);

          stocks.callback(errorMsg);
        });

        request.end();

        return dataReply;
      }

      else {
        console.log('Weather: No zip code specified');
      }
    }
  };
}());