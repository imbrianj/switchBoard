/*global document, window, ActiveXObject, init, console, XMLHttpRequest, Switchboard, Notification */
/*jslint white: true, evil: true */
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

Switchboard = (function () {
  'use strict';

  return {
    version : 20140903,

    state : {},

    parsers : {},

    templates : {},

    strings : {},

    event : {
      list : [],

     /**
      * Handles event attachment via the best method availalbe.
      *
      * @param {Object} elm Element to have the event attached to.
      * @param {String} event Event to trigger.  Options include all standard
      *         events, minus the "on" prefix (ex: "click", "dblclick", etc).
      *         Additionally, "mouseenter" and "mouseleave" are supported.
      * @param {Function} action Function to be executed when the given event
      *         is triggered.
      * @param {Boolean} capture true if the event should be registered as a
      *         capturing listener.  Defaults to false.
      * @note All events are added to the Switchboard.event.list array for
      *        access outside this function.
      */
      add : function (elm, event, action, capture) {
        capture = capture || false;

        if (elm.addEventListener) {
          elm.addEventListener(event, action, capture);
        }

        else if (elm.attachEvent) {
          elm.attachEvent('on' + event, action);
        }

        else {
          elm['on' + event] = action;
        }

        Switchboard.event.list.push([elm, event, action]);
      },

     /**
      * Removes events attached to a given element.
      *
      * @param {Object} elm Element to have the event removed from.
      * @param {String} event Event to trigger.  Options include all standard
      *         events, minus the "on" prefix (ex: "click", "dblclick", etc).
      * @param {Function} action Function to be removed from the given element
      *         and event.
      * @param {Boolean} capture true if the event was registered as a
      *         capturing listener.  Defaults to false.
      * @note Automatically removes the event from the Switchboard.event.list
      *        array.
      */
      remove : function (elm, event, action, capture) {
        capture = capture || false;

        var i = 0;

        if (elm.removeEventListener) {
          elm.removeEventListener(event, action, capture);
        }

        else if (elm.detachEvent) {
          elm.detachEvent('on' + event, action);
        }

        else {
          elm['on' + event] = null;
        }

        for (i; i < Switchboard.event.list.length; i += 1) {
          if (Switchboard.event.list[i]) {
            if ((Switchboard.event.list[i]) &&
                (Switchboard.event.list[i][0] === elm) &&
                (Switchboard.event.list[i][1] === event) &&
                (Switchboard.event.list[i][2] === action)) {
              Switchboard.event.list.splice(i, 1);

              break;
            }
          }
        }
      },

     /**
      * Loops through all registered events (referencing the
      *  Switchboard.event.list array) and removes all events.  This should
      *  only be executed onunload to prevent documented IE6 memory leaks.
      */
      removeAll : function (elm) {
        elm = elm || document;

        var i = Switchboard.event.list.length - 1;

        for (i; i >= 0 ; i -= 1) {
          if (Switchboard.event.list[i]) {
            if ((Switchboard.event.list[i]) && ((Switchboard.event.list[i][0] === elm) || (elm === document))) {
              Switchboard.event.remove(Switchboard.event.list[i][0], Switchboard.event.list[i][1], Switchboard.event.list[i][2]);
            }
          }
        }
      }
    },

   /**
    * Shortcut function used to quickly find the target of an event (used in
    *  event delegation).
    *
    * @param {Event} e Event to determine the target of.
    * @return {Object} Element that was the target of the specified event.
    */
    getTarget : function (e) {
      e = e || window.event;

      if (e.target) {
        return e.target;
      }

      else {
        return e.srcElement;
      }
    },

   /**
    * Looks for a given attribute with a specified value within the given
    *  element.
    *
    * @param {Object} elm Element to check for a given attribute.
    * @param {String} attribute Attribute being checked.
    * @param {String} value Value of the attribute specifically being checked.
    * @return {Boolean} true if the given attribute and value is found within
    *          the element.
    */
    hasAttribute : function (elm, attribute, value) {
      if (elm[attribute]) {
        return elm[attribute].match(new RegExp('(\\s|^)' + value + '(\\s|$)')) ? true : false;
      }
    },

   /**
    * Sugar function used to find if a given element has the 'className'
    *  attribute specified.
    *
    * @param {Object} elm Element to check for a given class name.
    * @param {String} className Class name being checked.
    */
    hasClass : function (elm, className) {
      return Switchboard.hasAttribute(elm, 'className', className) ? true : false;
    },

   /**
    * Add the specified class to the given element - but only if it does not
    *  already have the class.
    *
    * @param {Object} elm Element to apply the given class to.
    * @param {String} className Class name to be applied.
    */
    addClass : function (elm, className) {
      if (!Switchboard.hasClass(elm, className)) {
        elm.className = Switchboard.trim(elm.className + ' ' + className);
      }
    },

   /**
    * Removes the specified class from the given element.
    *
    * @param {Object} elm Element to remove the given class from.
    * @param {String} className Class name to be removed.
    */
    removeClass : function (elm, className) {
      if (Switchboard.hasClass(elm, className)) {
        elm.className = elm.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ');
        elm.className = Switchboard.trim(elm.className);
      }
    },

   /**
    * Sugar function used to add or remove a class from a given element -
    *  depending on if it already has the class applied.
    *
    * @param {Object} elm Element to have the class toggled.
    * @param {String} className Class Name to be toggled.
    */
    toggleClass : function (elm, className) {
      if (!Switchboard.hasClass(elm, className)) {
        Switchboard.addClass(elm, className);
      }

      else {
        Switchboard.removeClass(elm, className);
      }
    },

    /**
     * Shortcut to document.getElementById
     *
     * @param {String} ID name to be searched for.
     */
    get : function (id) {
      return document.getElementById(id);
    },

    /**
     * Shortcut to document.getElementsByTagName
     * @param {String} tagName Tag name to be searched for.
     * @param {Object} parent Parent element to begin the search from.  If no
     *                 element is specified, the document root will be used.
     */
    getByTag : function (tagName, parent) {
      parent = parent || document;

      return parent.getElementsByTagName(tagName);
    },

   /**
    * Finds all elements with the given class name.  Optionally, a tag name can
    *  specified to further refine an element search.
    *
    * @param {String} className Class name to be searched for.
    * @param {Object} parent Parent element to begin the search from.  If no
    *         element is specified, the document root will be used.
    * @param {String} tag Optionally, you may specify a tag name to further
    *         filter.
    * @return {Array} Returns an array of elements matching the entered
    *          criteria.
    * @note Uses native getElementsByClassName if available.
    */
    getByClass : function (className, parent, tag) {
      var elementsWithClass = [],
          children = [],
          i = 0,
          j = 0;

      parent = parent || document;
      tag    = tag.toLowerCase() || '*';

      if ((tag === '*') && (document.getElementsByClassName)) {
        return parent.getElementsByClassName(className);
      }

      if (parent.getElementsByClassName) {
        children = parent.getElementsByClassName(className);

        if (tag && children.length) {
          for (i in children) {
            if ((children[i].tagName) && (children[i].tagName.toLowerCase() === tag)) {
              elementsWithClass[j] = children[i];
              j += 1;
            }
          }
        }

        else {
          elementsWithClass = children;
        }
      }

      else {
        children = Switchboard.getByTag(tag, parent);

        for (i in children) {
          if (Switchboard.hasClass(children[i], className)) {
            elementsWithClass[j] = children[i];
            j += 1;
          }
        }
      }

      return elementsWithClass;
    },

   /**
    * Retrieves text from a given element, using the best method available.
    *
    * @param {Object} elm Element to have text retrieved from.
    */
    getText : function (elm) {
      if (elm.textContent) {
        return elm.textContent;
      }

      else if (elm.innerText) {
        return elm.innerText;
      }

      else if (elm.text) {
        return elm.text;
      }

      else {
        return elm.innerHTML;
      }
    },

   /**
    * Enters text into a given element, using the best method available.  If
    *  text already exists within the element, it will be overwritten.
    *
    * @param {Object} elm Element to have text entered into.
    * @param {String} text Text that will populate the element.
    */
    putText : function (elm, text) {
      if (elm.textContent) {
        elm.textContent = text;
      }

      else if (elm.innerText) {
        elm.innerText = text;
      }

      else if (elm.text) {
        elm.text = text;
      }

      else {
        elm.innerHTML = text;
      }
    },

   /**
    * Removes extra whitespace at the beginning or end of a given string.
    *
    * @param {String} string String of text that may have leading or trailing
    *         whitespace.
    * @return {String} String of text with leading or trailing whitespace
    *          removed.
    */
    trim : function (string) {
      string = string || '';

      return string.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },

    /**
     * Accepts a string of JSON and returns a native Javascript object.
     *
     * @param {String} string String of JSON code to be decoded to an object.
     * @return {Object} Native Javascript object.
     * @note Uses eval() if JSON.parse is not available, so as to support older
     *        browsers.  This is dangerous if you do not trust your source of
     *        the JSON string.
     */
    decode : function (json) {
      var reply = '';

      if (typeof JSON === 'object') {
        reply = JSON.parse(json);
      }

      else {
        // This is terrible.  Evil, in fact.
        reply = eval('(' + json + ')');
      }

      return reply;
    },

    /**
     * Stupid wrapper to ensure console.log exists before using it.
     *
     * @param {String} string String to be printed to console log.
     */
    log : function (message) {
      var now = new Date();

      if(typeof console === 'object' && typeof console.log === 'function') {
        console.log(message + ' (' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ')');
      }
    },

    ajax : {
     /**
      * Sends an AJAX request to the specified URL.  On receipt of a response,
      *  you may define a element to populate with the raw response or define
      *  an onComplete function to process the response.
      *
      * @param {Object} ajaxRequest Object containing:
      *         {String} method Method of request ("GET" or "POST").
      *         {String} param Additional parameters.
      *         {Function} onStart Function to be executed before an AJAX
      *          request begins.
      *         {Function/Object} onComplete Function to be executed after an
      *          AJAX request completes.  If a DOM object is passed instead of
      *          a function, the raw AJAX response will populate the element.
      */
      request : function (ajaxRequest) {
        ajaxRequest.method     = ajaxRequest.method     || 'GET';
        ajaxRequest.onStart    = ajaxRequest.onStart    || function () {};
        ajaxRequest.onComplete = ajaxRequest.onComplete || function () {};

        var request,
            ajaxProcess,
            divider = '?';

        ajaxProcess = function () {
          ajaxRequest.onStart();

          switch (typeof(ajaxRequest.onComplete)) {
            case 'object' :
              if (ajaxRequest.onComplete.value) {
                ajaxRequest.onComplete.value = ajaxRequest.response;
              }

              else if (ajaxRequest.onComplete.childNodes[0]) {
                Switchboard.putText(ajaxRequest.onComplete, ajaxRequest.response);
              }
            break;

            case 'function' :
              ajaxRequest.onComplete();
            break;
          }
        };

        if (window.XMLHttpRequest) {
          request = new XMLHttpRequest();
        }

        else if (window.ActiveXObject) {
          request = new ActiveXObject('Microsoft.XMLHTTP');
        }

        else {
          return false;
        }

        if (ajaxRequest.method === 'GET') {
          if (ajaxRequest.path.indexOf('?') !== -1 || ajaxRequest.param.indexOf('?') !== -1) {
            divider = '&';
          }

          ajaxRequest.path  = ajaxRequest.path + divider + ajaxRequest.param;

          ajaxRequest.param = '';
        }

        request.open(ajaxRequest.method.toUpperCase(), ajaxRequest.path, true);

        if (ajaxRequest.method === 'POST') {
          request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        request.setRequestHeader('rest', 'true');

        Switchboard.event.add(request, 'readystatechange', function () {
          if (request.readyState === 4) {
            if (request.status === 200) {
              ajaxRequest.response = request.responseText;

              ajaxProcess();
            }

            else {
              return false;
            }
          }
        });

        request.send(ajaxRequest.param);
      }
    },

   /**
    * Initialization for Switchboard.  Executes the standard functions used.
    *  If a global function of "init" is available, it will also be executed.
    */
    init : function () {
      var SB         = Switchboard,
          header     = SB.getByTag('header')[0],
          body       = SB.getByTag('main')[0],
          textInputs = SB.getByClass('text-form', body, 'form'),
          lazyLoad,
          lazyUnLoad,
          templates,
          socketConnect,
          checkConnection,
          updateTemplate,
          indicator,
          buildIndicator,
          socket,
          i;

      SB.strings = { ACTIVE       : body.dataset.stringActive,
                     INACTIVE     : body.dataset.stringInactive,
                     CONNECTED    : header.dataset.stringConnected,
                     CONNECTING   : header.dataset.stringConnecting,
                     DISCONNECTED : header.dataset.stringDisconnected };

      updateTemplate = function(state) {
        var node        = SB.get(state.deviceId),
            parser      = SB.parsers[state.typeClass],
            value       = state.value,
            deviceState = state.state,
            deviceHeader,
            selected,
            markup,
            innerMarkup = document.createElement('div'),
            oldMarkup,
            i;

        SB.state[state.deviceId] = state;

        SB.log(state.deviceId + ' updated');

        if(node) {
          markup       = templates[state.typeClass].markup;
          selected     = SB.hasClass(node, 'selected') ? ' selected' : '';
          oldMarkup    = node.cloneNode(true);
          deviceHeader = SB.getByTag('h1', oldMarkup)[0];
          oldMarkup.removeChild(deviceHeader);
          oldMarkup    = oldMarkup.innerHTML;

          if(parser) {
            markup = parser(state.deviceId, markup, deviceState, value, templates[state.typeClass].fragments);
          }

          if(deviceState === 'ok') {
            markup = markup.split('{{DEVICE_ACTIVE}}').join(SB.strings.ACTIVE);

            if(SB.hasClass(node, 'device-off')) {
              SB.removeClass(node, 'device-off');
              SB.addClass(node, 'device-on');
              SB.putText(SB.getByTag('em', SB.getByTag('h1', node)[0])[0], SB.strings.ACTIVE);
            }
          }

          else {
            markup = markup.split('{{DEVICE_ACTIVE}}').join(SB.strings.INACTIVE);

            if(SB.hasClass(node, 'device-on')) {
              SB.removeClass(node, 'device-on');
              SB.addClass(node, 'device-off');
              SB.putText(SB.getByTag('em', SB.getByTag('h1', node)[0])[0], SB.strings.INACTIVE);
            }
          }

          if(node && markup && state) {
            markup = markup.split('{{DEVICE_ID}}').join(state.deviceId);
            markup = markup.split('{{DEVICE_TYPE}}').join(state.typeClass);
            markup = markup.split('{{DEVICE_SELECTED}}').join(selected);

            if(state.state === 'ok') {
              markup = markup.split('{{DEVICE_STATE}}').join(' device-on');
            }

            else {
              markup = markup.split('{{DEVICE_STATE}}').join(' device-off');
            }

            if(selected) {
              markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('src');
            }

            else {
              markup = markup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
            }
          }

          if(markup) {
            innerMarkup.innerHTML = markup;
            innerMarkup = SB.getByTag('section', innerMarkup)[0];
            innerMarkup.removeChild(SB.getByTag('h1', innerMarkup)[0]);

            if(innerMarkup.innerHTML !== oldMarkup) {
              node.outerHTML = markup;
            }
          }
        }
      };

      buildIndicator = function (type) {
        var reconnect = true;

        if(!SB.get('indicator')) {
          indicator = document.createElement('span');
          indicator.id = 'indicator';
          SB.addClass(indicator, 'connecting');
          SB.putText(indicator, SB.strings.CONNECTING);

          header.appendChild(indicator);

          reconnect = false;
        }

        return reconnect;
      };

      socketConnect = function () {
        var reconnect = buildIndicator();

        SB.log('Connecting to WebSocket');

        socket = new WebSocket('ws://' + window.location.host, 'echo-protocol');

        SB.event.add(socket, 'open', function(e) {
          indicator.className = 'connected';
          SB.putText(indicator, SB.strings.CONNECTED);

          if(reconnect) {
            socket.send('fetch state');

            SB.log('Reconnected to WebSocket');
          }
        });

        SB.event.add(socket, 'close', function(e) {
          indicator.className = 'disconnected';
          SB.putText(indicator, SB.strings.DISCONNECTED);

          SB.log('Disconnected from WebSocket');
        });

        SB.event.add(socket, 'message', function(e) {
          var message = SB.decode(e.data),
              device  = {},
              notification;

          if(typeof message.title === 'string') {
            if(typeof Notification === 'function') {
              notification = new Notification(message.title, message.options);

              setTimeout(function() {
                notification.close();
              }, 10000);

              SB.event.add(notification, 'click', function(e) {
                var newContent,
                    selectNav,
                    selectContent;

                window.focus();

                if(message.deviceId) {
                  newContent    = SB.get(message.deviceId);
                  selectNav     = SB.getByClass('selected', header, 'li')[0];
                  selectContent = SB.getByClass('selected', body,   'section')[0];

                  SB.removeClass(selectNav,     'selected');
                  SB.removeClass(selectContent, 'selected');

                  lazyLoad(message.deviceId);

                  SB.addClass(SB.getByClass(message.deviceId, header, 'li')[0], 'selected');
                  SB.addClass(newContent, 'selected');

                  lazyUnLoad(selectContent);
                }
              });
            }
          }

          else if(typeof message.deviceId === 'string') {
            updateTemplate(message);
          }

          else if(typeof message === 'object') {
            for(device in message) break;

            // State objects have specific deviceIds associated.
            if((message[device]) && (message[device].deviceId)) {
              SB.log('Received latest State');

              for(device in message) {
                updateTemplate(message[device]);
              }
            }

            // Otherwise, you're grabbing the templates.
            else if((message[device]) && (message[device].markup)) {
              templates = message;
            }
          }
        });
      };

      checkConnection = function () {
        // If you have no connection indicator - or if it doesn't say we're
        // connected, we should reconnect and grab the latest State.
        var state = indicator && SB.hasClass(indicator, 'connected');

        if(!state) {
          socketConnect();
        }

        return state;
      };

      /* If we support WebSockets, we'll grab updates as they happen */
      if((typeof WebSocket === 'function') || (typeof WebSocket === 'object')) {
        socketConnect();
      }

      /* Otherwise, we'll poll for updates */
      else {
        SB.log('WebSockets not supported - using polling');

        buildIndicator();

        (function() {
          var ajaxRequest;

          // XHR, grab templates on init.
          ajaxRequest = {
            path   : '/templates/',
            param  : 'ts=' + new Date().getTime(),
            method : 'GET',
            onComplete : function () {
              templates = SB.decode(ajaxRequest.response);
            }
          };

          SB.ajax.request(ajaxRequest);

          // Set up our poller to continually grab device State.
          setInterval(function() {
            var pollRequest = {
              path   : '/state/',
              param  : 'ts=' + new Date().getTime(),
              method : 'GET',
              onComplete : function () {
                var state = SB.decode(pollRequest.response),
                    device;

                if(state) {
                  indicator.className = 'connected';
                  SB.putText(indicator, SB.strings.CONNECTED);

                  setTimeout(function() {
                    indicator.className = 'connecting';
                    SB.putText(indicator, SB.strings.CONNECTIG);
                  }, 1000);

                  for(device in state) {
                    updateTemplate(state[device]);
                  }
                }

                else {
                  indicator.className = 'disconnected';
                  SB.putText(indicator, SB.strings.DISCONNECTED);
                }
              }
            };

            SB.ajax.request(pollRequest);
          }, 10000);
        })();
      }

      /* Lazyload of images */
      lazyLoad = function(id) {
        var container,
            images,
            i = 0;

        if(SB.get(id)) {
          container = SB.get(id);

          images = SB.getByTag('img', container);

          for(i = 0; i < images.length; i += 1) {
            if((images[i].getAttribute('data-src')) && (!images[i].src)) {
              images[i].src = images[i].getAttribute('data-src');
            }
          }
        }
      };

      /* Remove src attributes of streaming content to keep from wasting
         bandwidth. */
      lazyUnLoad = function(elm) {
        var images,
            i = 0;

        if(elm) {
          images = SB.getByTag('img', elm);

          for(i = 0; i < images.length; i += 1) {
            if((images[i].getAttribute('src')) && (SB.hasClass(images[i], 'streaming'))) {
              images[i].setAttribute('data-src', images[i].src);
              images[i].removeAttribute('src');
            }
          }
        }
      };

      lazyLoad(document.body.className);

      /* Clicking of navigation items */
      SB.event.add(header, 'click', function(e) {
        var elm           = SB.getTarget(e).parentNode,
            tagName       = elm.tagName.toLowerCase(),
            newContent    = SB.get(elm.className),
            selectNav     = SB.getByClass('selected', header, 'li')[0],
            selectContent = SB.getByClass('selected', body,   'section')[0];

        if(tagName === 'li') {
          e.preventDefault();

          if(elm !== selectNav) {
            SB.removeClass(selectNav,     'selected');
            SB.removeClass(selectContent, 'selected');

            lazyLoad(elm.className);

            SB.addClass(elm,        'selected');
            SB.addClass(newContent, 'selected');

            lazyUnLoad(selectContent);
          }

          if(typeof Notification === 'function') {
            if(Notification.permission !== 'denied') {
              Notification.requestPermission(function(permission) {
                if(Notification.permission !== permission) {
                  Notification.permission = permission;
                }
              });
            }
          }
        }

        else if(SB.getTarget(e).id === 'indicator') {
          if(SB.hasClass(Switchboard.getTarget(e), 'disconnected')) {
            socketConnect();
          }
        }
      });

      /* Typical command executions */
      SB.event.add(body, 'click', function(e) {
        var elm     = SB.getTarget(e),
            tagName = elm.tagName.toLowerCase(),
            command = '',
            ts      = new Date().getTime(),
            ajaxRequest;

        elm = tagName === 'img'  ? elm.parentNode : elm;
        elm = tagName === 'i'    ? elm.parentNode : elm;
        elm = tagName === 'span' ? elm.parentNode : elm;

        if((elm.tagName.toLowerCase() === 'a') && (elm.rel != 'external')) {
          e.preventDefault();

          command = elm.href;

          if(socket) {
            if(checkConnection()) {
              socket.send(elm.href);
            }
          }

          else {
            ajaxRequest = {
              path   : command,
              param  : 'ts=' + ts,
              method : 'GET',
              onComplete : function () {
                SB.log(ajaxRequest.response);
              }
            };

            SB.ajax.request(ajaxRequest);
          }
        }
      });

      /* Form submissions - such as text */
      SB.event.add(body, 'submit', function(e) {
        var elm  = SB.getTarget(e),
            ts   = new Date().getTime(),
            text = '',
            type = '',
            device,
            ajaxRequest;

        e.preventDefault();

        text   = SB.getByClass('text-input', elm, 'input')[0].value;
        device = SB.getByClass('text-input', elm, 'input')[0].name;
        type   = SB.getByClass('input-type', elm, 'input')[0].value;

        if(socket) {
          if(checkConnection()) {
            socket.send('/?' + device + '=' + type + '-' + text);
          }
        }

        else {
          ajaxRequest = {
            path       : '/',
            param      : device + '=' + type + '-' + text,
            method     : 'POST',
            onComplete : function () {
              SB.log(ajaxRequest.response);
            }
          };

          SB.ajax.request(ajaxRequest);
        }
      });

      SB.addClass(document.body, 'rich');
    }
  };
}());

if(document.addEventListener) {
  document.addEventListener('DOMContentLoaded', Switchboard.init, false);
}

Switchboard.event.add(window, 'load', function () {
  'use strict';

  if(!document.addEventListener) {
    Switchboard.init();
  }
});

Switchboard.event.add(window, 'unload', function () {
  'use strict';

  Switchboard.event.removeAll();
});
