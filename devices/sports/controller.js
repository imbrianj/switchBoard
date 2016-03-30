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
   * @requires fs, http
   * @fileoverview Basic sports information, from ESPN.
   */
  return {
    version : 20160221,

    inputs  : ['list'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { game   : fs.readFileSync(__dirname + '/fragments/game.tpl',   'utf-8'),
               league : fs.readFileSync(__dirname + '/fragments/league.tpl', 'utf-8') };
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      return {
        host    : config.host,
        port    : config.port,
        path    : config.path.split(' ').join('%20'),
        method  : config.method,
        headers : {
          'Accept'         : 'application/json',
          'Accept-Charset' : 'utf-8',
          'User-Agent'     : 'node-switchBoard'
        }
      };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    /**
     * For each teamm, fetch it's image and save it locally for quicker and
     * offline recall.  If the image is already cached, it will be retained.
     */
    cacheImage : function (league, team, theme, imageUrl, title) {
      var fs       = require('fs'),
          util     = require(__dirname + '/../../lib/sharedUtil').util,
          fileName = util.encodeName(util.sanitize(league) + '_' + (util.sanitize(team.abbreviation) || '') + '_' + theme) + '.png',
          filePath = __dirname + '/../../images/sports/' + fileName,
          request,
          image;

      try {
        image = fs.statSync(filePath);
      }

      catch(catchErr) {
        request = require('request');

        console.log('\x1b[35m' + title + '\x1b[0m: Saved image for ' + fileName);
        request(imageUrl).pipe(fs.createWriteStream(filePath));
      }

      return '/images/sports/' + fileName;
    },

    /**
     * Take the team object and other params to find the most appropriate path
     * to download from - and cache locally as to not burden the source.
     */
    getImage : function (league, team, title, theme) {
      var util = require(__dirname + '/../../lib/sharedUtil').util,
          image,
          parts,
          path = '';

      if((team.logo) && (!team.test)) {
        image = (theme === 'dark' && team.logoDark) ? team.logoDark : team.logo;

        if(team.type === 'team') {
          parts = image.split('http://a.espncdn.com');
        } else if (image.indexOf('http://a.espncdn.com/combiner/i?img=') !== -1) {
          parts = image.split('http://a.espncdn.com/combiner/i?img=');
        } else {
          // Auto racing seems to come through differently
          parts = image.split('http://a.espncdn.com/');
        }

        path = this.cacheImage(league, team, theme, 'http://a1.espncdn.com/combiner/i?img=' + util.sanitize(parts[1]) + '&h=100&w=100', title);
      }

      return path;
    },

    /**
     * Convert raw status into a sanitized string we can use for translation.
     */
    getStatus : function (rawStatus) {
      var hashTable = { 'pre'  : 'UPCOMING',
                        'in'   : 'LIVE',
                        'post' : 'FINAL' };

      return hashTable[rawStatus] || 'UNKNOWN';
    },

    /**
     * Parse through the raw sports object and extract (and sanitize) only the
     * parts we care about.
     */
    getGames : function (sports, title, theme) {
      var util       = require(__dirname + '/../../lib/sharedUtil').util,
          sportsData = {},
          sportKey,
          sport,
          leagueKey,
          league,
          gameKey,
          games,
          game;

      // A "Sport" is like "basketball", "hockey", etc.
      for(sportKey in sports) {
        sport = sports[sportKey];

        // A "League" is like "NBA", "NHL", etc.
        for(leagueKey in sport.leagues) {
          league = sport.leagues[leagueKey];
          games  = [];

          // An "Event" is a normal sports game.
          for(gameKey in league.events) {
            game = league.events[gameKey];

            games.push({
              // It looks like "Home" is always the first
              // element in the competitors array.
              home     : {
                title  : util.sanitize(game.competitors[0].name),
                score  : util.sanitize(game.competitors[0].score),
                winner : util.sanitize(game.competitors[0].winner),
                image  : this.getImage(league.abbreviation, game.competitors[0], title, theme)
              },
              away : {
                title  : util.sanitize(game.competitors[1].name),
                score  : util.sanitize(game.competitors[1].score),
                winner : util.sanitize(game.competitors[1].winner),
                image  : this.getImage(league.abbreviation, game.competitors[1], title, theme)
              },
              time     : new Date(util.sanitize(game.date)).getTime(),
              summary  : util.sanitize(game.summary),
              status   : this.getStatus(game.status),
              location : util.sanitize(game.location),
              url      : util.sanitize(game.link)
            });
          }

          sportsData[util.encodeName(league.abbreviation)] = {
            name  : util.sanitize(league.shortName),
            title : util.sanitize(league.name),
            games : games
          };
        }
      }

      return sportsData;
    },

    send : function (config) {
      var that      = this,
          http      = require('http'),
          language  = config.config.language || 'en',
          region    = config.config.region   || 'us',
          theme     = config.config.theme,
          sports    = {},
          dataReply = '',
          request;

      if(language.indexOf('-') !== -1) {
        language = language.split('-')[0];
      }

      sports.deviceId = config.device.deviceId;
      sports.host     = config.host     || 'site.api.espn.com';
      sports.path     = config.path     || '/apis/v2/scoreboard/header?lang=' + language + '&region=' + region;
      sports.port     = config.port     || 80;
      sports.method   = config.method   || 'GET';
      sports.callback = config.callback || function () {};

      console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

      request = http.request(this.postPrepare(sports), function (response) {
                  response.setEncoding('utf8');

                  response.on('data', function (response) {
                    dataReply += response;
                  });

                  response.once('end', function () {
                    var sportsData = {},
                        errMessage,
                        data;

                    if(dataReply) {
                      try {
                        data = JSON.parse(dataReply);
                      }

                      catch(err) {
                        errMessage = 'API returned an unexpected value';
                      }

                      if(data && data.sports) {
                        sportsData = that.getGames(data.sports, config.device.title, theme);
                      }

                      else {
                        errMessage = 'No data returned from API';
                      }
                    }

                    else {
                      errMessage = 'No data returned from API';
                    }

                    sports.callback(errMessage, sportsData);
                  });
                });

      request.once('error', function (err) {
        sports.callback(err);
      });

      request.end();
    }
  };
}());
