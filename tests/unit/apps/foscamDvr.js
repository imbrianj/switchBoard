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
 * @fileoverview Unit test for apps/foscamDvr.js
 */

exports.foscamDvr = {
  translateScreenshotCommand : function (test) {
    'use strict';

    var foscamDvr = require(__dirname + '/../../../apps/foscamDvr'),
        goodFile  = foscamDvr.translateScreenshotCommand('foo');

    test.deepEqual(goodFile.command,    'ffmpeg',                      'Returns command');
    test.deepEqual(goodFile.params[3],  'images/foscam/dvr/foo.mkv',   'Returns parameters');
    test.deepEqual(goodFile.params[10], 'images/foscam/thumb/foo.jpg', 'Returns parameters');

    test.done();
  },

  translateThumbCommand : function (test) {
    'use strict';

    var foscamDvr = require(__dirname + '/../../../apps/foscamDvr'),
        goodFile  = foscamDvr.translateThumbCommand('foo');

    test.deepEqual(goodFile.command,   'ffmpeg',                      'Returns command');
    test.deepEqual(goodFile.params[1], 'images/foscam/dvr/foo.mkv',   'Returns parameters');
    test.deepEqual(goodFile.params[6], 'images/foscam/thumb/foo.gif', 'Returns parameters');

    test.done();
  },

  translateVideoCommand : function (test) {
    'use strict';

    var foscamDvr = require(__dirname + '/../../../apps/foscamDvr'),
        goodFile  = foscamDvr.translateVideoCommand({ deviceIp : '192.168.1.1',
                                                      username : 'foo',
                                                      password : 'bar'}, 600);

    test.deepEqual(goodFile.command,    'ffmpeg',                                              'Returns command');
    test.deepEqual(goodFile.params[5],  'http://192.168.1.1/videostream.cgi?user=foo&pwd=bar', 'Returns video stream');
    test.deepEqual(goodFile.params[7],  'http://192.168.1.1/videostream.asf?user=foo&pwd=bar', 'Returns audio stream');
    test.deepEqual(goodFile.params[19], 600,                                                   'Returns video chunk duration');

    test.done();
  },
};
