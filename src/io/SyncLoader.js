MODELER.IO.SyncLoader = function() {
  var that = {},
  urlsToLoad = {},
  numComplete = 0,
  numTotal = 0,
  PRIVATE_EVENTS = {
    PARTIAL_SUCCESS: 'MODELER.LOADER.PRIVATE_EVENTS.PARTIAL_SUCCESS',
    PARTIAL_FAILURE: 'MODELER.LOADER.PRIVATE_EVENTS.PARTIAL_FAILURE'
  };
  
  var loadFiles = function(urls) {
    urlsToLoad = {};
    numTotal = urls.length;
    MODELER.Event.listen(PRIVATE_EVENTS.PARTIAL_SUCCESS, onPartialSuccess);
    MODELER.Event.listen(PRIVATE_EVENTS.PARTIAL_FAILURE, onPartialFailure);
    urls.each(function() {
      urlsToLoad[this] = null;
      loadFile(this);
    });
  };
  var loadFile = function(url) {
      // Set up an asynchronous request
      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      // Hook the event that gets called as the request progresses
      request.onreadystatechange = function () {
          // If the request is "DONE" (completed or failed)
          if (request.readyState == 4) {
              // If we got HTTP status 200 (OK)
              if (request.status == 200) {
                  MODELER.Event.dispatch(PRIVATE_EVENTS.PARTIAL_SUCCESS, { url: url, content: request.responseText });
              } else { // Failed
                  MODELER.Event.dispatch(PRIVATE_EVENTS.PARTIAL_FAILURE, url);
              }
          }
      };

      request.send(null);    
  };
  var onPartialSuccess = function(d) {
    var url = d.data.url;
    var content = d.data.content;
    urlsToLoad[url] = content;
    numComplete++;

    // When all files have downloaded
    if (numComplete == numTotal) {
      //unsub the listeners
      MODELER.Event.stopListening(PRIVATE_EVENTS.PARTIAL_SUCCESS, onPartialSuccess);
      MODELER.Event.stopListening(PRIVATE_EVENTS.PARTIAL_FAILURE, onPartialFailure);
      MODELER.Event.dispatch(MODELER.EVENTS.SYNCLOADER.LOAD_SUCCESS, urlsToLoad);
    }
  };
  var onPartialFailure = function(url) {
    MODELER.Event.dispatch(MODELER.EVENTS.SYNCLOADER.LOAD_FAILURE, url);
  };
  
  that.loadFiles = loadFiles;
  return that;
}();