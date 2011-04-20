module("Events");

test('can listen for an event', function(){
  // test passes if no exception is thrown
  MODELER.Event.listen('test', function(){
    var foo = 'bar';
  });
  MODELER.Event.reset();
});

test ('can dispatch an event', function(){
  MODELER.Event.dispatch('test');
  MODELER.Event.reset();
});

test ('can reset MODELER.Event', function(){
  MODELER.Event.listen('test', function(e){
    // test will fail if this gets called
    equal(true, false);
  });
  MODELER.Event.reset();
  MODELER.Event.dispatch('test');
  MODELER.Event.reset();
});

asyncTest ('listen handler fires when event is dispatched', function(){
  // test will fail if 1 assertion isn't made
  MODELER.Event.listen('test', function(e){
    equal(true, true);
  });
  start();
  MODELER.Event.dispatch('test');
  MODELER.Event.reset();
});

asyncTest ('listen handler doesn\'t fire when the wrong event is dispatched', 0, function(){
  MODELER.Event.listen('test2', function(e){
    equal(true, true);
  });
  start();
  MODELER.Event.dispatch('test');
  MODELER.Event.reset();
});

asyncTest ('multiple listen handlers fire when an event is dispatched', 2, function(){
  MODELER.Event.listen('test', function(e){
    equal(true, true);
  });
  MODELER.Event.listen('test', function(e){
    equal(false, false);
  });
  start();
  MODELER.Event.dispatch('test');
  MODELER.Event.reset();
});

asyncTest ('listen handler that expires only fires on the first dispatch', 1, function(){
  MODELER.Event.listen('test', function(e){
    equal(true, true);
  }, true);
  start();
  MODELER.Event.dispatch('test');
  MODELER.Event.dispatch('test');
  MODELER.Event.reset();
});

asyncTest('can stop listening for events', 1, function(){
  function handler(e){
    equal(true, true);
  };
  MODELER.Event.listen('test', handler);
  start();
  MODELER.Event.dispatch('test');
  MODELER.Event.stopListening('test', handler);
  MODELER.Event.dispatch('test');
});