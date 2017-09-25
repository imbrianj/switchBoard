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
 * @fileoverview Unit test for apps/announceTrendingNews.js
 */

exports.foscamDvr = {
  findProperNouns : function (test) {
    'use strict';

    var announceTrendingNews = require(__dirname + '/../../../apps/announceTrendingNews'),
        articleParts         = announceTrendingNews.findProperNouns(['A', 'quick', 'brown', 'fox', 'jumped', 'over', 'Sam'], 'a');

    test.deepEqual(articleParts, ['Sam'], 'Finds the proper noun');

    test.done();
  },

  isWordCapitalized : function (test) {
    'use strict';

    var announceTrendingNews = require(__dirname + '/../../../apps/announceTrendingNews'),
        number               = announceTrendingNews.isWordCapitalized('3rd'),
        specialChar          = announceTrendingNews.isWordCapitalized('-something'),
        undefinedChar        = announceTrendingNews.isWordCapitalized(undefined),
        lowercaseWord        = announceTrendingNews.isWordCapitalized('dog'),
        capitalizedWord      = announceTrendingNews.isWordCapitalized('Sam');

    test.deepEqual(number,          false, 'Numbers are not Capitalized');
    test.deepEqual(specialChar,     false, 'Special chars are not Capitalized');
    test.deepEqual(undefinedChar,   false, 'Undefined chars are not Capitalized');
    test.deepEqual(lowercaseWord,   false, 'Lower case letters are not Capitalized');
    test.deepEqual(capitalizedWord, true,  'Capitalized words are Capitalized');

    test.done();
  },

  parseArticles : function (test) {
    'use strict';

    var announceTrendingNews = require(__dirname + '/../../../apps/announceTrendingNews'),
        articles             = [{ title : 'Test 1',
                                  text  : 'This is a first test of some Name text'},
                                { title : 'Another Test',
                                  text  : 'Name should show up as a popular proper noun.'}],
        parsedArticles       = announceTrendingNews.parseArticles(articles, ['test', 'another', 'this']);

    test.deepEqual(parsedArticles, ['Name', 'Name'], 'Find the non-blacklisted presumed proper nouns, unweighted');

    test.done();
  },

  findPopularWords : function (test) {
    'use strict';

    var announceTrendingNews = require(__dirname + '/../../../apps/announceTrendingNews'),
        articles             = [{ title : 'Test 1',
                                  text  : 'This is a first test of some Popular Name text'},
                                { title : 'Another Test',
                                  text  : 'Name should show up as a Popular proper noun.'}],
        popularWords         = announceTrendingNews.findPopularWords(articles, ['test', 'another', 'this']);

    test.deepEqual(popularWords, {Name: 2, Popular: 2}, 'Find the weight of the two non-blacklisted presumed proper nouns');

    test.done();
  }
};
