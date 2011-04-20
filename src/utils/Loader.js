MODELER.Loader = function() {
  var that = {},
  numUrls = 0,
  numComplete = 0,
  result = [],
  event = "";
  
  var loadFile = function(url, data, event) {
      // Set up an asynchronous request
      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      // Hook the event that gets called as the request progresses
      request.onreadystatechange = function () {
          // If the request is "DONE" (completed or failed)
          if (request.readyState == 4) {
              // If we got HTTP status 200 (OK)
              //TODO: Implement eventing here
              if (request.status == 200) {
                  MODELER.Event.dispatch(event + ':success', { response: request.responseText, data: data });
              } else { // Failed
                  MODELER.Event.dispatch(event + ':failure', url);
              }
          }
      };

      request.send(null);    
  };
  var loadFiles = function(urls, e) {
    event = e;
    numUrls = urls.length;
    numComplete = 0;
      // listener for success
      MODELER.Event.listen('MODELER:event:partial:loading:success', onPartialSuccess);
      // listener for failure
      MODELER.Event.listen('MODELER:event:partial:loading:failure', onPartialFailure);
      // do it
      for (var i = 0; i < numUrls; i++) {
          loadFile(urls[i], i, 'MODELER:event:partial:loading');
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
        MODELER.Event.stopListening('MODELER:event:partial:loading:success', onPartialSuccess);
        MODELER.Event.stopListening('MODELER:event:partial:loading:failure', onPartialFailure);
          MODELER.Event.dispatch(event + ':success', result);
      }
  };
  var onPartialFailure = function(url) {
    MODELER.Event.dispatch(event + ':failure', urls);
  };
  
  that.loadFile = loadFile;
  that.loadFiles = loadFiles;
  return that;
}();

/*
var gl;
// ... set up WebGL ...

loadFiles(['vertex.shader', 'fragment.shader'], function (shaderText) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderText[0]);
    // ... compile shader, etc ...
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderText[1]);

    // ... set up shader program and start render loop timer
}, function (url) {
    alert('Failed to download "' + url + '"');
}); 
*/
