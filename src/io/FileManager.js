/* 
  FileManager manages loading files into the app and manages references to files, maintains memory, etc
*/
MODELER.IO.FileManager = function(params, my) {
  var that, my = my || {},
  files = {};
  
  var initialize = function() {
    // set up event listeners
    MODELER.Event.listen(MODELER.EVENTS.SYNCLOADER.LOAD_SUCCESS, fileLoadSuccess, true);
    MODELER.Event.listen(MODELER.EVENTS.SYNCLOADER.LOAD_FAILURE, fileLoadFailure, true);
    MODELER.Event.listen(MODELER.EVENTS.ASYNCLOADER.LOAD_SUCCESS, fileLoadSuccess, true);
    MODELER.Event.listen(MODELER.EVENTS.ASYNCLOADER.LOAD_FAILURE, fileLoadFailure, true);    
  };
  
  var preload = function(urls) {
    MODELER.IO.SyncLoader.loadFiles(urls);
  };
  var get = function(url) {
    if (files[url]) { return files[url]; }
    else {
      // disable async loading because I don't know how to handle it later
      //MODELER.IO.AsyncLoader.load([url]);
    }
  };
  var fileLoadSuccess = function(d) {
    for (var url in d.data) {
      files[url] = d.data[url];
    }
    MODELER.Event.dispatch(MODELER.EVENTS.FILEMANAGER.LOAD_SUCCESS);
  };
  var fileLoadFailure = function(d) {
    MODELER.Event.dispatch(MODELER.EVENTS.FILEMANAGER.LOAD_FAILURE, d.data);
  };
  
  that = {};
  initialize();
  that.preload = preload;
  that.get = get;
  return that;
}();