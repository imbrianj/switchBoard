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
 * @fileoverview Unit test for runCommand.js
 */

exports.runCommandTest = {
  parseCommands : function (test) {
    'use strict';

    var runCommand  = require(__dirname + '/../../../lib/runCommand'),
        controllers = { config  : { ai : { eventLogging : false } },
                        samsung : { config       : { deviceId : 'TEST-deviceId',
                                                     title    : 'TEST-title' },
                                    markup       : '<span>{{DEVICE_ID}} {{TEST_KEY}}</span>',
                                    controller   : { inputs : ['command'],
                                                     keymap : ['VOLUP'],
                                                     send   : function (request) { return request; } } } },
        request     = { connection : { remoteAddress : '127.0.0.1' } },
        response    = { end : function () {} },
        emptyCommand,
        badCommand,
        goodCommand;

    runCommand.init(controllers);

    emptyCommand = runCommand.parseCommands('samsung', '',        null, request, response);
    badCommand   = runCommand.parseCommands('samsung', 'VOLMUTE', null, request, response);
    goodCommand  = runCommand.parseCommands('samsung', 'VOLUP',   null, request, response);

    test.strictEqual(emptyCommand, '', 'Empty reply if there is no command issued');
    test.deepEqual(badCommand,  { device : 'samsung', command : 'VOLMUTE', message : 'invalid' }, 'Bad command should be invalidated');
    test.deepEqual(goodCommand, { device : 'samsung', command : 'VOLUP',   message : 'valid' },   'Good command should be validated');

    test.done();
  },

  macroCommands : function (test) {
    'use strict';

    var runCommand = require(__dirname + '/../../../lib/runCommand'),
        macro      = runCommand.macroCommands('something');

    test.strictEqual(macro, false, 'Bad macros should return false');

    test.done();
  },

  stripTypePrefix : function (test) {
    'use strict';

    var runCommand = require(__dirname + '/../../../lib/runCommand'),
        text       = runCommand.stripTypePrefix('text-TEST', 'text'),
        launch     = runCommand.stripTypePrefix('launch-TEST', 'launch'),
        list       = runCommand.stripTypePrefix('list', 'list'),
        command    = runCommand.stripTypePrefix('TEST', 'command'),
        stream     = runCommand.stripTypePrefix('stream', 'stream');

    test.strictEqual(text,    'TEST', 'Text should be returned without prefix');
    test.strictEqual(launch,  'TEST', 'Launch should be returned without prefix');
    test.strictEqual(list,    true,   'List should return a boolean');
    test.strictEqual(command, 'TEST', 'Commands should be returned without change');
    test.strictEqual(stream,  true,   'Stream should return a boolean');

    test.done();
  },

  getCommandType : function (test) {
    'use strict';

    var runCommand = require(__dirname + '/../../../lib/runCommand'),
        empty      = runCommand.getCommandType(null),
        text       = runCommand.getCommandType('text-TEST'),
        launch     = runCommand.getCommandType('launch-TEST'),
        list       = runCommand.getCommandType('list'),
        command    = runCommand.getCommandType('TEST'),
        stream     = runCommand.getCommandType('STREAM');

    test.strictEqual(empty,   '',        'Should return an empty string');
    test.strictEqual(text,    'text',    'Should return text');
    test.strictEqual(launch,  'launch',  'Should return launch');
    test.strictEqual(list,    'list',    'Should return list');
    test.strictEqual(command, 'command', 'Should return command');
    test.strictEqual(stream,  'stream',  'Should return stream');

    test.done();
  },

  findSubdevice : function (test) {
    'use strict';

    var runCommand = require(__dirname + '/../../../lib/runCommand'),
        empty      = runCommand.findSubdevice(null),
        text       = runCommand.findSubdevice('text-TEST'),
        subdevice  = runCommand.findSubdevice('subdevice-TEST-on'),
        subdevice2 = runCommand.findSubdevice('subdevice-NAME-WITH-DASHES-on');

    test.strictEqual(empty,      '',                 'Should return an empty string');
    test.strictEqual(text,       '',                 'Should return an empty string');
    test.strictEqual(subdevice,  'TEST',             'Should return the presumed subdevice name');
    test.strictEqual(subdevice2, 'NAME-WITH-DASHES', 'Should return the presumed subdevice name');

    test.done();
  },

  validateCommand : function (test) {
    'use strict';

    var runCommand  = require(__dirname + '/../../../lib/runCommand'),
        controllers = { samsung : { config     : { deviceId : 'TEST-deviceId',
                                                   title : 'TEST-title' },
                                    markup     : '<span>{{DEVICE_ID}} {{TEST_KEY}}</span>',
                                    controller : { inputs : ['command', 'text'],
                                                   keymap : ['VOLUP'],
                                                   send   : function (request) { return request; } } } },
        validCommand,
        validText,
        invalidLaunch,
        invalidList,
        invalidCommand;

    runCommand.init(controllers);

    validCommand   = runCommand.validateCommand('samsung', 'VOLUP');
    validText      = runCommand.validateCommand('samsung', 'text-TEST');
    invalidLaunch  = runCommand.validateCommand('samsung', 'launch-TEST');
    invalidList    = runCommand.validateCommand('samsung', 'launch');
    invalidCommand = runCommand.validateCommand('samsung', 'TEST');

    test.strictEqual(validCommand,   true,  'Good command should be validated');
    test.strictEqual(validText,      true,  'Text should be validated');
    test.strictEqual(invalidLaunch,  false, 'This device is not configured to support launch shortcuts');
    test.strictEqual(invalidList,    false, 'This device is not configured to support list shortcuts');
    test.strictEqual(invalidCommand, false, 'Bad command should be invalidated');

    test.done();
  },

  runCommand : function (test) {
    'use strict';

    var runCommand     = require(__dirname + '/../../../lib/runCommand'),
        request        = { connection : { remoteAddress : '127.0.0.1' } },
        response       = { end : function (msg) { return msg; } },
        validCommand   = runCommand.runCommand('samsung', 'VOLUP', null, request, response),
        invalidCommand = runCommand.runCommand('samsung', 'TEST',  null, request, response);

    test.deepEqual(validCommand,   { device: 'samsung', command: 'VOLUP', message: 'valid' },   'Good command should be validated');
    test.deepEqual(invalidCommand, { device: 'samsung', command: 'TEST',  message: 'invalid' }, 'Bad command should be invalidated');

    test.done();
  }
};
