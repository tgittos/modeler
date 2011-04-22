self.addEventListener('message', function(e) {
  var result = [];
  var numUrls = 0;
  var numComplete = 0;
  
  var loadFile = function(url, data, successCallback, failureCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) { successCallback({ response: request.responseText, data: data }); } 
            else { failureCallback(url); }
        }
    };
    request.send(null);    
  };
  var loadFiles = function(urls) {
    numUrls = urls.length;
    var i = 0;
    for (; i < numUrls; i++) {
        loadFile(urls[i], i, partialSuccess, partialFailure);        
    }
  };
  var partialSuccess = function(d){
    var text = d.response;
    var urlIndex = d.data;
    result[urlIndex] = text;
    numComplete++;

    // When all files have downloaded
    if (numComplete == numUrls) {
      fullSuccess(result);
    }
  };
  var partialFailure = function(url) {
    fullFailure("could not load " + url);
  };
  var fullSuccess = function(e){
    postMessage({success: true, data: e});
    self.close();
  };
  var fullFailure = function(e){
    postMessage({success: false, data: e});
    self.close();
  };
  loadFiles(e.data);
});