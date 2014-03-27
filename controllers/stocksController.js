/*jslint white: true */
/*global module, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic stocks information, courtesy of Yahoo.
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
      this.send({ stocks : controller.config.stocks, callback : function(err, response) {
        var fs     = require('fs'),
            stocks = {},
            stock,
            cache,
            i = 0;

        if(err) {
          if(err === 'EHOSTUNREACH') {
            console.log('Stock: API is unreachable');
          }

          else {
            console.log('Stock: ' + err);
          }
        }

        else {
          if(response) {
            response = JSON.parse(response);

            for(i in response.query.results.quote) {
              stock = response.query.results.quote[i];

              stocks[stock.symbol] = { 'name'     : stock.symbol,
                                       'ask'      : stock.AskRealtime,
                                       'bid'      : stock.BidRealtime,
                                       'change'   : stock.Change,
                                       'dayHigh'  : stock.DaysHigh,
                                       'dayLow'   : stock.DaysLow,
                                       'yearHigh' : stock.YearHigh,
                                       'yearLow'  : stock.YearLow
                                     };
            }

            cache = fs.createWriteStream(__dirname + '/../tmp/stocks.json');
            cache.write(JSON.stringify(stocks));
          }
        }
      }});
    },

    send : function (config) {
      var http        = require('http'),
          stocks      = {},
          dataReply   = '',
          request;

      stocks.stocks   = config.stocks ? config.stocks.join('","') : null;
      stocks.host     = config.host     || 'query.yahooapis.com';
      stocks.path     = config.path     || '/v1/public/yql?format=json&env=http://datatables.org/alltables.env&q=select symbol, AskRealtime, BidRealtime, Change, DaysLow, DaysHigh, YearLow, YearHigh from yahoo.finance.quotes where symbol in ("' + stocks.stocks + '")';
      stocks.port     = config.port     || 80;
      stocks.method   = config.method   || 'GET';
      stocks.callback = config.callback || function () {};

      if(stocks.stocks !== null) {
        request = http.request(this.postPrepare(stocks), function(response) {
                    response.on('data', function(response) {
                      console.log('Stocks: Connected');

                      dataReply += response;
                    });

                    response.on('end', function() {
                      stocks.callback(null, dataReply);
                    });
                  });

        request.on('error', function(error) {
          var errorMsg = '';

          if(error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
            errorMsg = 'Stock: API is unreachable';
          }

          else {
            errorMsg = 'Stock: ' + error.code;
          }

          console.log(errorMsg);

          stocks.callback(errorMsg);
        });

        request.end();

        return dataReply;
      }

      else {
        console.log('Stocks: No stocks specified');
      }
    }
  };
}());