// ARRAY SYNTACTIC SUGAR
Array.prototype.contains = function(o) {
  for (var i = 0; i < this.length; i++) {
    if (equals(o, this[i])) {
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
    if (equals(o, this[i])) {
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

Math.degreesToRadians = function(a) {
  return Math.PI * (a / 180);
};

window.assert = function(exp, message) {
  if (!exp) throw message || "Assert was false";
};

/*
window.include = function(url) {
  var element;
    switch(url.split(".").pop()){
    case "css":
      element = document.createElement("link");
      element.setAttribute("rel","stylesheet");
      element.setAttribute("type","text/css")
      element.setAttribute("href",url)
      break;
    case "js":
      element = document.createElement("script");
      element.setAttribute("language","javascript")
      element.setAttribute("src",url)
      break;
    default:
      window.console && window.console.error("could not identify", url, "skip include");
      return;
  }
  var head = document.querySelector("head");
  if (head.innerHTML.indexOf(element.outerHTML) != -1) {
    window.console && window.console.warn("Duplicate include, skipping:", url);
  } else {
    head.appendChild(element);
  }
};
*/

/*
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
*/

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

//Stuff shamelessly stolen from underscore.js
window.equals = function(a, b) {
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
  if (isDate(a) && isDate(b)) return a.getTime() === b.getTime();
  // Both are NaN?
  if (isNaN(a) && isNaN(b)) return false;
  // Compare regular expressions.
  if (isRegExp(a) && isRegExp(b))
    return a.source     === b.source &&
           a.global     === b.global &&
           a.ignoreCase === b.ignoreCase &&
           a.multiline  === b.multiline;
  // If a is not an object by this point, we can't handle it.
  if (atype !== 'object') return false;
  // Check for different array lengths before comparing contents.
  if (a.length && (a.length !== b.length)) return false;
  // Nothing else worked, deep compare the contents.
  var aKeys = keys(a), bKeys = keys(b);
  // Different object sizes?
  if (aKeys.length != bKeys.length) return false;
  // Recursive comparison of contents.
  for (var key in a) if (!(key in b) || !equals(a[key], b[key])) return false;
  return true;
};
window.isRegExp = function(obj) {
  return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
};
window.isDate = function(obj) {
  return !!(obj && obj.getTime && obj.getTimezoneOffset && obj.setUTCFullYear);
};
window.isNaN = function(obj) {
  return obj !== obj;
};
window.keys = Object.keys || function(obj) {
  var keys = [];
  for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
  return keys;
};