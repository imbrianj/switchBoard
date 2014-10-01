/*global document, window, ActiveXObject, init, console, XMLHttpRequest, SB, Notification */
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
    version : 20140930,

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
      return SB.hasAttribute(elm, 'className', className) ? true : false;
    },

   /**
    * Add the specified class to the given element - but only if it does not
    *  already have the class.
    *
    * @param {Object} elm Element to apply the given class to.
    * @param {String} className Class name to be applied.
    */
    addClass : function (elm, className) {
      if (!SB.hasClass(elm, className)) {
        elm.className = SB.trim(elm.className + ' ' + className);
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
      duration = duration || 5;

      if((window.navigator) && (window.navigator.vibrate)) {
        window.navigator.vibrate(duration);
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
    * Contains non-boilerplate methods used for SwitchBoard in the context of
    * Automation.
    */
    spec : {
      state : {},

      parsers : {},

      templates : {},

      strings : {},

      socket : {},

      uiComponents : {
        header : {},
        body : {},
        indicator : {},
        templates : []
      },

     /**
      * Accepts a state object replaces the appropriate DOM className if able.
      * If content has changed, the entire node will be replaced.
      *
      * @param {Object} state State object of a changed controller.
      */
      updateTemplate : function(state) {
        var node        = SB.get(state.deviceId),
            parser      = SB.spec.parsers[state.typeClass],
            value       = state.value,
            deviceState = state.state,
            deviceHeader,
            selected,
            markup,
            innerMarkup = document.createElement('div'),
            oldMarkup,
            i;

        SB.spec.state[state.deviceId] = state;

        SB.log('Updated', state.deviceId, 'success');

        if(node) {
          markup       = SB.spec.uiComponents.templates[state.typeClass].markup;
          selected     = SB.hasClass(node, 'selected') ? ' selected' : '';
          oldMarkup    = node.cloneNode(true);
          deviceHeader = SB.getByTag('h1', oldMarkup)[0];
          oldMarkup.removeChild(deviceHeader);
          oldMarkup    = oldMarkup.innerHTML;

          if(parser) {
            markup = parser(state.deviceId, markup, deviceState, value, SB.spec.uiComponents.templates[state.typeClass].fragments);
          }

          if(deviceState === 'ok') {
            markup = markup.split('{{DEVICE_ACTIVE}}').join(SB.spec.strings.ACTIVE);

            if(SB.hasClass(node,   'device-off')) {
              SB.removeClass(node, 'device-off');
              SB.addClass(node,    'device-on');
              SB.putText(SB.getByTag('em', SB.getByTag('h1', node)[0])[0], SB.spec.strings.ACTIVE);
            }
          }

          else {
            markup = markup.split('{{DEVICE_ACTIVE}}').join(SB.spec.strings.INACTIVE);

            if(SB.hasClass(node,   'device-on')) {
              SB.removeClass(node, 'device-on');
              SB.addClass(node,    'device-off');
              SB.putText(SB.getByTag('em', SB.getByTag('h1', node)[0])[0], SB.spec.strings.INACTIVE);
            }
          }

          if((node) && (markup) && (state)) {
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
              if(SB.getByClass('sliderBar', node, 'div')[0]) {
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

        if(!SB.get('indicator')) {
          indicator = document.createElement('span');
          indicator.id = 'indicator';
          SB.addClass(indicator, 'connecting');
          SB.putText(indicator, SB.spec.strings.CONNECTING);

          SB.spec.uiComponents.indicator = indicator;
          SB.spec.uiComponents.header.appendChild(indicator);
        }
      },

      /**
       * If you have no connection indicator - or if it doesn't say we're
       * connected, we should reconnect and grab the latest State.
       */
      checkConnection : function () {
        var connected = SB.spec.uiComponents.indicator && SB.hasClass(SB.spec.uiComponents.indicator, 'connected');

        if(!connected) {
          SB.spec.socketConnect();
          connected = SB.spec.uiComponents.indicator && SB.hasClass(SB.spec.uiComponents.indicator, 'connected');
        }

        return connected;
      },

      /**
       * If you have no connection indicator - or if it doesn't say we're
       * connected, we should reconnect and grab the latest State.
       */
      socketConnect : function () {
        SB.log('Connecting', 'WebSocket', 'info');

        SB.spec.socket = new WebSocket('ws://' + window.location.host, 'echo-protocol');

        SB.event.add(SB.spec.socket, 'open', function(e) {
          var reconnect = SB.spec.uiComponents.indicator.className === 'disconnected' ? true : false;

          SB.spec.uiComponents.indicator.className = 'connected';
          SB.putText(SB.spec.uiComponents.indicator, SB.spec.strings.CONNECTED);

          SB.log('Connected', 'WebSocket', 'success');

          if(reconnect) {
            SB.spec.socket.send('fetch state');

            SB.log('Reconnected', 'WebSocket', 'success');
          }
        });

        SB.event.add(SB.spec.socket, 'close', function(e) {
          SB.spec.uiComponents.indicator.className = 'disconnected';
          SB.putText(SB.spec.uiComponents.indicator, SB.spec.strings.DISCONNECTED);

          SB.log('Disconnected', 'WebSocket', 'error');
        });

        SB.event.add(SB.spec.socket, 'message', function(e) {
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
                  selectNav     = SB.getByClass('selected', SB.spec.uiComponents.header, 'li')[0];
                  selectContent = SB.getByClass('selected', SB.spec.uiComponents.body,   'section')[0];

                  SB.removeClass(selectNav,     'selected');
                  SB.removeClass(selectContent, 'selected');

                  SB.spec.lazyLoad(message.deviceId);

                  SB.addClass(SB.getByClass(message.deviceId, SB.spec.uiComponents.header, 'li')[0], 'selected');
                  SB.addClass(newContent, 'selected');

                  SB.spec.lazyUnLoad(selectContent);
                }
              });
            }
          }

          else if(typeof message.deviceId === 'string') {
            SB.spec.updateTemplate(message);
          }

          else if(typeof message === 'object') {
            for(device in message) break;

            // State objects have specific deviceIds associated.
            if((message[device]) && (message[device].deviceId)) {
              SB.log('Received', 'State', 'success');

              for(device in message) {
                SB.spec.updateTemplate(message[device]);
              }
            }

            // Otherwise, you're grabbing the templates.
            else if((message[device]) && (message[device].markup)) {
              SB.spec.uiComponents.templates = message;
            }
          }
        });
      },

      /**
       * If WebSockets are not available, we'll do an XHR poll for current State
       * data.
       */
      statePoller : function() {
        var ajaxRequest;

        SB.log('not supported - using polling', 'WebSockets', 'error');

        // XHR, grab templates on init.
        ajaxRequest = {
          path   : '/templates/',
          param  : 'ts=' + new Date().getTime(),
          method : 'GET',
          onComplete : function () {
            SB.spec.uiComponents.templates = SB.decode(ajaxRequest.response);
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
                SB.spec.uiComponents.indicator.className = 'connected';
                SB.putText(SB.spec.uiComponents.indicator, SB.spec.strings.CONNECTED);

                setTimeout(function() {
                  SB.spec.uiComponents.indicator.className = 'connecting';
                  SB.putText(SB.spec.uiComponents.indicator, SB.spec.strings.CONNECTIG);
                }, 1000);

                for(device in state) {
                  SB.spec.updateTemplate(state[device]);
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
      lazyLoad : function(id) {
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
      },

      /**
       * As some images may be streaming (such as Foscam), we'll unload them
       * when not in view to save bandwidth.
       *
       * @param {Object} elm DOM node that we want to remove image src
       *                  attributes from.
       */
      lazyUnLoad : function(elm) {
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
      },

      /**
       * Simply find all text fields inside any controller.
       */
      findTextInputs : function() {
        return SB.spec.uiComponents.body.getElementsByTagName('input');
      },

      /**
       * Find all number input fields inside any controller.
       */
      findNumberInputs : function() {
        var textInputs   = SB.spec.findTextInputs(),
            numberInputs = [],
            i;

        for(i = 0; i < textInputs.length; i += 1) {
          if(textInputs[i].type === 'number') {
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
      findSliderPosition : function(slider, numberInput) {
        var sliderWidth,
            min,
            max,
            currentVal,
            offset = 0;

        if(numberInput) {
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
      findSliderValue : function(slider, drag) {
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
      buildSliders : function(id) {
        var numberInputs = SB.spec.findNumberInputs(),
            buildSliderBar,
            changeForm,
            i;

        buildSliderBar = function(slider, numberInput) {
          slider.style.left = SB.spec.findSliderPosition(slider, numberInput) + 'px';

          SB.clickDrag({ elm        : slider,
                         restrict   : true,
                         onTween    : function(drag) {
                           var value = SB.spec.findSliderValue(slider, drag);

                           numberInput.value = value;
                           slider.setAttribute('aria-valuenow', value);
                         },
                         onComplete : function(drag) {
                           changeForm(numberInput);
                         }
                       });
        };

        changeForm = function(elm) {
          var form = elm.parentNode,
              slider;

          if(SB.hasClass(elm.nextSibling, 'sliderBar')) {
            slider = elm.nextSibling.getElementsByTagName('span')[0];
            slider.style.left = SB.spec.findSliderPosition(slider, elm) + 'px';

            while((form !== document) && (form.tagName.toLowerCase() !== 'form')) {
              form = form.parentNode;
            }

            if(form.tagName.toLowerCase() === 'form') {
              SB.spec.sendInput(form);
            }
          }
        };

        for(i = 0; i < numberInputs.length; i += 1) {
          (function(numberInput) {
            var sliderBar,
                slider;

            if((numberInput.type === 'number') && (numberInput.min) && (numberInput.max)) {
              if((!id) || (SB.isChildOf(numberInput, SB.get(id)))) {
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

                if(id) {
                  buildSliderBar(slider, numberInput);
                }

                else {
                  SB.event.add(window, 'load', function() {
                    buildSliderBar(slider, numberInput);
                  });
                }
              }
            }
          }(numberInputs[i]));
        }

        if(!id) {
          SB.event.add(window, 'keydown', function(e) {
            var elm      = SB.getTarget(e),
                numInput = elm.parentNode.previousSibling,
                newVal   = null;

            if(SB.hasClass(elm.parentNode, 'sliderBar')) {
              if((e.keyCode === 38) || (e.keyCode === 39)) {
                newVal = parseInt(numInput.value, 10) + 1;
                newVal = newVal <= numInput.max ? newVal : numInput.max;
              }

              else if((e.keyCode === 37) || (e.keyCode === 40)) {
                newVal = parseInt(numInput.value, 10) - 1;
                newVal = newVal >= numInput.min ? newVal : numInput.min;
              }

              if((newVal) && (newVal >= numInput.min) && (newVal <= numInput.max)) {
                e.preventDefault();

                numInput.value = newVal;
              }
            }
          });

          SB.event.add(window, 'keyup', function(e) {
            var elm      = SB.getTarget(e),
                numInput = elm.parentNode.previousSibling;

            if(SB.hasClass(elm.parentNode, 'sliderBar')) {
              changeForm(numInput);
            }
          });

          SB.event.add(window, 'resize', function(e) {
            SB.spec.sliderSetWidths(numberInputs);
          });

          /* If you change the form value, we should change the slider position. */
          SB.event.add(document.body, 'change', function(e) {
            changeForm(SB.getTarget(e));
          });
        }
      },

      /**
       * Sets slider positions to the appropriate location.  Used when a form
       * value changes or if the scroll bar changes width.
       */
      sliderSetWidths : function() {
        var numberInputs = SB.spec.findNumberInputs(),
            slider,
            i;

        for(i = 0; i < numberInputs.length; i += 1) {
          if(SB.hasClass(numberInputs[i].nextSibling, 'sliderBar')) {
            slider = numberInputs[i].nextSibling.getElementsByTagName('span')[0];

            slider.style.left = SB.spec.findSliderPosition(slider, numberInputs[i]) + 'px';
          }
        }
      },

      /**
       * Builds event handler to delegate click events for standard commands.
       */
      command : function() {
        var commandIssued    = null,
            commandIteration = 0,
            commandDelay     = 750,
            tapped           = false,
            touched          = false,
            interrupt        = false,
            touchStartX      = 0,
            touchStartY      = 0,
            touchThreshold   = 5,
            findCommand      = function(e) {
              var elm      = SB.getTarget(e),
                  tagName  = elm.tagName.toLowerCase(),
                  validElm = null;

              elm = tagName === 'img'  ? elm.parentNode : elm;
              elm = tagName === 'i'    ? elm.parentNode : elm;
              elm = tagName === 'span' ? elm.parentNode : elm;

              if(elm.tagName.toLowerCase() === 'a') {
                validElm = elm;
              }

              return validElm;
            },

            fireCommand      = function(e) {
              var elm = findCommand(e);

              if((elm) && (!interrupt)) {
                if(elm.rel === 'external') {
                  window.open(elm.href, '_blank').focus();
                }

                else {
                  commandIssued = elm.href;

                  sendCommand();
                }
              }
            },
            stopCommand      = function(e) {
              commandIssued    = null;
              commandDelay     = 750;
              commandIteration = 0;
              interrupt        = true;
              tapped           = false;
              touched          = false;
              touchStartX      = 0;
              touchStartY      = 0;
            },
            sendCommand      = function() {
              var ts = new Date().getTime(),
                  ajaxRequest;

              if((commandIssued) && (!interrupt)) {
                SB.vibrate();

                if(SB.spec.socket) {
                  if(SB.spec.checkConnection()) {
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

                if(commandIteration > 3) {
                  commandDelay = 650;
                }

                if(commandIteration > 10) {
                  commandDelay = 500;
                }

                commandIteration += 1;

                setTimeout(sendCommand, commandDelay);
              }
            };

        if('ontouchstart' in document.documentElement) {
          SB.log('Enabled', 'Touch Events', 'info');

          SB.event.add(SB.spec.uiComponents.body, 'touchstart', function(e) {
            // For quick taps of commands, we need to set a flag.
            tapped  = true;
            touched = true;

            if(findCommand(e)) {
              interrupt   = false;
              touchStartX = parseInt(e.changedTouches[0].clientX, 10);
              touchStartY = parseInt(e.changedTouches[0].clientY, 10);

              // Wait 100ms to determine if you're scrolling.
              setTimeout(function() {
                // And unset that flag so we know not to run this again on
                // touchend.
                tapped = false;

                fireCommand(e);
              }, 150);
            }
          });

          SB.event.add(SB.spec.uiComponents.body, 'contextmenu', function(e) {
            e.preventDefault();
          });

          SB.event.add(SB.spec.uiComponents.body, 'touchend', function(e) {
            // If you've only quickly tapped a command, we don't need to wait.
            if(tapped) {
              fireCommand(e);
            }

            stopCommand(e);
          });

          SB.event.add(SB.spec.uiComponents.body, 'touchmove', function(e) {
            if((Math.abs(parseInt(e.changedTouches[0].clientX, 10) - touchStartX) > touchThreshold) || (Math.abs(parseInt(e.changedTouches[0].clientY, 10) - touchStartY) > touchThreshold)) {
              stopCommand(e);
            }
          });

          SB.event.add(SB.spec.uiComponents.body, 'touchcancel', function(e) {
            stopCommand(e);
          });
        }

        SB.event.add(SB.spec.uiComponents.body, 'mousedown', function(e) {
          if(touched === false) {
            interrupt = false;
            fireCommand(e);
          }
        });

        SB.event.add(SB.spec.uiComponents.body, 'mouseup', function(e) {
          stopCommand(e);
        });

        SB.event.add(SB.spec.uiComponents.body, 'click', function(e) {
          e.preventDefault();
        });
      },

      /*
       * Handles text and number input execution.  If you support WebSockets and
       * have an active connection, we'll use that.  If not, we'll use XHR.
       */
      sendInput : function(elm) {
        var ts   = new Date().getTime(),
            text = '',
            type = '',
            device,
            ajaxRequest;

        text   = SB.getByTag('input', elm, 'input')[0].value;
        device = SB.getByTag('input', elm, 'input')[0].name;
        type   = SB.getByClass('input-type', elm, 'input')[0].value;

        if(SB.spec.socket) {
          if(SB.spec.checkConnection()) {
            SB.spec.socket.send('/?' + device + '=' + type + '-' + text);
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
      },

      /**
       * Builds event handler to delegate form submission events for text and
       * number inputs.
       */
      formInput : function() {
        SB.event.add(SB.spec.uiComponents.body, 'submit', function(e) {
          var elm = SB.getTarget(e);

          e.preventDefault();

          SB.spec.sendInput(elm);
        });
      },

      /**
       * Handles navigation changes and changes to the connection indicator.
       */
      nav : function() {
        SB.event.add(SB.spec.uiComponents.header, 'click', function(e) {
          var elm           = SB.getTarget(e).parentNode,
              tagName       = elm.tagName.toLowerCase(),
              newContent    = SB.get(elm.className),
              selectNav     = SB.getByClass('selected', SB.spec.uiComponents.header, 'li')[0],
              selectContent = SB.getByClass('selected', SB.spec.uiComponents.body,   'section')[0],
              slider;

          if(tagName === 'li') {
            e.preventDefault();

            if(elm !== selectNav) {
              SB.removeClass(selectNav,     'selected');
              SB.removeClass(selectContent, 'selected');

              SB.vibrate();

              SB.spec.lazyLoad(elm.className);

              SB.addClass(elm,        'selected');
              SB.addClass(newContent, 'selected');

              SB.spec.sliderSetWidths();

              SB.spec.lazyUnLoad(selectContent);
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
            if(SB.hasClass(SB.getTarget(e), 'disconnected')) {
              SB.spec.socketConnect();
            }
          }
        });
      }
    },

   /**
    * Initialization for SB.  Executes the standard functions used.
    *  If a global function of "init" is available, it will also be executed.
    */
    init : function () {
      var headerData,
          bodyData;

      SB.spec.uiComponents.header = SB.getByTag('header')[0];
      SB.spec.uiComponents.body   = SB.getByTag('main')[0];
      SB.spec.buildIndicator();

      headerData = SB.spec.uiComponents.header.dataset;
      bodyData   = SB.spec.uiComponents.body.dataset;

      SB.spec.strings = { CONNECTED    : headerData.stringConnected,
                          CONNECTING   : headerData.stringConnecting,
                          DISCONNECTED : headerData.stringDisconnected,
                          ACTIVE       : bodyData.stringActive,
                          INACTIVE     : bodyData.stringInactive,
                          ON           : bodyData.stringOn,
                          OFF          : bodyData.stringOff };

      /* If we support WebSockets, we'll grab updates as they happen */
      if((typeof WebSocket === 'function') || (typeof WebSocket === 'object')) {
        SB.spec.socketConnect();
      }

      /* Otherwise, we'll poll for updates */
      else {
        SB.spec.statePoller();
      }

      SB.spec.lazyLoad(document.body.className);

      SB.spec.buildSliders();
      SB.spec.command();
      SB.spec.formInput();
      SB.spec.nav();

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
