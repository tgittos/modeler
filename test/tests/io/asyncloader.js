module("AsyncLoader");

test('async works properly', 2, function(){
  var posted = false;
  equal(posted, false);
  MODELER.Event.listen(MODELER.EVENTS.ASYNCLOADER.LOAD_SUCCESS, function(d){
    posted = true;
  });
  MODELER.IO.AsyncLoader.load(['/test/fixtures/test.txt']);
  setTimeout(function(){
    equal(posted, true, 'async has fired event');
  }, 5000); //5 second delay
});