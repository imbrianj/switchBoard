/*jslint white: true */
/*global module, require, console */

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
   * @requires https
   * @fileoverview Basic weather information, courtesy of Yahoo.
   */
  return {
    version : 20160204,

    inputs : ['list'],

    /**
     * Prepare a request for command execution.
     */
    postPrepare : function (config) {
      return { host   : config.host,
               port   : config.port,
               path   : config.path,
               method : config.method };
    },

    /**
     * Grab the latest state as soon as SwitchBoard starts up.
     */
    init : function (controller) {
      var runCommand = require(__dirname + '/../../lib/runCommand');

      runCommand.runCommand(controller.config.deviceId, 'list', controller.config.deviceId);
    },

    send : function (config) {
      var https          = require('https'),
          activeBuilding = {},
          dataReply      = '',
          request;

      activeBuilding.deviceId    = config.device.deviceId;
      activeBuilding.appId       = config.device.appId;
      activeBuilding.communityId = config.device.communityId;
      activeBuilding.unitNumber  = config.device.unitNumber;
      activeBuilding.host        = config.host     || 'api.activebuilding.com';
      activeBuilding.path        = config.path     || '/lds-packages?app_id=' + activeBuilding.appId + '&communityId=' + activeBuilding.communityId + '&callback=EVIL';
      activeBuilding.port        = config.port     || 443;
      activeBuilding.method      = config.method   || 'GET';
      activeBuilding.callback    = config.callback || function () {};

      if((activeBuilding.appId) && (activeBuilding.communityId) && (activeBuilding.unitNumber)) {
        console.log('\x1b[35m' + config.device.title + '\x1b[0m: Fetching device info');

        request = https.request(this.postPrepare(activeBuilding), function (response) {
                    response.setEncoding('utf8');

                    response.on('data', function (response) {
                      dataReply += response;
                    });

                    response.once('end', function () {
                      var deviceState        = require(__dirname + '/../../lib/deviceState'),
                          util               = require(__dirname + '/../../lib/sharedUtil').util,
                          activeBuildingData = [],
                          data               = null,
                          i                  = 0,
                          j                  = 0,
                          encodeTranslate    = function (message) {
                            message = util.encodeName(message).toUpperCase();

                            return util.translate(message, 'activeBuilding', config.language);
                          };

                      if((dataReply) && (dataReply.indexOf('EVIL(') === 0)) {
                        dataReply = dataReply.substring(0, dataReply.length - 1).replace('EVIL(', '');

                        try {
                          data = JSON.parse(dataReply);
                        }

                        catch(err) {
                          activeBuilding.callback('Failed to parse JSONP');
                        }

                        if(data) {
                          for(i; i < data.length; i += 1) {
                            if(data[i].unit === activeBuilding.unitNumber) {
                              switch(data[i].typeName) {
                                case 'Amazon'       :
                                case 'Bag'          :
                                case 'Dry Cleaning' :
                                case 'Envelope'     :
                                case 'FedEx'        :
                                case 'General Mail' :
                                case 'Newspaper'    :
                                case 'OnTrac'       :
                                case 'Other'        :
                                case 'UPS'          :
                                case 'USPS'         :
                                  activeBuildingData[j] = encodeTranslate(data[i].typeName);
                                break;

                                default :
                                  activeBuildingData[j] = encodeTranslate('Unknown');
                                break;
                              }

                              j += 1;
                            }
                          }

                          activeBuildingData.sort();

                          activeBuilding.callback(null, activeBuildingData);
                        }
                      }

                      else {
                        activeBuilding.callback('No data returned from API');
                      }
                    });
                  });

        request.once('error', function (err) {
          activeBuilding.callback(err);
        });

        request.end();

        return dataReply;
      }

      else {
        activeBuilding.callback('No community specified');
      }
    }
  };
}());
