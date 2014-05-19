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
    version : 20140316,

    mimeTypes : { '.html' : 'text/html',
                  '.css'  : 'text/css',
                  '.js'   : 'application/javascript',
                  '.png'  : 'image/png',
                  '.gif'  : 'image/gif',
                  '.ico'  : 'image/x-icon',
                  '.eot'  : 'application/vnd.ms-fontobject',
                  '.svg'  : 'image/svg+xml',
                  '.ttf'  : 'application/x-font-ttf',
                  '.woff' : 'application/x-font-woff' },

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
      }

      return directory;
    },

    writeFile : function (directory, filename, response, config) {
      var path         = require('path'),
          fs           = require('fs'),
          staticAssets = require('./staticAssets'),
          exists       = fs.exists || path.exists,
          extension    = path.extname(filename),
          assetPath    = path.join(__dirname + '/../' + directory + '/' + filename),
          assetType    = directory.indexOf('images') === 0 || directory === 'font' ? 'binary' : '';

      exists(assetPath, function(fileExists) {
        var contents;

        if(fileExists) {
          fs.readFile(assetPath, function(err, contents) {
            if(err) {
              console.log(assetPath + ' could not be read');
            }

            else {
              response.writeHead(200, {'Content-Type': staticAssets.mimeTypes[extension], 'Content-Length': contents.length});

              response.end(contents, assetType);
            }
          });
        }

        else {
          console.log(assetPath + ' was not found on server');
          contents = fs.readFileSync(__dirname + '/../templates/404.html').toString();
          contents = contents.replace('{{THEME}}', config.theme);
          response.writeHead(404, {'Content-Type': staticAssets.mimeTypes['.html'], 'Content-Length': contents.length});
          response.end(contents);
        }
      });
    }
  };
}());