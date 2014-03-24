/*jslint white: true */
/*global module, String, require, console */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic stocks information, courtesy of Yahoo.
   */
  return {
    version : 20140313,

    inputs  : ['list', 'launch'],

    postPrepare : function (config) {
      return { host   : config.host,
               port   : config.port,
               path   : config.path,
               method : config.method };
    },

    init : function (controller) {
    },

    send : function (config) {
      this.stocks = config.stocks ? config.stocks.join('","') : null;
      this.host   = config.host       || 'query.yahooapis.com';
      this.path   = config.path       || '/v1/public/yql?format=json&env=http://datatables.org/alltables.env&q=select symbol, AskRealtime, BidRealtime, Change, DaysLow, DaysHigh, YearLow, YearHigh from yahoo.finance.quotes where symbol in ("' + stocks + '")';
      this.port   = config.port       || 80;
      this.method = config.method     || 'GET';
      this.callback = config.callback || function () {};

      var that      = this,
          http      = require('http'),
          dataReply = '',
          request;
      if(that.stocks !== null) {
        request = http.request(this.postPrepare(that), function(response) {
                    response.on('data', function(response) {
                      console.log('Stocks: Connected');

                      dataReply += response;
                    });

                    response.on('end', function() {
                      that.callback(null, dataReply);
                    });
                  });

        request.on('error', function(error) {
          var errorMsg = '';

          if(error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
            errorMsg = 'Stock: API is unreachable';
          }

          else {
            errorMsg = error.code;
          }

          console.log(errorMsg);

          that.callback(errorMsg);
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