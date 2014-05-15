/*global document, window, ActiveXObject, init, console, XMLHttpRequest, Bevey*/
/*jslint white: true */
/*jshint -W020 */

Bevey = (function () {
  'use strict';

  return {
    version : 20140504,

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
      * @note All events are added to the Bevey.event.list array for access
      *        outside this function.
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

        Bevey.event.list.push([elm, event, action]);
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
      * @note Automatically removes the event from the Bevey.event.list array.
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

        for (i; i < Bevey.event.list.length; i += 1) {
          if (Bevey.event.list[i]) {
            if ((Bevey.event.list[i]) &&
                (Bevey.event.list[i][0] === elm) &&
                (Bevey.event.list[i][1] === event) &&
                (Bevey.event.list[i][2] === action)) {
              Bevey.event.list.splice(i, 1);

              break;
            }
          }
        }
      },

     /**
      * Loops through all registered events (referencing the Bevey.event.list
      *  array) and removes all events.  This should only be executed onunload
      *  to prevent documented IE6 memory leaks.
      */
      removeAll : function (elm) {
        elm = elm || document;

        var i = Bevey.event.list.length - 1;

        for (i; i >= 0 ; i -= 1) {
          if (Bevey.event.list[i]) {
            if ((Bevey.event.list[i]) && ((Bevey.event.list[i][0] === elm) || (elm === document))) {
              Bevey.event.remove(Bevey.event.list[i][0], Bevey.event.list[i][1], Bevey.event.list[i][2]);
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
        return elm[attribute].match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
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
      return Bevey.hasAttribute(elm, 'className', className);
    },

   /**
    * Add the specified class to the given element - but only if it does not
    *  already have the class.
    *
    * @param {Object} elm Element to apply the given class to.
    * @param {String} className Class name to be applied.
    */
    addClass : function (elm, className) {
      if (!Bevey.hasClass(elm, className)) {
        elm.className = Bevey.trim(elm.className + ' ' + className);
      }
    },

   /**
    * Removes the specified class from the given element.
    *
    * @param {Object} elm Element to remove the given class from.
    * @param {String} className Class name to be removed.
    */
    removeClass : function (elm, className) {
      if (Bevey.hasClass(elm, className)) {
        elm.className = elm.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ');
        elm.className = Bevey.trim(elm.className);
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
      if (!Bevey.hasClass(elm, className)) {
        Bevey.addClass(elm, className);
      }

      else {
        Bevey.removeClass(elm, className);
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
          if (Bevey.hasClass(children[i], className)) {
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
              Bevey.putText(ajaxRequest.onComplete, ajaxRequest.response);
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

        request.setRequestHeader('AJAX', 'true');

        Bevey.event.add(request, 'readystatechange', function () {
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
    * Initialization for Bevey.  Executes the standard functions used.  If a
    *  global function of "init" is available, it will also be executed.
    */
    init : function () {
      var header     = Bevey.getElementsByClassName('header', document.body, 'div')[0],
          body       = Bevey.getElementsByClassName('body', document.body, 'div')[0],
          textInputs = Bevey.getElementsByClassName('text-form', body, 'form'),
          runText,
          lazyLoad,
          i;

      runText = function(e) {
        var elm  = Bevey.getTarget(e),
            ts   = new Date().getTime(),
            text = '',
            device,
            ajaxRequest;

        e.preventDefault();

        text   = Bevey.getElementsByClassName('text-input', elm, 'input')[0].value;
        device = Bevey.getElementsByClassName('text-input', elm, 'input')[0].name;

        ajaxRequest = {
          path       : '/',
          param      : device + '=' + text,
          method     : 'POST',
          onComplete : function () {
            console.log(ajaxRequest.response);
          }
        };

        Bevey.ajax.request(ajaxRequest);
      };

      lazyLoad = function(id) {
        var container,
            images,
            i = 0;

        if(document.getElementById(id)) {
          container = document.getElementById(id);

          images = container.getElementsByTagName('img');

          for(i = 0; i < images.length; i += 1) {
            if(images[i].getAttribute('data-src')) {
              images[i].src = images[i].getAttribute('data-src');
              images[i].removeAttribute('data-src');
            }
          }
        }
      };

      lazyLoad(document.body.className);

      for(i = 0; i < textInputs.length; i += 1) {
        Bevey.event.add(textInputs[i], 'submit', runText);
      }

      Bevey.event.add(header, 'click', function(e) {
        var elm           = Bevey.getTarget(e).parentNode,
            tagName       = elm.tagName.toLowerCase(),
            newContent    = document.getElementById(elm.className),
            selectNav     = Bevey.getElementsByClassName('selected', header, 'li')[0],
            selectContent = Bevey.getElementsByClassName('selected', body, 'div')[0];

        if(tagName === 'li') {
          e.preventDefault();

          if(elm !== selectNav) {
            Bevey.removeClass(selectNav,     'selected');
            Bevey.removeClass(selectContent, 'selected');

            Bevey.addClass(elm, 'selected');
            Bevey.addClass(newContent, 'selected');

            lazyLoad(elm.className.replace(' selected', ''));
          }
        }
      });

      Bevey.event.add(body, 'click', function(e) {
        var elm     = Bevey.getTarget(e),
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

          ajaxRequest = {
            path   : command,
            param  : 'ts=' + ts,
            method : 'GET',
            onComplete : function () {
              console.log(ajaxRequest.response);
            }
          };

          Bevey.ajax.request(ajaxRequest);
        }
      });

      Bevey.addClass(document.body, 'rich');

      if (typeof(init) === 'function') {
        init();
      }
    }
  };
} ());

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', Bevey.init, false);
}

Bevey.event.add(window, 'load', function () {
  'use strict';
  if (!document.addEventListener) {
    Bevey.init();
  }
});

Bevey.event.add(window, 'unload', function () {
  'use strict';
  Bevey.event.removeAll();
});