/**!
 * # myJS - Simple JavaScript library for the purists
 *
 * @author Branko Vukelic <branko@brankovukelic.com>
 * @license MIT
 */
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.my = factory();
  }
}(this, function () {
  'use strict';

  var d = window.document;

  var my = {
    undef: function (v) { return typeof v == 'undefined'; },

    hasAll: function(v) { 
      var i = v.length;
      for (; l--;) {
        if (undef(v[i])) { return false; }
      }
      return true;
    },

    matchObj: function(obj1, obj2, keys) {
      keys = keys || Object.keys(obj1);
      return keys.every(function(k) {
        return obj1[k] === obj2[k];
      });
    },

    addMissing: function(arr1, arr2) {
      arr2.forEach(function(item) {
        if (arr1.indexOf(item) === -1) {
          arr1.push(item);
        }
      });
    },

    removeAll: function(arr1, arr2) {
      return arr1.filter(function(item) {
        return arr2.indexOf(item) === -1;
      });
    },

    definedKeys: function(obj) {
      var keys = [];
      return Object.keys(obj).filter(function(k) {
        return !my.undef(obj[k]);
      });
    },

    /**
     * ## `EVENT_CTORS`
     *
     * Mapping between navite events and event object constructors. This object
     * is used by the `fire()` function to determine the constructor it needs
     * to use for a given event name.
     */
    EVENT_CTORS: {
      blur: window.FocusEvent,
      change: window.Event,
      click: window.MouseEvent, 
      dblclick: window.MouseEvent, 
      drag: window.DragEvent,
      dragend: window.DragEvent,
      dragenter: window.DragEvent,
      dragleave: window.DragEvent,
      dragover: window.DragEvent,
      dragstart: window.DragEvent,
      drop: window.DragEvent,
      focus: window.FocusEvent,
      keydown: window.KeyboardEvent,
      keypress: window.KeyboardEvent,
      keyup: window.KeyboardEvent,
      mousedown: window.MouseEvent,
      mouseenter: window.MouseEvent,
      mouseleave: window.MouseEvent,
      mousemove: window.MouseEvent,
      mouseout: window.MouseEvent,
      mouseup: window.MouseEvent,
      resize: window.UIEvent,
      scroll: window.UIEvent,
      select: window.UIEvent,
      storage: window.StorageEvent,
      submit: window.Event,
      touchcancel: window.TouchEvent,
      touchen: window.TouchEvent,
      touchenter: window.TouchEvent, 
      touchleave: window.TouchEvent,
      touchmove: window.TouchEvent,
      touchstart: window.TouchEvent,
      unload: window.UIEvent
    },

    /**
     * ## `id(id)`
     *
     * Returns a single element with specified id attribute.
     *
     * @param {String} id - `id` attribute value
     */
    id: function (id) {
      return d.getElementById(id);
    },

    /**
     * ## `cls(class)`
     *
     * Returns a list of nodes with specified class attribute.
     *
     * @param {string} cls - `class` attribute value
     */
    cls: function (cls) {
      return d.getElementsByClassName(cls);
    },

    /**
     * ## `get(query)`
     *
     * Returns the first element matching a given query.
     *
     * @param {string} query - CSS3-compatible query
     */
    get: function (query) {
      return d.querySelector(query);
    },

    /**
     * ## `find(query)` 
     *
     * Returns a list of nodes matching the specified query.
     *
     * @param {string} query - CSS3-compatible query
     */
    find: function (query) {
      return d.querySelectorAll(query);
    },

    /**
     * ## `on([obj], evt, fn, [capture])`
     *
     * Adds an event listener function `fn` for event `evt`. The event target 
     * can be specified using the `obj` argument, which defaults to
     * `window.document`.
     *
     * @param {object} obj - Event target
     * @param {string} evt - Event name
     * @param {function} fn - Callback function
     * @param {boolean} capture - Whether to initiate capture
     */
    on: function (obj, evt, fn, capture) {
      if (typeof obj == 'string') {
        capture = fn;
        fn = evt;
        evt = obj;
        obj = d;
      }
      if (my.undef(capture)) { capture = false; }
      obj.addEventListener(evt, fn, capture);
      obj.eventListeners = obj.eventListeners || [];
      obj.eventListeners.push({
        evt: evt,
        fn: fn,
        capture: capture
      });
      return obj;
    },

    /**
     * ## `fire([obj], evt, [data, Ctor])`
     *
     * Fires an event named `evt`, with `data`. The `obj` is event target, and
     * defaults to `window.document`. The `ctor` is event constructor.
     * Constructor will be derived automatically based on event name if none 
     * is specified and will fall back to `window.Event` constructor.
     *
     * @param {object} obj - Event target
     * @param {string} evt - Event name
     * @param {object} data - Event data
     * @param {function} Ctor - Event object constructor
     */
    fire: function (obj, evt, data, Ctor) {
      var e;
      if (typeof obj == 'string') { 
        ctor = data;
        data = evt;
        evt = obj;
        obj = d;
      }
      if (typeof data == 'function') {
        ctor = data;
        data = undefined;
      }
      Ctor = Ctor || my.EVENT_CTORS[evt] || window.Event;
      obj = obj || d;
      e = new Ctor(evt, data);
      obj.dispatchEvent(e);
      return e;
    },

    /**
     * ## `off([obj, evt, fn, capture])`
     *
     * Remove an event listener `fn` for the event `evt` from an object `obj`.
     * The `obj` argument defaults to `window.document`.
     *
     * @param {object} obj - Event target
     * @param {string} evt - Event name
     * @param {function} fn - Event handler
     * @param {boolean} capture - Whether capture was used to attach the
     * handler
     */
    off: function (obj, evt, fn, capture) { 
      if (typeof obj == 'string') {
        capture = fn;
        fn = evt;
        evt = obj;
        obj = d;
      }
      if (typeof evt == 'boolean') {
        capture = evt;
        fn = undefined;
        evt = undefined;
      }
      if (typeof evt == 'function') {
        capture = fn;
        fn = evt;
        evt = undefined;
      }
      if (typeof fn == 'boolean') {
        capture = fn;
        fn = undefined;
      }
      obj = obj || d;

      if (!obj.eventListeners) { 
        obj.removeEventListener(evt, fn, capture);
        return;
      }

      var signature = {evt: evt, fn: fn, capture: capture};
      var definedKeys = my.definedKeys(signature);
      var match = my.matchObj;

      obj.eventListeners = obj.eventListeners.filter(function(l) {
        if (match(signature, l, definedKeys)) {
          obj.removeEventListener(l.evt, l.fn, l.capture);
          return false;
        }
        return true;
      });
    },

    /**
     * ## `classes(obj, [class, ...])`
     *
     * Return class names of a node `obj` as an array. If class names are
     * passed after the `obj` arguments, classes are assigned before returning.
     *
     * @param {object} obj - DOM node
     * @param {string} class - One or more class names
     */
    class: function() {
      var obj = arguments[0];
      var cls = obj.className;
      var classes = [].slice.call(arguments, 1);
      var existingClasses = cls.length ? cls.split(' ') : [];
      if (classes.length) {
        my.addMissing(existingClasses, classes);
        obj.className = existingClasses.join(' ');
      }
      return existingClasses;
    },

    /**
     * ## `removeClass(obj, [class, ...])`
     *
     * Removes one or more class names from DOM node `obj`. If no classes are
     * passed, all classes are removed.
     *
     * @param {object} obj - DOM node
     * @param {string} class - One or more class names
     */
    removeClass: function() {
      var obj = arguments[0];
      var classes = [].slice.call(arguments, 1);
      var existingClasses = obj.className.split(' ');
      if (!existingClasses.length) { return; }
      if (!classes.length) { 
        obj.className = ''; 
      } else {
        obj.className = my.removeAll(existingClasses, classes).join(' ');
      }
    }
  };

  return my;
}));
