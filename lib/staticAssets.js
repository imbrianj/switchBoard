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

/**
 * @author brian@bevey.org
 * @fileoverview Handles any request for static assets such as images, fonts,
 *               CSS or public facing JS.
 * @requires fs, path
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20150118,

    mimeTypes : { '.html'     : 'text/html',
                  '.css'      : 'text/css',
                  '.js'       : 'application/javascript',
                  '.png'      : 'image/png',
                  '.gif'      : 'image/gif',
                  '.ico'      : 'image/x-icon',
                  '.eot'      : 'application/vnd.ms-fontobject',
                  '.svg'      : 'image/svg+xml',
                  '.ttf'      : 'application/x-font-ttf',
                  '.woff'     : 'application/x-font-woff',
                  '.appcache' : 'text/cache-manifest' },

    /**
     * Resolve the directory path in which a given file exists, so we can serve
     * it up, if it's appropriate.
     */
    getDirectory : function (extension, url) {
      var path      = require('path'),
          directory = false,
          imagePath;

      switch(extension) {
        case '.css' :
          directory = 'css';
        break;

        case '.js' :
          directory = 'js';
        break;

        case '.png' :
          imagePath = path.dirname(url).split(path.sep);

          if(imagePath[1] === 'images') {
            directory = 'images/' + imagePath[2];
          }
        break;

        case '.ico' :
          directory = 'images/icons';
          break;
        case '.gif' :
          directory = 'images';
        break;

        case '.eot' :
        case '.svg' :
        case '.ttf' :
        case '.woff' :
          directory = 'font';
        break;

        case '.appcache' :
          directory = '.';
        break;
      }

      return directory;
    },

    /**
     * If a file exists - serve up the contents.
     */
    writeFile : function (directory, filename, response, config) {
      var path      = require('path'),
          fs        = require('fs'),
          that      = this,
          translate,
          exists    = fs.exists || path.exists,
          extension = path.extname(filename),
          assetPath = path.join(__dirname + '/../' + directory + '/' + filename),
          assetType = directory.indexOf('images') === 0 || directory === 'font' ? 'binary' : '';

      exists(assetPath, function(fileExists) {
        var contents;

        if(fileExists) {
          fs.readFile(assetPath, function(err, contents) {
            var headers = { 'Content-Type'   : that.mimeTypes[extension],
                            'Content-Length' : contents.length };

            if(err) {
              console.log(assetPath + ' could not be read');
            }

            else {
              if(filename === 'manifest.appcache') {
                headers['Cache-Control'] = 'no-cache';
              }

              response.writeHead(200, headers);

              response.end(contents);
            }
          });
        }

        else {
          translate = require('./translate');

          console.log('\x1b[31m404 Not Found\x1b[0m: ' + assetPath + ' was not found on server');
          contents = fs.readFileSync(__dirname + '/../templates/404.html').toString();
          contents = translate.translate(contents, 'container');
          contents = contents.replace('{{i18n_LANGUAGE}}', config.language);
          contents = contents.replace('{{THEME}}', config.theme);
          response.writeHead(404, {'Content-Type': that.mimeTypes['.html'], 'Content-Length': contents.length});
          response.end(contents);
        }
      });
    },

    /**
     * Updates the appcache manifest with a cache-busting timestamp.
     */
    freshenManifest : function () {
      var fs           = require('fs'),
          rawManifest  = fs.readFileSync(__dirname + '/../manifest.appcache').toString(),
          parts        = rawManifest.split("\n"),
          now          = new Date(),
          dateStamp    = now.toLocaleString(),
          manifest     = rawManifest,
          manifestFile = {};

      parts[1] = '# ' + dateStamp;

      manifest = parts.join("\n");

      if((parts.length > 3) && (manifest)) {
        manifestFile = fs.writeFile(__dirname + '/../manifest.appcache', manifest, function(err) {
          if(err) {
            console.log('\x1b[31mApp Cache\x1b[0m: Cache manifest unable to be updated');
          }

          else {
            console.log('\x1b[32mApp Cache\x1b[0m: Cache manifest updated');
          }
        });
      }

      else {
        console.log('\x1b[31mApp Cache\x1b[0m: Cache manifest unable to be read');
      }
    }
  };
}());
