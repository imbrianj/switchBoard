/*jslint white: true */
/*global module, require, console */

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