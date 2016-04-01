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

(function (exports){
  'use strict';

  exports.sports = function (deviceId, markup, state, value, fragments, language) {
    var leagueTemplate = fragments.league,
        gameTemplate   = fragments.game,
        i              = 0,
        j              = 0,
        league         = {},
        game           = {},
        title          = '',
        awayWinner     = '',
        homeWinner     = '',
        tempMarkup     = '',
        gameMarkup     = '',
        translate      = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'sports');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'sports', language);
          }

          return message;
        },
        displayTime    = function (unix) {
          var util,
              time;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            time = SB.util.displayTime(unix, translate);
          }

          else {
            util = require(__dirname + '/../../lib/sharedUtil').util;
            time = util.displayTime(unix, translate);
          }

          return time;
        };

    if ((state) && (value)) {
      for (i in value) {
        if (value.hasOwnProperty(i)) {
          league = value[i];
          gameMarkup = '';

          for (j = 0; j < league.games.length; j += 1) {
            game       = league.games[j];
            title      = translate('TITLE').split('{{AWAY}}').join(game.away.title).split('{{HOME}}').join(game.home.title);
            awayWinner = game.away.winner ? ' winner' : '';
            homeWinner = game.home.winner ? ' winner' : '';

            gameMarkup = gameMarkup + gameTemplate.split('{{GAME_LINK}}').join(game.url);
            gameMarkup = gameMarkup.split('{{GAME_TITLE}}').join(title);
            gameMarkup = gameMarkup.split('{{GAME_AWAY_WINNER}}').join(awayWinner);
            gameMarkup = gameMarkup.split('{{GAME_AWAY_TEAM}}').join(game.away.title);
            gameMarkup = gameMarkup.split('{{GAME_AWAY_IMAGE}}').join(game.away.image);
            gameMarkup = gameMarkup.split('{{GAME_AWAY_SCORE}}').join(game.away.score);
            gameMarkup = gameMarkup.split('{{GAME_HOME_WINNER}}').join(homeWinner);
            gameMarkup = gameMarkup.split('{{GAME_HOME_TEAM}}').join(game.home.title);
            gameMarkup = gameMarkup.split('{{GAME_HOME_IMAGE}}').join(game.home.image);
            gameMarkup = gameMarkup.split('{{GAME_HOME_SCORE}}').join(game.home.score);
            gameMarkup = gameMarkup.split('{{GAME_TIME}}').join(displayTime(game.time));
            gameMarkup = gameMarkup.split('{{GAME_STATUS}}').join((game.status || '').toLowerCase());
            gameMarkup = gameMarkup.split('{{GAME_STATE}}').join(translate(game.status));
          }

          tempMarkup = tempMarkup + leagueTemplate.split('{{LEAGUE_NAME}}').join(league.title);
          tempMarkup = tempMarkup.split('{{GAME_LIST}}').join(gameMarkup);
        }
      }
    }

    return markup.replace('{{SPORTS_DYNAMIC}}', tempMarkup);
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
