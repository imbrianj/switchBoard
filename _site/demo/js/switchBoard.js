/*jshint -W020 */

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
 * Contains non-boilerplate methods used for SwitchBoard in the context of
 * Automation.
 */

SB.spec = (function () {
  'use strict';

  return {
    version : 20160730,

    state     : {},
    parsers   : {},
    templates : {},
    strings   : {},
    socket    : {},

    uiComponents : {
      header    : {},
      body      : {},
      indicator : {},
      templates : []
    },

    /**
     * Updates the Aria tag to announce the currently active device.
     */
    ariaDevice : function () {
      var newNav    = SB.getByClass('selected', SB.spec.uiComponents.header, 'li')[0],
          ariaTitle = SB.getByTag('h2', SB.spec.uiComponents.header)[0],
          ariaText  = SB.spec.strings.CURRENT.split('{{DEVICE}}').join(SB.getText(newNav));

      SB.putText(ariaTitle, ariaText);
    },

    /**
     * Selects the given nav item.
     *
     * @param {String} selected Name of the new tab that should be selected.
     */
    navChange : function (selected) {
      var newNav        = SB.getByClass(selected, SB.spec.uiComponents.header, 'li')[0],
          newContent    = SB.get(selected),
          selectNav     = SB.getByClass('selected', SB.spec.uiComponents.header, 'li')[0],
          selectContent = SB.getByClass('selected', SB.spec.uiComponents.body,   'section')[0];

      if ((newNav) && (!SB.hasClass(newNav, 'selected'))) {
        SB.removeClass(selectNav,     'selected');
        SB.removeClass(selectContent, 'selected');

        SB.spec.lazyLoad(selected);

        SB.storage('selected', selected);

        SB.addClass(newNav,     'selected');
        SB.addClass(newContent, 'selected');

        SB.spec.sliderSetWidths();

        SB.spec.lazyUnLoad(selectContent);

        SB.spec.ariaDevice();
      }
    },

    /**
     * Accepts a state object replaces the appropriate DOM className if able.
     * If content has changed, the entire node will be replaced.
     *
     * @param {Object} state State object of a changed controller.
     */
    updateTemplate : function (state) {
      var node        = SB.get(state.deviceId),
          parser      = SB.spec.parsers[state.typeClass],
          value       = state.value,
          deviceState = state.state,
          deviceHeader,
          selected,
          markup,
          innerMarkup = document.createElement('div'),
          oldMarkup;

      SB.spec.state[state.deviceId] = state;

      SB.log('Updated', state.deviceId, 'success');

      if (node) {
        markup       = SB.spec.uiComponents.templates[state.typeClass].markup;
        selected     = SB.hasClass(node, 'selected') ? ' selected' : '';
        oldMarkup    = node.cloneNode(true);
        deviceHeader = SB.getByTag('h1', oldMarkup)[0];
        deviceHeader.parentNode.removeChild(deviceHeader);
        oldMarkup    = oldMarkup.innerHTML;

        if (parser) {
          markup = parser(state.deviceId, markup, deviceState, value, SB.spec.uiComponents.templates[state.typeClass].fragments);
        }

        if (deviceState === 'ok') {
          markup = markup.split('{{DEVICE_ACTIVE}}').join(SB.spec.strings.ACTIVE);

          if (SB.hasClass(node,   'device-off')) {
             SB.removeClass(node, 'device-off');
             SB.addClass(node,    'device-on');
             SB.putText(SB.getByTag('em', SB.getByTag('h1', node)[0])[0], SB.spec.strings.ACTIVE);
          }
        }

        else {
          markup = markup.split('{{DEVICE_ACTIVE}}').join(SB.spec.strings.INACTIVE);

          if (SB.hasClass(node,   'device-on')) {
             SB.removeClass(node, 'device-on');
             SB.addClass(node,    'device-off');
             SB.putText(SB.getByTag('em', SB.getByTag('h1', node)[0])[0], SB.spec.strings.INACTIVE);
          }
        }

        if ((node) && (markup) && (state)) {
          SB.storage('state', SB.spec.state);

          markup = markup.split('{{DEVICE_ID}}').join(state.deviceId);
          markup = markup.split('{{DEVICE_TYPE}}').join(state.typeClass);
          markup = markup.split('{{DEVICE_SELECTED}}').join(selected);

          if (state.state === 'ok') {
            markup = markup.split('{{DEVICE_STATE}}').join(' device-on');
          }

          else {
            markup = markup.split('{{DEVICE_STATE}}').join(' device-off');
          }

          if (selected) {
            markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('src');
          }

          else {
            markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
          }
        }

        if (markup) {
          innerMarkup.innerHTML = markup;
          innerMarkup = SB.getByTag('section', innerMarkup)[0];
          deviceHeader = SB.getByTag('h1', innerMarkup)[0];
          deviceHeader.parentNode.removeChild(deviceHeader);

          if (innerMarkup.innerHTML !== oldMarkup) {
            if (SB.getByClass('sliderBar', node, 'div')[0]) {
              SB.event.removeAll(SB.getByClass('sliderBar', node, 'div')[0].getElementsByTagName('span')[0]);

              node.outerHTML = markup;

              SB.spec.buildSliders(state.deviceId);
            }

            else {
              node.outerHTML = markup;
            }
          }
        }
      }
    },

    /**
     * If the indicator has not yet been created, build it - and populate it
     * with the appropriate text and append to the supplied header DOM node.
     */
    buildIndicator : function () {
      var indicator;

      if (!SB.get('indicator')) {
        indicator = document.createElement('span');
        indicator.id = 'indicator';
        SB.addClass(indicator, 'connecting');
        SB.putText(indicator, SB.spec.strings.CONNECTING);

        SB.spec.uiComponents.indicator = indicator;
        SB.spec.uiComponents.header.appendChild(indicator);
      }
    },

    /**
     * If you have no connection, we should reconnect and grab the latest State.
     */
    checkConnection : function () {
      var connected = SB.spec.socket.readyState <= 1;

      if (!connected) {
        SB.spec.socketConnect(0);
        connected = SB.spec.socket.readyState <= 1;
      }

      return connected;
    },

    /**
     * If you have no connection indicator - or if it doesn't say we're
     * connected, we should reconnect and grab the latest State.
     */
    socketConnect : function (i) {
      var reconnect,
          open,
          message,
          error,
          close,
          cleanup,
          protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

      if ((!SB.spec.socket.readyState) || (SB.spec.socket.readyState === 3)) {
        SB.log('Connecting', 'WebSocket', 'info');

        SB.spec.socket = new WebSocket(protocol + '://' + window.location.host, 'echo-protocol');

        i += 1;

        reconnect = function () {
          // If everyone gets booted at the same time, we want to make sure they
          // have some variance in their reconnection times.
          var delay = Math.round(Math.min(Math.max((i * (Math.random() * 15)), 10), 60));

          SB.log('Retrying in ' + delay + 's', 'WebSocket', 'info');
          SB.spec.uiComponents.indicator.className = 'disconnected';
          SB.putText(SB.spec.uiComponents.indicator, SB.spec.strings.DISCONNECTED);

          setTimeout(function () {
            SB.spec.socketConnect(i);
          }, delay * 1000);
        };
      }

      open = function () {
        var reconnected = SB.spec.uiComponents.indicator.className === 'disconnected' ? true : false;

        SB.spec.uiComponents.indicator.className = 'connected';
        SB.putText(SB.spec.uiComponents.indicator, SB.spec.strings.CONNECTED);

        SB.log('Connected', 'WebSocket', 'success');

        if (reconnected) {
          SB.spec.socket.send('fetch state');

          SB.log('Reconnected', 'WebSocket', 'success');
        }

        SB.event.add(SB.spec.socket, 'close', close);
      };

      message = function (e) {
        var message = SB.decode(e.data),
            device  = {},
            notification,
            notify;

        if (typeof message.speech === 'string') {
          if (message.speech) {
            SB.log(message.speech, 'Speech', 'success');
            SB.speak(message.speech, message.language, message.voice);
          }
        }

        else if (typeof message.sound === 'string') {
          SB.log(message.sound, 'Sound', 'success');
          SB.sound.play('/mp3/' + message.sound + '.mp3');
        }

        else if (typeof message.vibrate === 'string') {
          SB.log(message.vibrate, 'Vibrate', 'success');
          SB.vibrate(message.vibrate * 100);
        }

        // If you have a title, you're a Desktop Notification.
        else if (typeof message.title === 'string') {
          notify = function () {
            if (message.deviceId) {
              SB.spec.navChange(message.deviceId);
            }
          };

          notification = SB.notify(message.title, message.options, notify);
        }

        // If you have a deviceId, you're an update to a controller state.
        else if (typeof message.deviceId === 'string') {
          SB.spec.updateTemplate(message);
        }

        else if (typeof message === 'object') {
          for (device in message) {
            if (message.hasOwnProperty(device)) {
              break;
            }
          }

          // State objects have specific deviceIds associated.
          if ((message[device]) && (message[device].deviceId)) {
            SB.log('Received', 'State', 'success');

            for (device in message) {
              if (message.hasOwnProperty(device)) {
                SB.spec.updateTemplate(message[device]);
              }
            }
          }

          // Otherwise, you're grabbing the templates.
          else if ((message[device]) && (message[device].markup)) {
            SB.spec.uiComponents.templates = message;
            SB.storage('templates', SB.spec.uiComponents.templates);
          }
        }
      };

      close = function () {
        SB.event.remove(SB.spec.socket, 'close', close);

        SB.log('Disconnected', 'WebSocket', 'error');

        reconnect();
      };

      error = function () {
        SB.event.remove(SB.spec.socket, 'error', close);

        SB.log('Error', 'WebSocket', 'error');

        reconnect();
      };

      cleanup = function () {
        SB.event.remove(SB.spec.socket, 'open',    open);
        SB.event.remove(SB.spec.socket, 'message', message);
        SB.event.remove(SB.spec.socket, 'error',   error);
        SB.event.remove(SB.spec.socket, 'close',   cleanup);
      };

      SB.event.add(SB.spec.socket, 'open',    open);
      SB.event.add(SB.spec.socket, 'message', message);
      SB.event.add(SB.spec.socket, 'error',   error);
      SB.event.add(SB.spec.socket, 'close',   cleanup);
    },

    /**
     * If WebSockets are not available, we'll do an XHR poll for current State
     * data.
     */
    statePoller : function () {
      var ajaxRequest;

      SB.log('not supported - using polling', 'WebSockets', 'error');

      // XHR, grab templates on init.
      ajaxRequest = {
        path   : '/templates/',
        param  : 'ts=' + new Date().getTime(),
        method : 'GET',
        onComplete : function () {
          SB.spec.uiComponents.templates = SB.decode(ajaxRequest.response);
          SB.storage('templates', SB.spec.uiComponents.templates);
        }
      };

      SB.ajax.request(ajaxRequest);

      // Set up our poller to continually grab device State.
      setInterval(function () {
        var pollRequest = {
          path   : '/state/',
          param  : 'ts=' + new Date().getTime(),
          method : 'GET',
          onComplete : function () {
            var state = SB.decode(pollRequest.response),
                device;

            if (state) {
              SB.spec.uiComponents.indicator.className = 'connected';
              SB.putText(SB.spec.uiComponents.indicator, SB.spec.strings.CONNECTED);

              setTimeout(function () {
                SB.spec.uiComponents.indicator.className = 'connecting';
                SB.putText(SB.spec.uiComponents.indicator, SB.spec.strings.CONNECTIG);
              }, 1000);

              for (device in state) {
                if (state.hasOwnProperty(device)) {
                  SB.spec.updateTemplate(state[device]);
                }
              }
            }

            else {
              SB.spec.uiComponents.indicator.className = 'disconnected';
              SB.putText(SB.spec.uiComponents.indicator, SB.spec.strings.DISCONNECTED);
            }
          }
        };

        SB.ajax.request(pollRequest);
      }, 10000);
    },

    /**
     * Lazy load images to lighten initial load.
     *
     * @param {String} id ID of the DOM node we want to lazy load images in.
     */
    lazyLoad : function (id) {
      var container,
          images,
          iframes,
          elms,
          i = 0;

      if (SB.get(id)) {
        container = SB.get(id);

        images  = Array.prototype.slice.call(SB.getByTag('img', container));
        iframes = Array.prototype.slice.call(SB.getByTag('iframe', container));
        elms    = images.concat(iframes);

        for (i = 0; i < elms.length; i += 1) {
          if ((elms[i].getAttribute('data-src')) && (!elms[i].src)) {
            elms[i].src = elms[i].getAttribute('data-src');
          }
        }
      }
    },

    /**
     * As some images may be streaming (such as Foscam), we'll unload them
     * when not in view to save bandwidth.
     *
     * @param {Object} elm DOM node that we want to remove image src
     *                  attributes from.
     */
    lazyUnLoad : function (elm) {
      var images,
          iframes,
          elms,
          i = 0;

      if (elm) {
        images  = Array.prototype.slice.call(SB.getByTag('img', elm));
        iframes = Array.prototype.slice.call(SB.getByTag('iframe', elm));
        elms    = images.concat(iframes);

        for (i = 0; i < elms.length; i += 1) {
          if ((elms[i].getAttribute('src')) && ((SB.hasClass(elms[i], 'streaming')) || (elms[i].tagName === 'IFRAME'))) {
            elms[i].setAttribute('data-src', elms[i].src);
            elms[i].removeAttribute('src');
          }
        }
      }
    },

    /**
     * Simply find all text fields inside any controller.
     */
    findTextInputs : function () {
      return SB.spec.uiComponents.body.getElementsByTagName('input');
    },

    /**
     * Find all number input fields inside any controller.
     */
    findNumberInputs : function () {
      var textInputs   = SB.spec.findTextInputs(),
          numberInputs = [],
          i;

      for (i = 0; i < textInputs.length; i += 1) {
        if (textInputs[i].type === 'number') {
          numberInputs.push(textInputs[i]);
        }
      }

      return numberInputs;
    },

    /**
     * Converts the numerical value in a number input into an x-offset to
     * correctly show the slider indicator in the correct position.
     *
     * @param {Object} slider DOM node of the slider indicator.
     * @param {Object} numberInput DOM node of the number input form element.
     * @return {Integer} Pixel offset of the slider's "left" value.
     */
    findSliderPosition : function (slider, numberInput) {
      var sliderWidth,
          min,
          max,
          currentVal,
          offset = 0;

      if (numberInput) {
        sliderWidth = slider.parentNode.offsetWidth - slider.offsetWidth;
        min         = parseInt(numberInput.min, 10);
        max         = parseInt(numberInput.max, 10);
        currentVal  = parseInt(numberInput.value, 10);
        offset      = ((currentVal - min) * sliderWidth) / (max - min);
        offset      = offset < sliderWidth ? offset : sliderWidth;
        offset      = offset > 0 ? offset : 0;
      }

      return Math.round(offset);
    },

    /**
     * Converts the slider offset value into a numerical value to correctly
     * show inside the number input form element.
     *
     * @param {Object} slider DOM node of the slider indicator.
     * @param {Object} drag Drag object, passed in from the clickDrag
     *                  method's callback.
     * @return {Integer} Numerical value represented by the slider position.
     */
    findSliderValue : function (slider, drag) {
      var numberInput = slider.parentNode.previousSibling,
          sliderWidth = slider.parentNode.offsetWidth - slider.offsetWidth,
          min         = parseInt(numberInput.min, 10),
          max         = parseInt(numberInput.max, 10),
          offset      = drag.newX,
          currentVal  = (((max - min) / sliderWidth) * offset) + min;

      return Math.round(currentVal);
    },

    /**
     * Creates all sliders for all numerical inputs - then create the required
     * event handlers.
     *
     * @param {String} id ID of (optional) parent node to render.  If no
     *                  parent ID is present, sliders for all controllers will
     *                  be built.
     */
    buildSliders : function (id) {
      var numberInputs = SB.spec.findNumberInputs(),
          buildSliderBar,
          changeForm,
          i;

      buildSliderBar = function (slider, numberInput) {
        slider.style.left = SB.spec.findSliderPosition(slider, numberInput) + 'px';

        SB.clickDrag({ elm        : slider,
                       restrict   : true,
                       onTween    : function (drag) {
                         var value = SB.spec.findSliderValue(slider, drag);

                         numberInput.value = value;
                         slider.setAttribute('aria-valuenow', value);
                       },
                       onComplete : function () {
                         changeForm(numberInput);
                       }
                     });
      };

      changeForm = function (elm) {
        var form = elm.parentNode,
            slider;

        if (SB.hasClass(elm.nextSibling, 'sliderBar')) {
          slider = elm.nextSibling.getElementsByTagName('span')[0];
          slider.style.left = SB.spec.findSliderPosition(slider, elm) + 'px';

          while((form !== document) && (form.tagName.toLowerCase() !== 'form')) {
            form = form.parentNode;
          }

          if (form.tagName.toLowerCase() === 'form') {
            SB.spec.sendInput(form);
          }
        }
      };

      for (i = 0; i < numberInputs.length; i += 1) {
        (function (numberInput) {
          var sliderBar,
              slider;

          if ((numberInput.type === 'number') && (numberInput.min) && (numberInput.max)) {
            if ((!id) || (SB.isChildOf(numberInput, SB.get(id)))) {
              sliderBar           = document.createElement('div');
              sliderBar.className = 'sliderBar';
              slider              = document.createElement('span');
              slider.setAttribute('role',          'slider');
              slider.setAttribute('tabindex',      0);
              slider.setAttribute('aria-valuenow', numberInput.value);
              slider.setAttribute('aria-valuemin', numberInput.min);
              slider.setAttribute('aria-valuemax', numberInput.max);
              sliderBar.appendChild(slider);
              numberInput.parentNode.insertBefore(sliderBar, numberInput.nextSibling);

              if (id) {
                buildSliderBar(slider, numberInput);
              }

              else {
                SB.event.add(window, 'load', function () {
                  buildSliderBar(slider, numberInput);
                });
              }
            }
          }
        }(numberInputs[i]));
      }

      if (!id) {
        SB.event.add(SB.spec.uiComponents.body, 'keydown', function (e) {
          var elm    = SB.getTarget(e),
              newVal = null,
              numInput;

          if (SB.hasClass(elm.parentNode, 'sliderBar')) {
            numInput = elm.parentNode.previousSibling;

            if ((e.keyCode === 38) || (e.keyCode === 39)) {
              newVal = parseInt(numInput.value, 10) + 1;
              newVal = newVal <= numInput.max ? newVal : numInput.max;
            }

            else if ((e.keyCode === 37) || (e.keyCode === 40)) {
              newVal = parseInt(numInput.value, 10) - 1;
              newVal = newVal >= numInput.min ? newVal : numInput.min;
            }

            if ((newVal) && (newVal >= numInput.min) && (newVal <= numInput.max)) {
              e.preventDefault();

              numInput.value = newVal;
            }
          }
        });

        SB.event.add(SB.spec.uiComponents.body, 'keyup', function (e) {
          var elm = SB.getTarget(e);

          if (SB.hasClass(elm.parentNode, 'sliderBar')) {
            changeForm(elm.parentNode.previousSibling);
          }
        });

        SB.event.add(window, 'resize', function () {
          SB.spec.sliderSetWidths(numberInputs);
        });

        /* If you change the form value, we should change the slider position. */
        SB.event.add(SB.spec.uiComponents.body, 'change', function (e) {
          changeForm(SB.getTarget(e));
        });
      }
    },

    /**
     * Sets slider positions to the appropriate location.  Used when a form
     * value changes or if the scroll bar changes width.
     */
    sliderSetWidths : function () {
      var numberInputs = SB.spec.findNumberInputs(),
          slider,
          i;

      for (i = 0; i < numberInputs.length; i += 1) {
        if (SB.hasClass(numberInputs[i].nextSibling, 'sliderBar')) {
          slider = numberInputs[i].nextSibling.getElementsByTagName('span')[0];

          slider.style.left = SB.spec.findSliderPosition(slider, numberInputs[i]) + 'px';
        }
      }
    },

    /**
     * Builds event handler to delegate click events for standard commands.
     */
    command : function (demoMode) {
      var commandIssued    = null,
          commandIteration = 0,
          commandDelay     = 750,
          tapped           = false,
          touched          = false,
          interrupt        = false,
          done             = false,
          touchStartX      = 0,
          touchStartY      = 0,
          touchThreshold   = 5,
          transcribe       = null,
          // iOS registers both "ontouchstart" and "onmousedown" events - but
          // with a ~400ms delay between them.  We need to act on the touch
          // event and delay any cleanup till after mousdown fires to prevent
          // potential double actions for a single event.
          touchDelay       = 450,
          stopCommand      = function () {
            commandIssued    = null;
            commandDelay     = 750;
            commandIteration = 0;
            interrupt        = true;
            touched          = false;
            done             = false;
            touchStartX      = 0;
            touchStartY      = 0;
          },
          transcribeParse  = function (text) {
            var device = commandIssued;

            SB.vibrate();

            if (!demoMode) {
              SB.spec.sendTextInput(text, device, 'text');
            }

            stopCommand();
          },
          findCommand      = function (e) {
            var elm      = SB.getTarget(e),
                tagName  = elm.tagName.toLowerCase(),
                validElm = null;

            elm = tagName === 'img'  ? elm.parentNode : elm;
            elm = tagName === 'i'    ? elm.parentNode : elm;
            elm = tagName === 'span' ? elm.parentNode : elm;

            if (elm.tagName.toLowerCase() === 'a') {
              validElm = elm;
            }

            return validElm;
          },
          sendCommand      = function () {
            var ts = new Date().getTime(),
                ajaxRequest;

            if ((commandIssued) && (!interrupt)) {
              SB.vibrate();

              if (demoMode) {
                SB.log('Issued', 'Demo Command', 'success');
              }

              else if (SB.spec.socket) {
                if (SB.spec.checkConnection()) {
                  SB.log('Issued', 'Command', 'success');
                  SB.spec.socket.send(commandIssued);
                }
              }

              else {
                ajaxRequest = {
                  path   : commandIssued,
                  param  : 'ts=' + ts,
                  method : 'GET',
                  onComplete : function () {
                    SB.log(ajaxRequest.response);
                  }
                };

                SB.ajax.request(ajaxRequest);
              }

              if (commandIteration > 3) {
                commandDelay = 650;
              }

              if (commandIteration > 10) {
                commandDelay = 500;
              }

              commandIteration += 1;

              setTimeout(sendCommand, commandDelay);
            }
          },
          fireCommand      = function (e, speech) {
            var elm = findCommand(e);

            if (speech) {
              SB.vibrate();

              commandIssued = SB.getTarget(e).parentNode.parentNode.id;
              transcribe = SB.transcribe(transcribeParse);
              transcribe.start();
            }

            else if ((elm) && (!interrupt)) {
              if (elm.rel === 'external') {
                window.open(elm.href, '_blank').focus();
              }

              else {
                commandIssued = elm.href;

                sendCommand();
              }
            }
          };

      if ('ontouchstart' in document.documentElement) {
        SB.log('Enabled', 'Touch Events', 'info');

        SB.event.add(SB.spec.uiComponents.body, 'touchstart', function (e) {
          // For quick taps of commands, we need to set a flag.
          tapped  = true;
          touched = true;

          if (findCommand(e)) {
            interrupt   = false;
            touchStartX = parseInt(e.changedTouches[0].clientX, 10);
            touchStartY = parseInt(e.changedTouches[0].clientY, 10);

            // Wait a period of time to determine if you're scrolling and to
            // wait for the onmousedown event to fire before we clean up.
            setTimeout(function () {
              // And unset that flag so we know not to run this again on
              // touchend.
              if (!done) {
                tapped = false;

                fireCommand(e);
              }
            }, touchDelay);
          }
        });

        SB.event.add(SB.spec.uiComponents.body, 'contextmenu', function (e) {
          e.preventDefault();
        });

        SB.event.add(SB.spec.uiComponents.body, 'touchend', function (e) {
          // Emoji touch events are cancelled after speech recognition - which
          // requires lifting your finger to accept the dialog.
          if (!SB.hasClass(SB.getTarget(e).parentNode, 'emoji') && (tapped)) {
            done = true;

            fireCommand(e);
          }

          stopCommand(e);
        });

        SB.event.add(SB.spec.uiComponents.body, 'touchmove', function (e) {
          if (touched) {
            if ((Math.abs(parseInt(e.changedTouches[0].clientX, 10) - touchStartX) > touchThreshold) || (Math.abs(parseInt(e.changedTouches[0].clientY, 10) - touchStartY) > touchThreshold)) {
              stopCommand(e);
            }
          }
        });

        SB.event.add(SB.spec.uiComponents.body, 'touchcancel', function (e) {
          stopCommand(e);
        });
      }

      SB.event.add(SB.spec.uiComponents.body, 'mousedown', function (e) {
        if (SB.hasClass(SB.getTarget(e).parentNode, 'emoji')) {
          fireCommand(e, true);
        }

        else if ((touched === false) && (tapped === false)) {
          interrupt = false;

          fireCommand(e);
        }

        // Since this registers after touchend, we'll now reset it for next use.
        tapped = false;
      });

      SB.event.add(SB.spec.uiComponents.body, 'mouseup', function (e) {
        if (!SB.hasClass(SB.getTarget(e).parentNode, 'emoji')) {
          stopCommand(e);
        }
      });

      SB.event.add(SB.spec.uiComponents.body, 'click', function (e) {
        if (findCommand(e)) {
          e.preventDefault();
        }
      });

      SB.event.add(SB.spec.uiComponents.body, 'keyup', function (e) {
        if ((e.keyCode === 13) && (findCommand(e))) {
          interrupt = false;
          fireCommand(e);
          setTimeout(function() {
            interrupt = true;
          }, (commandDelay / 2));
        }
      });
    },

    /**
     * Accepts form inputs for text and numbers - grabs the values required and
     * passes them along for submission.
     */
    sendInput : function (elm) {
      var input  = SB.getByTag('input', elm, 'input')[0],
          text   = input.value,
          device = input.name,
          type   = SB.getByClass('input-type', elm, 'input')[0].value;

      if (input.type === 'text') {
        input.value = '';
      }

      SB.spec.sendTextInput(text, device, type);
    },

    /**
     * Handles text and number input execution.  If you support WebSockets and
     * have an active connection, we'll use that.  If not, we'll use XHR.
     */
    sendTextInput : function (text, device, type) {
      var ts = new Date().getTime(),
          ajaxRequest;

      type = type || 'text';

      if (SB.spec.socket) {
        if (SB.spec.checkConnection()) {
          SB.log('Issued', 'Text Command', 'success');

          SB.spec.socket.send('/?' + device + '=' + type + '-' + text);
        }
      }

      else {
        ajaxRequest = {
          path       : '/',
          param      : device + '=' + type + '-' + text + '&ts=' + ts,
          method     : 'POST',
          onComplete : function () {
            SB.log(ajaxRequest.response);
          }
        };

        SB.ajax.request(ajaxRequest);
      }
    },

    /**
     * Builds event handler to delegate form submission events for text and
     * number inputs.
     */
    formInput : function (demoMode) {
      SB.event.add(SB.spec.uiComponents.body, 'submit', function (e) {
        var elm = SB.getTarget(e);

        e.preventDefault();

        if (demoMode) {
          SB.log('Issued', 'Demo Text Command', 'success');
        }

        else {
          SB.spec.sendInput(elm);
        }
      });
    },

    /**
     * Handles navigation changes and changes to the connection indicator.
     */
    nav : function () {
      SB.event.add(SB.spec.uiComponents.header, 'click', function (e) {
        var elm     = SB.getTarget(e).parentNode,
            tagName = elm.tagName.toLowerCase();

        if (tagName === 'li') {
          e.preventDefault();

          SB.spec.navChange(elm.className);

          SB.vibrate();
          SB.notifyAsk();
        }

        else if (SB.getTarget(e).id === 'indicator') {
          if (SB.hasClass(SB.getTarget(e), 'disconnected')) {
            SB.spec.socketConnect(0);
          }
        }
      });
    },

    /**
     * Initialization for SB.  Executes the standard functions used.
     */
    init : function () {
      var demoMode  = true,
          active    = SB.storage('selected'),
          templates = SB.storage('templates'),
          state     = SB.storage('state'),
          device,
          headerData,
          bodyData;

      SB.spec.uiComponents.header = SB.getByTag('header')[0];
      SB.spec.uiComponents.body   = SB.getByTag('main')[0];
      SB.spec.buildIndicator();

      headerData = SB.spec.uiComponents.header.dataset;
      bodyData   = SB.spec.uiComponents.body.dataset;

      SB.spec.strings = { CURRENT      : headerData.stringCurrent,
                          CONNECTED    : headerData.stringConnected,
                          CONNECTING   : headerData.stringConnecting,
                          DISCONNECTED : headerData.stringDisconnected,
                          ACTIVE       : bodyData.stringActive,
                          INACTIVE     : bodyData.stringInactive,
                          ON           : bodyData.stringOn,
                          OFF          : bodyData.stringOff,
                          AM           : bodyData.stringAm,
                          PM           : bodyData.stringPm,
                          SUN          : bodyData.stringSun,
                          MON          : bodyData.stringMon,
                          TUE          : bodyData.stringTue,
                          WED          : bodyData.stringWed,
                          THUR         : bodyData.stringThur,
                          FRI          : bodyData.stringFri,
                          SAT          : bodyData.stringSat };

      if (active) {
        SB.spec.navChange(active);
      }

      if ((templates) && (state)) {
        SB.spec.uiComponents.templates = SB.decode(templates);

        state = SB.decode(state);

        for (device in state) {
          if (state.hasOwnProperty(device)) {
            SB.spec.updateTemplate(state[device]);
          }
        }
      }

      if (!demoMode) {
        /* If we support WebSockets, we'll grab updates as they happen */
        if ((typeof WebSocket === 'function') || (typeof WebSocket === 'object')) {
          SB.spec.socketConnect(0);
        }

        /* Otherwise, we'll poll for updates */
        else {
          SB.spec.statePoller();
        }
      }

      SB.spec.lazyLoad(document.body.className);

      SB.spec.buildSliders();
      SB.spec.command(demoMode);
      SB.spec.formInput(demoMode);
      SB.spec.nav();
      SB.spec.ariaDevice();
    }
  };
}());
