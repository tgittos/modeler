MODELER.Event = function() {
  var that = {},
  listeners = {};
  var listen = function(event, handler) {
    if (!listeners[event]) { listeners[event] = []; }
    listeners[event].push(handler);
  };
  var dispatch = function(event, payload) {
    if (listeners[event]) {
      listeners[event].each(function(){
        this.call(this, { event: event, data: payload } );
      });
    }
  };
  that.listen = listen;
  that.dispatch = dispatch;
  return that;
}();
