MODELER.Loader = function() {
  var that = {};
  var loadFile = function(url, data, callback, errorCallback) {
      // Set up an asynchronous request
      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      // Hook the event that gets called as the request progresses
      request.onreadystatechange = function () {
          // If the request is "DONE" (completed or failed)
          if (request.readyState == 4) {
              // If we got HTTP status 200 (OK)
              if (request.status == 200) {
                  callback(request.responseText, data)
              } else { // Failed
                  errorCallback(url);
              }
          }
      };

      request.send(null);    
  };
  var loadFiles = function(urls, callback, errorCallback) {
      var numUrls = urls.length;
      var numComplete = 0;
      var result = [];

      // Callback for a single file
      function partialCallback(text, urlIndex) {
          result[urlIndex] = text;
          numComplete++;

          // When all files have downloaded
          if (numComplete == numUrls) {
              callback(result);
          }
      }

      for (var i = 0; i < numUrls; i++) {
          loadFile(urls[i], i, partialCallback, errorCallback);
      }
  }
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
