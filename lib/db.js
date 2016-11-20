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
 * @fileoverview Simple NoSQL style storage for past device actions for deriving
 *               energy usage and machine learning sample data.
 * @requires fs
 */

module.exports = (function () {
  'use strict';

  var DB = [];

  return {
    version : 20161117,

    /**
     * Add record of a given event.
     */
    addRecord : function (deviceId, command, state, explicit) {
      var storedEvent = {},
          now         = explicit ? new Date(explicit) : new Date();

      storedEvent.deviceId  = deviceId;
      storedEvent.command   = command;
      storedEvent.state     = state;
      storedEvent.timestamp = Math.round(now.getTime() / 1000);
      storedEvent.time      = ('0' + (now.getHours())).slice(-2) + ('0' + (now.getMinutes())).slice(-2);
      storedEvent.day       = ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + (now.getDate())).slice(-2);

      DB.push(storedEvent);
    },

    /**
     * Returns an array of event groups - each containing the last deviceId
     * action followed by any number of events that followed shortly therafter.
     * This is intended to try and find events that happen in succession so we
     * can begin to learn any immediate and obvious patterns.
     */
    findDeviceActions : function (deviceId, config) {
      var records   = [],
          record    = [],
          threshold = config.threshold || 60000,
          foundTime = 0,
          i         = 0;

      for (i; i < DB.length; i += 1) {
        if (DB[i].deviceId === deviceId) {
          record = [DB[i]];

          foundTime = DB[i].timestamp;
        }

        else if (DB[i].timestamp > (foundTime + threshold)) {
          record.push(DB[i]);
        }

        else if (record.length) {
          records.push(record);
          record = [];
        }
      }

      if (record.length) {
        records.push(record);
        record = [];
      }

      return records;
    },

    /**
     * Return all actions stored for any given deviceId.
     */
    findByDeviceId : function (deviceId) {
      var records = [],
          i       = 0;

      for (i; i < DB.length; i += 1) {
        if (DB[i].deviceId === deviceId) {
          records.push(DB[i]);
        }
      }

      return records;
    },

    /**
     * Return all actions that occur between a given timestamp for the given
     * duration (in seconds).
     */
    findByTime : function (timestamp, duration) {
      var records = [],
          i       = 0;

      for (i; i < DB.length; i += 1) {
        if ((DB[i].timestamp >= timestamp) && (DB[i].timestamp <= (timestamp + duration))) {
          records.push(DB[i]);
        }

        else if (DB[i].timestamp > (timestamp + duration)) {
          break;
        }
      }

      return records;
    },

    /**
     * Return all actions.
     */
    returnAllValues : function () {
      return DB;
    },

    /**
     * Return the oldest available record.
     */
    returnOldestRecord : function () {
      return DB[0];
    },

    /**
     * Return the latest available record.
     */
    returnLatestRecord : function () {
      return DB[(DB.length - 1)];
    },

    /**
     * Wipe out the entire in-memory data set.
     */
    wipe : function () {
      DB = [];

      return DB;
    },

    /**
     * Remove events that are older than a given threshold.  This is partly for
     * ensuring learned actions remain relevant - and to balance performance.
     */
    pruneDb : function (config) {
      var now    = Math.round(new Date().getTime() / 1000),
          age    = config.dbDayAge === undefined ? 14 : config.dbDayAge,
          oldest = now - (age * 86400),
          i      = 0;

      if (age) {
        for (i; i < DB.length; i += 1) {
          if (DB[i].timestamp < oldest) {
            DB.splice(i, 1);
          }

          // Once we encounter a stored event that's within our age threshold, we
          // can stop since they're stored chronologically.
          else {
            break;
          }
        }
      }

      else {
        // If you explicitly have your DB age set to 0, you don't care about any
        // of this, so we'll clear it out.
        DB = [];
      }
    },

    /**
     * Write the given DB store to disc for persistence.
     */
    writeDb : function () {
      var fs    = require('fs'),
          cache = fs.createWriteStream(__dirname + '/../cache/eventDb.json');

      cache.once('open', function () {
        cache.write(JSON.stringify(DB));
      });
    },

    /**
     * Read the store to memory from disc.
     */
    readDb : function () {
      var fs = require('fs');

      fs.readFile(__dirname + '/../cache/eventDb.json', 'utf-8', function (err, data) {
        var db;

        if (data) {
          try {
            db = JSON.parse(data);
          }

          catch (catchErr) {
            console.log('\x1b[31mDB\x1b[0m: DB cache could not be read');
          }

          if (db.length) {
            DB = db;
          }
        }
      });
    }
  };
}());
