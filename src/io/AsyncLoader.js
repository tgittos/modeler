MODELER.IO.AsyncLoader = function(params, my) {
  var that, my = my || {};
  var initialize = function() {
    
  };
  var load = function(urls) {
    // urls is currently an array of urls, but we can change it to take any arbitrary object
    // as long as its got some external resources to load
    var worker = createWorker();
    worker.onmessage = workerMessageHandler;
    worker.postMessage(urls);
  };
  var createWorker = function(){
    return new Worker('../src/io/webworker.js');
  };
  var workerMessageHandler = function(e) {
    // message will only be posted in event of success
    if (e.data.success) {
      MODELER.Event.dispatch(MODELER.EVENTS.ASYNCLOADER.LOAD_SUCCESS, e.data);
    } else {
      MODELER.Event.dispatch(MODELER.EVENTS.ASYNCLOADER.LOAD_FAILURE, e.data);
    }
  }
  that = {};
  initialize();
  that.load = load;
  return that;
}();