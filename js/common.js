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
    version : 20140805,

    state : {},

    parsers : {},

    templates : {},

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
    getElementsByClassName : function (className, parent, tag) {
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
        children = parent.getElementsByTagName(tag);

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
      if(typeof console === 'object' && typeof console.log === 'function') {
        console.log(message);
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
      var header     = Switchboard.getElementsByClassName('header', document.body, 'div')[0],
          body       = Switchboard.getElementsByClassName('body', document.body, 'div')[0],
          textInputs = Switchboard.getElementsByClassName('text-form', body, 'form'),
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

      updateTemplate = function(state) {
        var node        = document.getElementById(state.deviceId),
            parser      = Switchboard.parsers[state.typeClass],
            value       = state.value,
            deviceState = state.state,
            selected,
            markup,
            oldMarkup,
            i;

        Switchboard.state[state.deviceId] = state;

        Switchboard.log(state.deviceId + ' updated');

        if(node) {
          markup    = templates[state.typeClass].markup;
          selected  = Switchboard.hasClass(node, 'selected') ? ' selected' : '';
          oldMarkup = node.outerHTML;

          if(parser) {
            markup = parser(state.deviceId, markup, deviceState, value, templates[state.typeClass].fragments);
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

          if(markup !== oldMarkup) {
            node.outerHTML = markup;
          }
        }
      };

      buildIndicator = function (type) {
        var reconnect = true;

        if(!document.getElementById('indicator')) {
          indicator = document.createElement('span');
          indicator.id = 'indicator';
          Switchboard.addClass(indicator, 'connecting');
          Switchboard.putText(indicator, 'Connecting');

          header.appendChild(indicator);

          reconnect = false;
        }

        return reconnect;
      };

      socketConnect = function () {
        var reconnect = buildIndicator();

        Switchboard.log('Connecting to WebSocket');

        socket = new WebSocket('ws://' + window.location.host, 'echo-protocol');

        Switchboard.event.add(socket, 'open', function(e) {
          indicator.className = 'connected';
          Switchboard.putText(indicator, 'Connected');

          socket.send('fetch state');

          if(reconnect) {
            Switchboard.log('Reconnected to WebSocket');
          }
        });

        Switchboard.event.add(socket, 'close', function(e) {
          indicator.className = 'disconnected';
          Switchboard.putText(indicator, 'Disconnected');
        });

        Switchboard.event.add(socket, 'message', function(e) {
          var message = Switchboard.decode(e.data),
              device  = {},
              notification;

          if(typeof message.title === 'string') {
            if(typeof Notification === 'function') {
              notification = new Notification(message.title, message.options);

              setTimeout(function() {
                notification.close();
              }, 10000);

              Switchboard.event.add(notification, 'click', function(e) {
                var newContent,
                    selectNav,
                    selectContent;

                window.focus();

                if(message.deviceId) {
                  newContent    = document.getElementById(message.deviceId);
                  selectNav     = Switchboard.getElementsByClassName('selected', header, 'li')[0];
                  selectContent = Switchboard.getElementsByClassName('selected', body, 'div')[0];

                  Switchboard.removeClass(selectNav,     'selected');
                  Switchboard.removeClass(selectContent, 'selected');

                  lazyLoad(message.deviceId);

                  Switchboard.addClass(Switchboard.getElementsByClassName(message.deviceId, header, 'li')[0], 'selected');
                  Switchboard.addClass(newContent, 'selected');

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
              Switchboard.log('Received latest State');

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
        var state = indicator && Switchboard.hasClass(indicator, 'connected');

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
        Switchboard.log('WebSockets not supported - using polling');

        buildIndicator();

        (function() {
          var ajaxRequest;

          // XHR, grab templates on init.
          ajaxRequest = {
            path   : '/templates/',
            param  : 'ts=' + new Date().getTime(),
            method : 'GET',
            onComplete : function () {
              templates = Switchboard.decode(ajaxRequest.response);
            }
          };

          Switchboard.ajax.request(ajaxRequest);

          // Set up our poller to continually grab device State.
          setInterval(function() {
            var pollRequest = {
              path   : '/state/',
              param  : 'ts=' + new Date().getTime(),
              method : 'GET',
              onComplete : function () {
                var state = Switchboard.decode(pollRequest.response),
                    device;

                if(state) {
                  indicator.className = 'connected';

                  setTimeout(function() {
                    indicator.className = 'connecting';
                  }, 1000);

                  for(device in state) {
                    updateTemplate(state[device]);
                  }
                }

                else {
                  indicator.className = 'disconnected';
                }
              }
            };

            Switchboard.ajax.request(pollRequest);
          }, 10000);
        })();
      }

      /* Lazyload of images */
      lazyLoad = function(id) {
        var container,
            images,
            i = 0;

        if(document.getElementById(id)) {
          container = document.getElementById(id);

          images = container.getElementsByTagName('img');

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
          images = elm.getElementsByTagName('img');

          for(i = 0; i < images.length; i += 1) {
            if((images[i].getAttribute('src')) && (Switchboard.hasClass(images[i], 'streaming'))) {
              images[i].setAttribute('data-src', images[i].src);
              images[i].removeAttribute('src');
            }
          }
        }
      };

      lazyLoad(document.body.className);

      /* Clicking of navigation items */
      Switchboard.event.add(header, 'click', function(e) {
        var elm           = Switchboard.getTarget(e).parentNode,
            tagName       = elm.tagName.toLowerCase(),
            newContent    = document.getElementById(elm.className),
            selectNav     = Switchboard.getElementsByClassName('selected', header, 'li')[0],
            selectContent = Switchboard.getElementsByClassName('selected', body, 'div')[0];

        if(tagName === 'li') {
          e.preventDefault();

          if(elm !== selectNav) {
            Switchboard.removeClass(selectNav,     'selected');
            Switchboard.removeClass(selectContent, 'selected');

            lazyLoad(elm.className);

            Switchboard.addClass(elm, 'selected');
            Switchboard.addClass(newContent, 'selected');

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

        else if(Switchboard.getTarget(e).id === 'indicator') {
          if(Switchboard.hasClass(Switchboard.getTarget(e), 'disconnected')) {
            socketConnect();
          }
        }
      });

      /* Typical command executions */
      Switchboard.event.add(body, 'click', function(e) {
        var elm     = Switchboard.getTarget(e),
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
                Switchboard.log(ajaxRequest.response);
              }
            };

            Switchboard.ajax.request(ajaxRequest);
          }
        }
      });

      /* Form submissions - such as text */
      Switchboard.event.add(body, 'submit', function(e) {
        var elm  = Switchboard.getTarget(e),
            ts   = new Date().getTime(),
            text = '',
            type = '',
            device,
            ajaxRequest;

        e.preventDefault();

        text   = Switchboard.getElementsByClassName('text-input', elm, 'input')[0].value;
        device = Switchboard.getElementsByClassName('text-input', elm, 'input')[0].name;
        type   = Switchboard.getElementsByClassName('input-type', elm, 'input')[0].value;

        if(socket) {
          if(checkConnection()) {
            socket.send('/?' + device + '=' + type + '-' + text);
          }
        }

        else {
          ajaxRequest = {
            path       : '/',
            param      : device + '=' + text,
            method     : 'POST',
            onComplete : function () {
              Switchboard.log(ajaxRequest.response);
            }
          };

          Switchboard.ajax.request(ajaxRequest);
        }
      });

      Switchboard.addClass(document.body, 'rich');

      if (typeof(init) === 'function') {
        init();
      }
    }
  };
} ());

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
