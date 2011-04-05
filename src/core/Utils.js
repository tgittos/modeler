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
  Array.prototype.inspect = function() {
    var string = '[';
    var string_arrays = [];
    this.each(function(){
      if (typeof this.inspect === 'function') {
        string_arrays.push(this.inspect.call(this));
      } else { string_arrays.push(this) }
    });
    string += string_arrays.join(', ');
    return string + ']';
  };
  Array.prototype.join = function(delim) {
    var string = '';
    this.each(function(){
      string += this + delim;
    });
    return string.substr(0, string.length - 2);
  };
  
  /*
  Object.prototype.inspect = function(){
    var string = '{';
    var string_arrays = [];
    for (var prop in this) {
      var val = this[prop];
      if (typeof val.inspect === 'function') { string_arrays.push(val.inspect.call(this)); }
      else { string_arrays.push(val); }
    }
    string += string_arrays.join(', ');
    return string + '}';
  };
  */
  
  Math.degreesToRadians = function(a) {
    return Math.PI * (a / 180);
  };
  
  Matrix.prototype.make4x3 = function()
  {
    //Drop the last column in the matrix
      if (this.elements.length != 4 ||
          this.elements[0].length != 4)
          return null;

      return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
                            [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
                            [this.elements[2][0], this.elements[2][1], this.elements[2][2]],
                            [this.elements[3][0], this.elements[3][1], this.elements[3][2]]]);
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
  //Douglas Crockford's "Javascript: The Good Parts", pg 56
  //Stores a reference to the parent's function to enable
  //us to wrap it
  if (typeof Object.superior !== 'function') {
    Object.superior = function(name) {
      var that = this, method = that[name];
      return function() {
        return method.apply(that, apply);
      }
    };
  };

  window.assert = function(exp, message) {
    if (!exp) throw message || "Assert was false";
  };
  
  //requestAnimationFrame as per Google recommendation
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
      //TODO: Renable when not debugging
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