/*jslint white: true */
/*global App, module, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @requires fs, https
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
      this.send({ stocks : controller.config.stocks });
    },

    send : function (config) {
      var https       = require('https'),
          stocks      = {},
          dataReply   = '',
          request;

      stocks.stocks   = config.stocks ? config.stocks.join('","') : null;
      stocks.host     = config.host     || 'query.yahooapis.com';
      stocks.path     = config.path     || '/v1/public/yql?format=json&env=http://datatables.org/alltables.env&q=select symbol, LastTradePriceOnly, AskRealtime, BidRealtime, Change, DaysLow, DaysHigh, YearLow, YearHigh from yahoo.finance.quotes where symbol in ("' + stocks.stocks + '")';
      stocks.port     = config.port     || 443;
      stocks.method   = config.method   || 'GET';
      stocks.callback = config.callback || function () {};

      if(stocks.stocks !== null) {
        request = https.request(this.postPrepare(stocks), function(response) {
                    response.on('data', function(response) {
                      console.log('Stocks: Connected');

                      dataReply += response;
                    });

                    response.on('end', function() {
                      var fs        = require('fs'),
                          stockData = {},
                          stock,
                          cache,
                          data,
                          i = 0;

                      if(dataReply) {
                        data = JSON.parse(dataReply);

                        for(i in data.query.results.quote) {
                          stock = data.query.results.quote[i];

                          stockData[stock.symbol] = { 'name'     : stock.symbol,
                                                      'price'    : stock.LastTradePriceOnly,
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
                        cache.on('open', function() {
                          cache.write(JSON.stringify(stockData));
                        });
                      }

                      stocks.callback(null, stockData);
                    });
                  });

        request.on('error', function(err) {
          var errorMsg = '';

          if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
            errorMsg = 'Stocks: API is unreachable';
          }

          else {
            errorMsg = 'Stocks: ' + err.code;
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