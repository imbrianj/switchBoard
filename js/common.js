/*global document, window, ActiveXObject, XMLHttpRequest, SB, Notification, SpeechSynthesisUtterance, webkitSpeechRecognition */
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

SB = (function () {
  'use strict';

  return {
    version : 20141226,

   /**
    * Stops event bubbling further.
    *
    * @param {Event} e Event to prevent from bubbling further.
    */
    cancelBubble : function (e) {
      e = e || window.event;

      e.cancelBubble = true;

      if (e.stopPropagation) {
        e.stopPropagation();
      }
    },

   /**
    * Determines if an element is an ancestor to another element.
    *
    * @param {Object} child DOM element to check if it is an ancestor of the
    *         ancestor element passed.
    * @param {Object} ancestor DOM element of potential ancestor node to the
    *         child element passed.
    * @return {Boolean} true if the child is an ancestor of the ancestor
    *          element passed - false, otherwise.
    */
    isChildOf : function (child, ancestor) {
      if (ancestor === child) {
        return false;
      }

      while (child && (child !== ancestor) && (child !== document.body)) {
        child = child.parentNode;
      }

      return child === ancestor;
    },

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
      * @note All events are added to the SB.event.list array for access outside
      *        this function.
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

        SB.event.list.push([elm, event, action]);
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
      * @note Automatically removes the event from the SB.event.list array
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

        for (i; i < SB.event.list.length; i += 1) {
          if (SB.event.list[i]) {
            if ((SB.event.list[i]) &&
                (SB.event.list[i][0] === elm) &&
                (SB.event.list[i][1] === event) &&
                (SB.event.list[i][2] === action)) {
              SB.event.list.splice(i, 1);

              break;
            }
          }
        }
      },

     /**
      * Loops through all registered events (referencing the
      *  SB.event.list array) and removes all events.  This should only be
      *  executed onunload to prevent documented IE6 memory leaks.
      */
      removeAll : function (elm) {
        elm = elm || document;

        var i = SB.event.list.length - 1;

        for (i; i >= 0; i -= 1) {
          if (SB.event.list[i]) {
            if ((SB.event.list[i][0] === elm) || (elm === document)) {
              SB.event.remove(SB.event.list[i][0], SB.event.list[i][1], SB.event.list[i][2]);
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
      var hasClass = false;

      if((elm) && (elm.className)) {
        hasClass = SB.hasAttribute(elm, 'className', className) ? true : false;
      }

      return hasClass;
    },

   /**
    * Add the specified class to the given element - but only if it does not
    *  already have the class.
    *
    * @param {Object} elm Element to apply the given class to.
    * @param {String} className Class name to be applied.
    */
    addClass : function (elm, className) {
      if((elm) && (className)) {
        if (!SB.hasClass(elm, className)) {
          elm.className = SB.trim(elm.className + ' ' + className);
        }
      }
    },

   /**
    * Removes the specified class from the given element.
    *
    * @param {Object} elm Element to remove the given class from.
    * @param {String} className Class name to be removed.
    */
    removeClass : function (elm, className) {
      if (SB.hasClass(elm, className)) {
        elm.className = elm.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ');
        elm.className = SB.trim(elm.className);
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
      if (!SB.hasClass(elm, className)) {
        SB.addClass(elm, className);
      }

      else {
        SB.removeClass(elm, className);
      }
    },

   /**
    * Sugar function used to set the passed element to the currently focused
    * element.
    *
    * @param {Object} elm Element to be focused.
    */
    setFocus : function (elm) {
      if(typeof elm.setActive === 'function') {
        elm.setActive();
      }

      else if(typeof elm.focus === 'function') {
        elm.focus();
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
        children = SB.getByTag(tag, parent);

        for (i in children) {
          if (SB.hasClass(children[i], className)) {
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
    * Sugar function to remove units of measure from a given string.
    *
    * @param {String} property Measurement property to have it's units removed.
    * @return {Integer} Integer value of measurement entered - but without
    *          units of measure.
    */
    stripUnits : function (property) {
      var value = '';

      if (typeof property === 'string') {
        value = parseInt(property.replace(new RegExp('(%|px|em)'), ''), 10);
      }

      else {
        value = property;
      }

      return value;
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
     * Log messages.  If you pass a source and type (success, info or error),
     * it will print to console with pretty colors.
     *
     * @param {String|Object} message Message to be printed to console log.
     * @param {String} source Source of the log - a device or function worth
     *         noting.
     * @param {String} type Type of message to log - defines the color of the
     *         text.  Can be "success", "info" or "error".
     */
    log : function (message, source, type) {
      var now   = new Date(),
          color = 'color: white';

      if((typeof console === 'object') && (typeof console.log === 'function')) {
        if((source) && (typeof message !== 'object')) {
          message = '%c' + source + '%c: ' + message + ' (' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ')';

          switch(type) {
            case 'success' :
              color = 'color: green';
            break;

            case 'info' :
              color = 'color: aqua';
            break;

            case 'error' :
              color = 'color: red';
            break;
          }

          console.log(message, 'background: black; ' + color, 'background: black; color: white');
        }

        else {
          console.log(message);
        }
      }
    },

    /**
     * Stupid wrapper to ensure navigator.vibrate exists before using it.
     *
     * @param {Int} duration Number of milliseconds to vibrate.
     */
    vibrate : function (duration) {
      duration = duration || 20;

      if((window.navigator) && (window.navigator.vibrate)) {
        window.navigator.vibrate(duration);
      }

      else {
        SB.log('Not supported', 'Vibrate', 'error');
      }
    },

    /**
     * Stupid wrapper to ensure Notification exists before using it.  If it does
     * exist, but it doesn't look like you've granted permission, we'll try to
     * get permission.  As permission can only be asked from a user action,
     * we'll break it into a separate method so we can call it directly as well.
     *
     * @param {String} string Phrase you'd like popped up in a notification box.
     * @param {Object} options
     */
    notify : function (string, options, callback) {
      var notification,
          click;

      if(typeof Notification === 'function') {
        if(Notification.permission === 'granted') {
          notification = new Notification(string, options);

          setTimeout(function() {
            notification.close();
            SB.event.remove(notification, 'click', click);
          }, 10000);

          click = function(e) {
            window.focus();
            callback(e);
            SB.event.remove(notification, 'click', click);
          };

          SB.event.add(notification, 'click', click);
        }

        else {
          SB.notifyAsk();
        }
      }

      return notification;
    },

    /**
     * Stupid wrapper to ensure Notification exists before using it.  If it does
     * exist, but it doesn't look like you've granted permission, we'll try to
     * get permission.  As permission can only be asked from a user action,
     * we'll break it into a separate method so we can call it directly as well.
     * If you've explicitly denied permission, we'll honor that and not ask.
     */
    notifyAsk : function () {
      if(typeof Notification === 'function') {
        if(Notification.permission !== 'denied') {
          Notification.requestPermission(function(permission) {
            if(Notification.permission !== permission) {
              Notification.permission = permission;
            }
          });
        }
      }
    },

    /**
     * Stupid wrapper to ensure your browser supports text to speech before
     * using it.
     *
     * @param {String} string Phrase you'd like read aloud on the client.
     * @param {String} lang Language code text is formatted in.
     */
    speak : function (string, lang, voice) {
      var message,
          voices;

      if(window.speechSynthesis) {
        message       = new SpeechSynthesisUtterance();
        voices        = window.speechSynthesis.getVoices();
        message.text  = string;
        message.lang  = lang  || 'en-US';

        // iOS / OSX support more unique voices
        if((voices) && (voices[10]) && (voices[10].name === 'Alex')) {
          message.voice = voices[10];

          if(voice === 'female') {
            message.voice = voices[30];
          }
        }

        // Some platforms support only the system default.
        window.speechSynthesis.speak(message);
      }

      else {
        SB.log('Not supported', 'Speak', 'error');
      }
    },

    /**
     * Stupid wrapper to ensure your browser supports speech to text before
     * using it.
     *
     * @param {Function} callback Callback function that will accept the
     *         transcribed text and the confidence percentage.
     */
    transcribe : function (callback) {
      var transcribe,
          process;

      if ('webkitSpeechRecognition' in window) {
        SB.log('Supported', 'Transcribe', 'info');

        transcribe = new webkitSpeechRecognition();

        process = function(e) {
          callback(e.results[0][0].transcript, e.results[0][0].confidence);

          SB.event.remove(document, 'result', process);
        };

        SB.event.add(transcribe, 'result', process);
      }

      else {
        SB.log('Not supported', 'Transcribe', 'error');
      }

      return transcribe;
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
                SB.putText(ajaxRequest.onComplete, ajaxRequest.response);
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

        SB.event.add(request, 'readystatechange', function () {
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
    * Finds the current mouse position.
    *
    * @param {Event} e Mouse event.
    * @return {Object} position Object containing:
    *          {Integer} positionX Mouse offset on X-axis.
    *          {Integer} positionY Mouse offset on Y-axis.
    */
    findMousePosition : function (e) {
      var position;

      if (e.touches && e.touches.length) {
        position = {
          positionX: e.touches[0].clientX,
          positionY: e.touches[0].clientY
        };
      }

      else if (window.event) {
        position = {
          positionX: window.event.clientX,
          positionY: window.event.clientY
        };
      }

      else {
        position = {
          positionX: e.clientX,
          positionY: e.clientY
        };
      }

      return position;
    },

   /**
    * Finds the computed value of a given CSS property.
    *
    * @param {Object} elm Element containing a CSS property.
    * @param {String} property CSS property of the element to be found.
    * @return {String} Computed CSS property value of the given element and
    *          property type.
    */
    findStyle : function (elm, property) {
      var styleValue = '';

      if (elm.currentStyle) {
        property = property.replace(/-\w/g, function (match) {
          return match.charAt(1).toUpperCase();
        });

        styleValue = elm.currentStyle[property];
      }

      else if (window.getComputedStyle) {
        styleValue = document.defaultView.getComputedStyle(elm, null).getPropertyValue(property);
      }

      else {
        return 0;
      }

      if (styleValue) {
        if ((styleValue.indexOf('px') !== -1) ||
            (styleValue.indexOf('em') !== -1) ||
            (styleValue.indexOf('%')  !== -1)) {
          styleValue = SB.stripUnits(styleValue);
        }

        if (property === 'opacity') {
          styleValue = parseFloat(styleValue, 10);
        }
      }

      return styleValue;
    },

   /**
    * Finds where on the page the user has scrolled.
    *
    * @return {Object} Object containing:
    *          {Integer} Pixel offset from the top of the page to the top of
    *           the user's scrolled viewport.
    *          {Integer} Pixel offset from the left edge of the user's scrolled
    *           viewport.
    */
    findScroll : function () {
      var position = 0;

      if (typeof(window.pageYOffset) === 'number') {
        position = {
          positionX: window.pageXOffset,
          positionY: window.pageYOffset
        };
      }

      else if ((document.body) && (document.body.scrollTop)) {
        position = {
          positionX: document.body.scrollWidth,
          positionY: document.body.scrollTop
        };
      }

      else if ((document.documentElement) && (document.documentElement.scrollTop)) {
        position = {
          positionX: document.documentElement.scrollWidth,
          positionY: document.documentElement.scrollTop
        };
      }

      return position;
    },

   /**
    * Creates a dragable element with optional drop points.
    *
    * @param {Object} drag Object containing:
    *         {Object} elm Element to be movable.
    *         {Object} dragElm Element that will act as the drag focus.  If
    *          none is specified, it will default to drag.elm.
    *         {Boolean} restrict true if the element should be restricted to
    *          movement only within it's direct parent.
    *         {Function} onStart Function to be executed when the element first
    *          gets clicked.
    *         {Function} onTween Function to be executed after each step in the
    *          element's movement.
    *         {Function} onComplete Function to be executed after the element
    *          is done moving (mouseup).
    */
    clickDrag : function (drag) {
      drag.dragElm    = drag.dragElm    || drag.elm;
      drag.restrict   = drag.restrict   || false;
      drag.onStart    = drag.onStart    || function () {};
      drag.onTween    = drag.onTween    || function () {};
      drag.onComplete = drag.onComplete || function () {};

      var mover,
          dropper,
          start = (document.body.ontouchstart === undefined) ? 'mousedown' : 'touchstart',
          move  = (document.body.ontouchmove  === undefined) ? 'mousemove' : 'touchmove',
          end   = (document.body.ontouchend   === undefined) ? 'mouseup'   : 'touchend',
          wrapperBorderOffsetX = SB.findStyle(drag.elm.parentNode, 'border-left-width') + SB.findStyle(drag.elm.parentNode, 'border-right-width'),
          wrapperBorderOffsetY = SB.findStyle(drag.elm.parentNode, 'border-top-width')  + SB.findStyle(drag.elm.parentNode, 'border-bottom-width');

      mover = function (e) {
        if (SB.hasClass(drag.elm, 'active')) {
          SB.cancelBubble(e);

          if (e.preventDefault) {
            e.preventDefault();
          }

          var position  = SB.findMousePosition(e),
              positionX = position.positionX,
              positionY = position.positionY,
              width     = drag.dragElm.offsetWidth,
              height    = drag.dragElm.offsetHeight,
              endX,
              endY;

          drag.newX = positionX - drag.clickOffsetX + drag.startOffsetX - (drag.startWidth  - SB.findScroll().positionX);
          drag.newY = positionY - drag.clickOffsetY + drag.startOffsetY - (drag.startHeight - SB.findScroll().positionY);

          if (drag.restrict) {
            endX = drag.elm.parentNode.offsetWidth  - width  - wrapperBorderOffsetX;
            endY = drag.elm.parentNode.offsetHeight - height - wrapperBorderOffsetY;

            if (drag.newX > endX) {
              drag.newX = endX;
            }

            if (drag.newX < 0) {
              drag.newX = 0;
            }

            if (drag.newY > endY) {
              drag.newY = endY;
            }

            if (drag.newY < 0) {
              drag.newY = 0;
            }
          }

          drag.elm.style.margin = 0;
          drag.elm.style.left   = drag.newX + 'px';
          drag.elm.style.top    = drag.newY + 'px';

          drag.onTween(drag);

          return false;
        }
      };

      dropper = function () {
        if (SB.hasClass(drag.elm, 'active')) {
          SB.removeClass(drag.elm, 'active');

          SB.event.remove(document, 'mousemove', mover);
          SB.event.remove(document, 'mouseup',   dropper);

          drag.onComplete(drag);
        }
      };

      SB.event.add(drag.dragElm, start, function (e) {
        var startOffset = SB.findMousePosition(e);

        SB.clickDrag.zindex = SB.clickDrag.zindex || 1;

        SB.cancelBubble(e);
        drag.clickOffsetX       = startOffset.positionX;
        drag.clickOffsetY       = startOffset.positionY;
        drag.startOffsetX       = drag.elm.offsetLeft;
        drag.startOffsetY       = drag.elm.offsetTop;
        drag.startWidth         = SB.findScroll().positionX;
        drag.startHeight        = SB.findScroll().positionY;
        drag.elm.style.zIndex   = SB.clickDrag.zindex += 1;
        drag.elm.style.margin   = 0;
        drag.elm.style.bottom   = 'auto';
        drag.elm.style.right    = 'auto';
        drag.elm.style.position = 'absolute';
        SB.addClass(drag.elm, 'active');

        drag.onStart();

        if (e.preventDefault) {
          e.preventDefault();
        }

        SB.event.add(document, move, mover);
        SB.event.add(document, end,  dropper);

        mover(e);
      });
    },

   /**
    * Initialization for SB.  Executes the standard functions used.
    */
    init : function () {
      if((SB.spec) && (SB.spec.init)) {
        SB.spec.init();
      }

      SB.addClass(document.body, 'rich');
    }
  };
}());

if(document.addEventListener) {
  document.addEventListener('DOMContentLoaded', SB.init, false);
}

SB.event.add(window, 'load', function () {
  'use strict';

  if(!document.addEventListener) {
    SB.init();
  }
});

SB.event.add(window, 'unload', function () {
  'use strict';

  SB.event.removeAll();
});
