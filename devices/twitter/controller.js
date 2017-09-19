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

  var OpenConnection = null;

  /**
   * @author brian@bevey.org
   * @fileoverview Read and send Tweets via Twitter
   * @requires https, crypto
   * @note Refernce docs:
   *       https://dev.twitter.com/streaming/userstreams
   *       https://dev.twitter.com/rest/reference/get/statuses/mentions_timeline
   */
  return {
    version : 20160204,

    readOnly: true,

    inputs  : ['text', 'list'],

    /**
     * Reference template fragments to be used by the parser.
     */
    fragments : function () {
      var fs = require('fs');

      return { tweet : fs.readFileSync(__dirname + '/fragments/twitter.tpl', 'utf-8') };
    },

    /**
     * Generate a 32-byte string of random data.
     * This is *not* cryptographically secure, but should suffice for use as a
     * cache-buster.
     */
    generateNonce : function (length) {
      var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
          nonce = '',
          i     = length || 32;

      for (i; i > 0; i -= 1) {
        nonce += chars[Math.floor(Math.random() * chars.length)];
      }

      return nonce;
    },

    /**
     * Generate a useable signature string.
     * https://dev.twitter.com/oauth/overview/creating-signatures
     */
    generateSignature : function (config) {
      var crypto     = require('crypto'),
          method     = config.method.toUpperCase(),
          protocol   = config.port === 443 ? 'https' : 'http',
          baseString = method + '&' + protocol + '%3A%2F%2F' + config.host + config.path.split('/').join('%2F') +
                       '&count%3D' + config.maxCount +
                       '%26oauth_consumer_key%3D' + config.consumerKey +
                       '%26oauth_nonce%3D' + config.nonce +
                       '%26oauth_signature_method%3D' + config.sigMethod +
                       '%26oauth_timestamp%3D' + config.timestamp +
                       '%26oauth_token%3D' + config.accessToken +
                       '%26oauth_version%3D' + config.oauthVersion,
          signingKey = config.consumerSec + '&' + config.oauthSec,
          signature  = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64').split('=').join('%3D');

      return signature;
    },

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      var request      = { host    : config.host,
                           port    : config.port,
                           path    : config.path,
                           method  : config.method,
                           headers : {
                             'Accept'         : 'application/json',
                             'Accept-Charset' : 'utf-8',
                             'User-Agent'     : 'node-switchBoard',
                             'Content-Type'   : 'application/x-www-form-urlencoded',
                             'Connection'     : 'keep-alive'
                           }
                         },
          consumerKey  = config.consumerKey,
          nonce        = config.nonce,
          signature    = this.generateSignature(config),
          sigMethod    = config.sigMethod,
          timestamp    = config.timestamp,
          accessToken  = config.accessToken,
          oauthVersion = config.oauthVersion;

      if (config.maxCount) {
        request.path = config.path + '?count=' + config.maxCount;
      }

      request.headers.Authorization = 'OAuth oauth_consumer_key="' + consumerKey + '", ' +
                                            'oauth_nonce="' + nonce + '", ' +
                                            'oauth_signature="' + signature + '", ' +
                                            'oauth_signature_method="' + sigMethod + '", ' +
                                            'oauth_timestamp="' + timestamp + '", ' +
                                            'oauth_token="' + accessToken + '", ' +
                                            'oauth_version="' + oauthVersion + '"';

      return request;
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    send : function (config) {
      var https     = require('https'),
          twitter   = {},
          dataReply = '',
          request;

      twitter.deviceId     = config.device.deviceId;
      twitter.host         = config.device.host         || 'api.twitter.com';
      twitter.path         = config.device.path         || '/1.1/statuses/mentions_timeline.json';
      twitter.port         = config.device.port         || 443;
      twitter.method       = config.device.method       || 'GET';
      twitter.maxCount     = config.device.maxCount     || 5;
      twitter.callback     = config.callback            || function () {};
      twitter.state        = config.command === 'state';
      twitter.text         = config.text                || '';
      twitter.list         = config.list                || '';
      twitter.consumerKey  = config.device.consumerKey;
      twitter.accessToken  = config.device.accessToken;
      twitter.consumerSec  = config.device.consumerSecret;
      twitter.oauthSec     = config.device.oauthTokenSecret;
      twitter.sigMethod    = config.device.sigMethod    || 'HMAC-SHA1';
      twitter.oauthVersion = config.device.oauthVersion || '1.0';
      twitter.params       = config.params              || '';
      twitter.nonce        = this.generateNonce();
      twitter.timestamp    = Math.floor((new Date().getTime() / 1000), 10);

      if (((twitter.list) && (OpenConnection === null)) || (twitter.command)) {
        console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

        request = https.request(this.postPrepare(twitter), function (response) {
                    OpenConnection = true;

                    response.setEncoding('utf8');

                    response.on('data', function (response) {
                      dataReply += response;
                    });

                    response.once('end', function () {
                      var util        = require(__dirname + '/../../lib/sharedUtil').util,
                          twitterData = [],
                          data,
                          i           = 0;

                      OpenConnection = null;

                      if (dataReply) {
                        try {
                          data = JSON.parse(dataReply);
                        }

                        catch (err) {
                          twitter.callback('API returned an unexpected value');
                        }

                        if (data) {
                          for (i; i < Math.min(data.length, twitter.maxCount); i += 1) {
                            twitterData.push({ author : util.sanitize(data[i].user.screen_name),
                                               name   : util.sanitize(data[i].user.name),
                                               image  : util.sanitize(data[i].user.profile_image_url),
                                               text   : util.sanitize(data[i].text),
                                               url    : util.sanitize('https://twitter.com/' + data[i].user.screen_name + '/status/' + data[i].id_str),
                                               date   : new Date(data[i].created_at).getTime() });
                          }

                          twitter.callback(null, twitterData);
                        }

                        else {
                          twitter.callback('No data returned from API');
                        }
                      }

                      else {
                        twitter.callback('No data returned from API');
                      }
                    });
                  });

        request.once('error', function (err) {
          twitter.callback(err);
        });

        request.end(twitter.postRequest);
      }
    }
  };
}());
