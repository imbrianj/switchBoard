/*jslint white: true */
/*global State, module, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @requires fs, https
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

        if(!err) {
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

            cache.once('open', function() {
              cache.write(JSON.stringify(weather));
            });
          }
        }
      }});
    },

    send : function (config) {
      var https       = require('https'),
          weather     = {},
          dataReply   = '',
          request;

      weather.zip      = config.zip;
      weather.host     = config.host       || 'query.yahooapis.com';
      weather.path     = config.path       || '/v1/public/yql?format=json&q=select * from weather.forecast where location=' + weather.zip;
      weather.port     = config.port       || 443;
      weather.method   = config.method     || 'GET';
      weather.callback = config.callback   || function () {};

      if(weather.zip !== null) {
        request = https.request(this.postPrepare(weather), function(response) {
                    response.once('data', function(response) {
                      console.log('Weather: Connected');

                      dataReply += response;
                    });

                    response.once('end', function() {
                      weather.callback(null, dataReply);
                    });
                  });

        request.once('error', function(err) {
          var errorMsg = '';

          if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
            errorMsg = 'Weather: API is unreachable';
          }

          else {
            errorMsg = 'Weather: ' + err.code;
          }

          console.log(errorMsg);

          weather.callback(errorMsg);
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