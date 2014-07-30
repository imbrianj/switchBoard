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
    version : 20140729,

    inputs  : ['list'],

    stocksOpen : function (deviceId, explicit) {
      var deviceState = require(__dirname + '/../lib/deviceState'),
          date        = new Date(),
          utcTime     = date.getTime() + (date.getTimezoneOffset() * 60000),
          // Try to determine if we're in DST by comparing one month that is
          // in DST against the current timezone offset.
          january     = new Date(date.getFullYear(), 0, 1),
          july        = new Date(date.getFullYear(), 6, 1),
          dst         = date.getTimezoneOffset() < Math.max(january.getTimezoneOffset(), july.getTimezoneOffset()),
          nycOffset   = dst ? -4 : -5,
          nycTime     = new Date(utcTime + (3600000 * nycOffset)),
          open        = false;

      if(explicit) {
        nycTime = explicit;
      }

      // Trading isn't open on weekends, so we don't need to poll.
      if((nycTime.getDay() !== 6) && (nycTime.getDay() !== 0)) {
        // Trading is only open from 9am - 4pm.
        if((nycTime.getHours() >= 9) && (nycTime.getHours() < 16)) {
          open = true;
          deviceState.updateState(deviceId, 'stocks', { state : 'ok', value : State[deviceId].state.value });
        }

        else {
          deviceState.updateState(deviceId, 'stocks', { state : 'err', value : State[deviceId].state.value });

          console.log('\x1b[35mSchedule\x1b[0m: Stock trading is closed - after hours');
        }
      }

      else {
        deviceState.updateState(deviceId, 'stocks', { state : 'err', value : State[deviceId].state.value });

        console.log('\x1b[35mSchedule\x1b[0m: Stock trading is closed - weekend');
      }

      return open;
    },

    postPrepare : function (config) {
      return { host   : config.host,
               port   : config.port,
               path   : config.path.split(' ').join('%20'),
               method : config.method };
    },

    init : function (controller) {
      this.send({ device : { deviceId: controller.config.deviceId, stocks : controller.config.stocks } });
    },

    onload : function (controller) {
      var fs       = require('fs'),
          parser   = require(__dirname + '/../parsers/stocks').stocks,
          fragment = fs.readFileSync(__dirname + '/../templates/fragments/stocks.tpl').toString();

      return parser(controller.deviceId, controller.markup, State[controller.config.deviceId].state, State[controller.config.deviceId].value, { list : fragment });
    },

    send : function (config) {
      var https     = require('https'),
          that      = this,
          stocks    = {},
          dataReply = '',
          request;

      stocks.deviceId = config.device.deviceId;
      stocks.stocks   = config.device.stocks ? config.device.stocks.join('","') : null;
      stocks.host     = config.host     || 'query.yahooapis.com';
      stocks.path     = config.path     || '/v1/public/yql?format=json&env=http://datatables.org/alltables.env&q=select symbol, LastTradePriceOnly, AskRealtime, BidRealtime, Change, DaysLow, DaysHigh, YearLow, YearHigh, ChangeinPercent, Change from yahoo.finance.quotes where symbol in ("' + stocks.stocks + '")';
      stocks.port     = config.port     || 443;
      stocks.method   = config.method   || 'GET';
      stocks.callback = config.callback || function () {};

      if(stocks.stocks !== null) {
        request = https.request(this.postPrepare(stocks), function(response) {
                    response.setEncoding('utf8');

                    console.log('\x1b[32mStocks\x1b[0m: Connected');

                    response.on('data', function(response) {
                      dataReply += response;
                    });

                    response.once('end', function() {
                      var deviceState = require('../lib/deviceState'),
                          stockData   = {},
                          stock,
                          data,
                          state,
                          i = 0;

                      if(dataReply) {
                        data = JSON.parse(dataReply);

                        if(data && data.query && data.query.results && data.query.results.quote) {
                          for(i in data.query.results.quote) {
                            stock = data.query.results.quote[i];

                            stockData[stock.symbol] = { 'name'             : stock.symbol,
                                                        'price'            : stock.LastTradePriceOnly,
                                                        'ask'              : stock.AskRealtime,
                                                        'bid'              : stock.BidRealtime,
                                                        'dayHigh'          : stock.DaysHigh,
                                                        'dayLow'           : stock.DaysLow,
                                                        'yearHigh'         : stock.YearHigh,
                                                        'yearLow'          : stock.YearLow,
                                                        'dayChangePercent' : stock.ChangeinPercent,
                                                        'dayChangeValue'   : stock.Change
                                                      };
                          }
                        }

                        state = that.stocksOpen(stocks.deviceId) ? 'ok' : 'err';
                        deviceState.updateState(stocks.deviceId, 'stocks', { state: state, value : stockData });
                      }

                      stocks.callback(null, stockData);
                    });
                  });

        request.once('error', function(err) {
          var errorMsg = '';

          if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH') {
            errorMsg = 'API is unreachable';
          }

          else {
            errorMsg = err.code;
          }

          console.log('\x1b[31mStocks\x1b[0m: ' + errorMsg);

          stocks.callback(errorMsg);
        });

        request.end();

        return dataReply;
      }

      else {
        console.log('\x1b[31mStocks\x1b[0m: No stocks specified');
      }
    }
  };
}());
