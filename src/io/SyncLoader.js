MODELER.IO.SyncLoader = function() {
  var that = {},
  numUrls = 0,
  numComplete = 0,
  result = [],
  PRIVATE_EVENTS = {
    PARTIAL_SUCCESS: 'MODELER.LOADER.PRIVATE_EVENTS.PARTIAL_SUCCESS',
    PARTIAL_FAILURE: 'MODELER.LOADER.PRIVATE_EVENTS.PARTIAL_FAILURE'
  };
  
  var loadFile = function(url, data) {
      // Set up an asynchronous request
      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      // Hook the event that gets called as the request progresses
      request.onreadystatechange = function () {
          // If the request is "DONE" (completed or failed)
          if (request.readyState == 4) {
              // If we got HTTP status 200 (OK)
              if (request.status == 200) {
                  MODELER.Event.dispatch(PRIVATE_EVENTS.PARTIAL_SUCCESS, { response: request.responseText, data: data });
              } else { // Failed
                  MODELER.Event.dispatch(PRIVATE_EVENTS.PARTIAL_FAILURE, url);
              }
          }
      };

      request.send(null);    
  };
  var loadFiles = function(urls) {
    numUrls = urls.length;
    numComplete = 0;
      MODELER.Event.listen(PRIVATE_EVENTS.PARTIAL_SUCCESS, onPartialSuccess);
      MODELER.Event.listen(PRIVATE_EVENTS.PARTIAL_FAILURE, onPartialFailure);
      for (var i = 0; i < numUrls; i++) {
          loadFile(urls[i], i);
      }
  }
  var onPartialSuccess = function(d) {
      var text = d.data.response;
      var urlIndex = d.data.data;
      result[urlIndex] = text;
      numComplete++;

      // When all files have downloaded
      if (numComplete == numUrls) {
        //unsub the listeners
        MODELER.Event.stopListening(PRIVATE_EVENTS.PARTIAL_SUCCESS, onPartialSuccess);
        MODELER.Event.stopListening(PRIVATE_EVENTS.PARTIAL_FAILURE, onPartialFailure);
        MODELER.Event.dispatch(MODELER.EVENTS.SYNCLOADER.LOAD_SUCCESS, result);
      }
  };
  var onPartialFailure = function(url) {
    MODELER.Event.dispatch(MODELER.EVENTS.SYNCLOADER.LOAD_FAILURE, urls);
  };
  
  that.loadFiles = loadFiles;
  return that;
}();