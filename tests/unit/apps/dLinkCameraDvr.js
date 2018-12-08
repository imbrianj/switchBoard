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
 * @fileoverview Unit test for apps/dLinkCameraDvr.js
 */

exports.dLinkCameraDvr = {
  translateScreenshotCommand : function (test) {
    'use strict';

    var dLinkCameraDvr = require(__dirname + '/../../../apps/dLinkCameraDvr'),
        goodFile       = dLinkCameraDvr.translateScreenshotCommand('foo');

    test.deepEqual(goodFile.command,    'ffmpeg',                           'Returns command');
    test.deepEqual(goodFile.params[3],  'images/dLinkCamera/dvr/foo.mp4',   'Returns parameters');
    test.deepEqual(goodFile.params[10], 'images/dLinkCamera/thumb/foo.jpg', 'Returns parameters');

    test.done();
  },

  translateThumbCommand : function (test) {
    'use strict';

    var dLinkCameraDvr = require(__dirname + '/../../../apps/dLinkCameraDvr'),
        goodFile       = dLinkCameraDvr.translateThumbCommand('foo');

    test.deepEqual(goodFile.command,   'ffmpeg',                           'Returns command');
    test.deepEqual(goodFile.params[1], 'images/dLinkCamera/dvr/foo.mp4',   'Returns parameters');
    test.deepEqual(goodFile.params[6], 'images/dLinkCamera/thumb/foo.gif', 'Returns parameters');

    test.done();
  },

  translateVideoCommand : function (test) {
    'use strict';

    var dLinkCameraDvr = require(__dirname + '/../../../apps/dLinkCameraDvr'),
        goodFile       = dLinkCameraDvr.translateVideoCommand({ deviceIp : '192.168.1.1',
                                                                username : 'foo',
                                                                password : 'bar'}, 600);

    test.deepEqual(goodFile.command,    'ffmpeg',                               'Returns command');
    test.deepEqual(goodFile.params[1],  'rtsp://foo:bar@192.168.1.1/live2.sdp', 'Returns video stream');
    test.deepEqual(goodFile.params[11], 600,                                    'Returns video chunk duration');

    test.done();
  },
};
