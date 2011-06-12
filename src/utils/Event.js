MODELER.Event = function() {
  var that = {},
  listeners = {};
  var listen = function(event, handler, expires) {
    if (!listeners[event]) { listeners[event] = []; }
    listeners[event].push({handler: handler, expires: expires});
  };
  var dispatch = function(event, payload) {
    if (listeners[event]) {
      listeners[event].each(function(){
        var handler = this.handler;
        if (this.expires) { listeners[event].remove(this); }
        handler.call(this, { event: event, data: payload } );
      });
    }
  };
  var stopListening = function(event, handler) {
    if (listeners[event]) {
      listeners[event].each(function(){
        if (this.handler == handler) { listeners[event].remove(this); }
      });
    }
  }
  var reset = function() {
    listeners = {};
  };
  that.listen = listen;
  that.dispatch = dispatch;
  that.stopListening = stopListening;
  that.reset = reset;
  return that;
}();

MODELER.EVENTS = {
  SYNCLOADER: {
    LOAD_SUCCESS: 'MODELER:EVENTS:SYNCLOADER:LOAD_SUCCESS',
    LOAD_FAILURE: 'MODELER:EVENTS:SYNCLOADER:LOAD_FAILURE'
  },
  ASYNCLOADER: {
    LOAD_SUCCESS: 'MODELER:EVENTS:ASYNCLOADER:LOAD_SUCCESS',
    LOAD_FAILURE: 'MODELER:EVENTS:ASYNCLOADER:LOAD_FAILURE'
  },
  SHADER: {
    PROGRAM_LOADED: 'MODELER:EVENTS:SHADER:PROGRAM_LOADED'
  },
  MATERIAL: {
    MATERIAL_LOADED: 'MODELER:EVENTS:MATERIAL:MATERIAL_LOADED'
  },
  TEXTURE: {
    TEXTURE_LOADED: 'MODELER:EVENTS:TEXTURE:TEXTURE_LOADED'
  },
  FILEMANAGER: {
    LOAD_SUCCESS: 'MODELER:EVENTS:FILEMANAGER:LOAD_SUCCESS',
    LOAD_FAILURE: 'MODELER:EVENTS:FILEMANAGER:LOAD_FAILURE'
  },
  // these are good for mac only (so far)
  KEYBOARD: {
    W: 87,
    A: 65,
    S: 83,
    D: 68
  }
};
