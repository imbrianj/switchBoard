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

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for devices/stocks/parser.js
 */

exports.stocksParserTest = {
  parser : function (test) {
    'use strict';

    var stocksParser = require(__dirname + '/../../../../devices/stocks/parser'),
        markup       = '<h1>Foo</h1> <div>{{STOCKS_DYNAMIC}}</div>',
        value        = { foo : { dayChangeValue : '+1.00', name : 'YHOO', price : '50.00',  dayChangePercent : '1%' },
                         bar : { dayChangeValue : '-1.00', name : 'TSLA', price : '250.00', dayChangePercent : '2%' },
                         baz : { dayChangeValue : '0.00',  name : 'GOOG', price : '400.00', dayChangePercent : '0%' } },
        fragments    = { list : '<li class="{{STOCK_CHANGE}}"><span class="fa fa-{{STOCK_ARROW}}"><span>{{STOCK_DIRECTION}}</span></span><span class="name">{{STOCK_NAME}}</span> <span class="price">{{STOCK_PRICE}}</span> <span class="change">({{STOCK_CHANGE_VALUE}} {{STOCK_CHANGE_PERCENT}})</li>' },
        goodMarkup   = stocksParser.stocks('dummy', markup, 'ok', value, fragments),
        badMarkup    = stocksParser.stocks('dummy', markup, 'ok', null,  fragments);

    test.strictEqual(goodMarkup.indexOf('{{'),          -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('<li class="gain"><span class="fa fa-arrow-up"><span>Gain</span></span><span class="name">YHOO</span> <span class="price">50.00</span> <span class="change">(+1.00 1%)</li>'),       -1, 'Passed markup validated');
    test.notStrictEqual(goodMarkup.indexOf('<li class="loss"><span class="fa fa-arrow-down"><span>Loss</span></span><span class="name">TSLA</span> <span class="price">250.00</span> <span class="change">(-1.00 2%)</li>'),    -1, 'Passed markup validated');
    test.notStrictEqual(goodMarkup.indexOf('<li class="neutral"><span class="fa fa-arrows-h"><span>Neutral</span></span><span class="name">GOOG</span> <span class="price">400.00</span> <span class="change">(0.00 0%)</li>'), -1, 'Passed markup validated');
    test.strictEqual(badMarkup.indexOf('{{'),           -1, 'All values replaced');
    test.strictEqual(badMarkup, '<h1>Foo</h1> <div></div>', 'Passed markup validated');

    test.done();
  }
};
