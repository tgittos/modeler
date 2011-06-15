self.addEventListener('message', function(e) {
  var urlsToLoad = {},
  numComplete = 0;
  
  var loadFile = function(url, successCallback, failureCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) { successCallback({ url: url, content: request.responseText }); } 
            else { failureCallback(url); }
        }
    };
    request.send(null);    
  };
  var loadFiles = function(urls) {
    urlsToLoad = {};
    var i = 0;
    for (; i < urls.length; i++) {
      var url = urls[i];
      urlsToLoad[url] = null;
      loadFile(url, partialSuccess, partialFailure);        
    }
  };
  var partialSuccess = function(d){
    var url = d.url;
    var content = d.content;
    urlsToLoad[url] = content;
    numComplete++;

    // When all files have downloaded
    if (numComplete == urlsToLoad.lenth) {
      fullSuccess(urlsToLoad);
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