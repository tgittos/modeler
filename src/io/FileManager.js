/* 
  FileManager manages loading files into the app and manages references to files, maintains memory, etc
*/
MODELER.IO.FileManager = function(params, my) {
  var that, my = my || {},
  unloaded_text = [],
  unloaded_textures = [],
  files = {};
  
  var initialize = function() {
    // set up event listeners
    MODELER.Event.listen(MODELER.EVENTS.SYNCLOADER.LOAD_SUCCESS, fileLoadSuccess, true);
    MODELER.Event.listen(MODELER.EVENTS.SYNCLOADER.LOAD_FAILURE, fileLoadFailure, true);
    MODELER.Event.listen(MODELER.EVENTS.ASYNCLOADER.LOAD_SUCCESS, fileLoadSuccess, true);
    MODELER.Event.listen(MODELER.EVENTS.ASYNCLOADER.LOAD_FAILURE, fileLoadFailure, true);    
  };
  
  var preload = function(urls) {
    // sort urls by type
    urls.each(function(){
      var extension = this.substring(this.lastIndexOf('.') + 1);
      switch(extension) {
        case "gif":
        case "jpg":
        case "png":
        case "bmp":
          unloaded_textures.push(this);
          break;
        default:
          unloaded_text.push(this);
          break;
      }
    });
    // load all textures first
    if (unloaded_textures.length > 0) { 
      MODELER.Event.dispatch(MODELER.EVENTS.FILEMANAGER.LOAD_PROGRESS, "Loading textures");
      loadTexture(unloaded_textures.pop());
    } else {
      MODELER.Event.dispatch(MODELER.EVENTS.FILEMANAGER.LOAD_PROGRESS, "Loading the kitchen sink");
      MODELER.IO.SyncLoader.loadFiles(unloaded_text);
    }
  };
  var loadTexture = function(src) {
    files[src] = new Image();
    files[src].onload = textureLoaded;
    files[src].src = src;
    MODELER.Event.dispatch(MODELER.EVENTS.FILEMANAGER.LOAD_PROGRESS, "... " + src);
  };
  var textureLoaded = function() {
    if (unloaded_textures.length != 0) {
      loadTexture(unloaded_textures.pop());
    } else {  
      MODELER.Event.dispatch(MODELER.EVENTS.FILEMANAGER.LOAD_PROGRESS, "Loading the kitchen sink");
      MODELER.IO.SyncLoader.loadFiles(unloaded_text);
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
  var get = function(url) {
    if (files[url]) { return files[url]; }
    else {
      // disable async loading because I don't know how to handle it later
      //MODELER.IO.AsyncLoader.load([url]);
    }
  };
  
  that = {};
  initialize();
  that.preload = preload;
  that.get = get;
  return that;
}();