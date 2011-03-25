(function(m){
  m.Debugger = function(params) {
    var force = false,
    c = null;
    
    //Constructor
    this.init = function(params) {
      force = params.force || false;
      if (!console || force) {
        //There is no console, or we don't want to use it
        //inject in a debugging div
        c = document.getElementById('debugger');
        if (!c) {
          c = document.createElement('div');
          c.setAttribute('id', 'debugger');
          document.body.appendChild(c);
        }
      }
    };
    
    //Map our functions to Firebug if it exists
    //otherwise we use the built in gimped versions
    this.log = function(msg) {
      if (!c) { console.log(msg); }
      else createEntry('debug-log', msg);
    };
    this.info = function(msg) {
      if (!c) { console.log(msg); }
      else createEntry('debug-info', msg);
    };
    this.warn = function(msg) {
      if (!c) { console.warn(msg); }
      else createEntry('debug-warn', msg);
    };
    this.error = function(msg) {
      if (!c) { console.error(msg); }
      else createEntry('debug-error', msg);
    };
    
    //Private functions
    createEntry = function(classString, msg) {
      entry = document.createElement('p');
      entry.setAttribute('class', classString);
      entry.innerHTML = msg;
      c.appendChild(entry);
    };
    this.init(params);
  };
})(MODELER);