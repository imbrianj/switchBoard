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
      this.send({ device : { deviceId: controller.config.deviceId, stocks : controller.config.stocks } });
    },

    send : function (config) {
      var https     = require('https'),
          stocks    = {},
          dataReply = '',
          request;

      stocks.deviceName = config.device.deviceId;
      stocks.stocks     = config.device.stocks ? config.device.stocks.join('","') : null;
      stocks.host       = config.host     || 'query.yahooapis.com';
      stocks.path       = config.path     || '/v1/public/yql?format=json&env=http://datatables.org/alltables.env&q=select symbol, LastTradePriceOnly, AskRealtime, BidRealtime, Change, DaysLow, DaysHigh, YearLow, YearHigh from yahoo.finance.quotes where symbol in ("' + stocks.stocks + '")';
      stocks.port       = config.port     || 443;
      stocks.method     = config.method   || 'GET';
      stocks.callback   = config.callback || function () {};

      if(stocks.stocks !== null) {
        request = https.request(this.postPrepare(stocks), function(response) {
                    response.once('data', function(response) {
                      console.log('Stocks: Connected');

                      dataReply += response;
                    });

                    response.once('end', function() {
                      var fs          = require('fs'),
                          deviceState = require('../lib/deviceState'),
                          stockData   = {},
                          stock,
                          data,
                          i = 0;

                      if(dataReply) {
                        data = JSON.parse(dataReply);

                        if(data && data.query && data.query.results && data.query.results.quote) {
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
                        }

                        deviceState.updateState(stocks.deviceName, { value : stockData });
                      }

                      stocks.callback(null, stockData);
                    });
                  });

        request.once('error', function(err) {
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