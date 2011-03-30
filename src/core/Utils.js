//UTILS
(function(m){
  m.Utils = m.Utils || {};
  
  // ARRAY SYNTACTIC SUGAR
  Array.prototype.contains = function(o) {
    for (var i = 0; i < this.length; i++) {
      if (m.Utils.equals(o, this[i])) {
        return true;      
      }
    }
    return false;
  };
  Array.prototype.each = function(fn) {
    for (var i = 0; i < this.length; i++) {
      fn.call(this[i], i);
    }
  };
  Array.prototype.remove = function(o) {
    for (var i = 0; i < this.length; i++) {
      if (m.Utils.equals(o, this[i])) {
        this.splice(i, 1);
        break;
      }
    }
  };
  
  Math.degreesToRadians = function(a) {
    return Math.PI * (a / 180);
  };
  
  //Douglas Crockford's "Javascript: The Good Parts", pg 24
  //Creates a new object with the same properties and methods
  //as the given object.
  if (typeof Object.new !== 'function') {
    Object.new = function (o) {
      var F = function() {};
      F.prototype = o;
      return new F();
    };
  };

  window.assert = function(exp, message) {
    if (!exp) throw message || "Assert was false";
  };
  
  //requestAnimationFrame as per Google recommendation
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
      function(callback, element) {
        //60fps
        window.setTimeout(callback, 1000 / 60);
      };
    })();
  }
  
  //Shamelessly stolen from underscore.js
  m.Utils.equals = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    // Check dates' integer values.
    if (m.Utils.isDate(a) && m.Utils.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (m.Utils.isNaN(a) && m.Utils.isNaN(b)) return false;
    // Compare regular expressions.
    if (m.Utils.isRegExp(a) && m.Utils.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = m.Utils.keys(a), bKeys = m.Utils.keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!(key in b) || !m.Utils.equals(a[key], b[key])) return false;
    return true;
  };
  m.Utils.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };
  m.Utils.isDate = function(obj) {
    return !!(obj && obj.getTime && obj.getTimezoneOffset && obj.setUTCFullYear);
  };
  m.Utils.isNaN = function(obj) {
    return obj !== obj;
  };
  m.Utils.keys = Object.keys || function(obj) {
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  };
  
})(MODELER);