MODELER.Keyboard.Listener = function() {
  var that,
  listeners = [];
  
  var initialize = function(){
    document.addEventListener('keydown', dispatch, true);
  };
  var start = function(callback) {
    listeners.push(callback);
  };
  var stop = function(callback) {
    listeners.remove(callback);
  };
  var dispatch = function(e) {
    listeners.each(function(){
      this.call(this, e);
    });
  };
  
  that = {};
  initialize();
  that.start = start;
  that.stop = stop;
  return that;
}();