//Testing library for Scene
module("Scene");
var m = MODELER;

test("Scene.addChild throws exception when given a null object", function(){
  var s = new m.Scene();
  raises(function(){
    s.addChild(null);
  }, "No object given");
});

test ("Scene.addChild throws exception when not given an instance of  Object3D", function(){
  var s = new m.Scene();
  raises(function(){
    s.addChild("This is not a Object3D");
  }, "Not a Object3D");
});

test ("Scene.addChild returns true when given an instance of Object3D", function(){
  var s = new m.Scene();
  var o = new m.Object3D( { name: "First" } );
  equals(true, s.addChild(o));
});

test ("Scene.removeChild throws exception when given a null object",
function(){
  var s = new m.Scene();
  raises(function(){
    s.removeChild(null);
  }, "No object given");
});

test ("Scene.removeChild throws exception when not given an instance of Object3D", function(){
  var s = new m.Scene();
  raises(function(){
    s.removeChild("This is not an Object3D");
  }, "Not an Object3D");
});

test ("Scene.removeChild returns false when an object is not removed", function(){
  //DEPENDS ON Scene.addChild
  var s = new m.Scene();
  var o1 = new m.Object3D( { name: "First" } );
  var o2 = new m.Object3D( { name: "Second" } );
  s.addChild(o1);
  var result = s.removeChild(o2);
  equals(result, false);
});

test ("Scene.removeChild returns true when an object is removed", function(){
  //DEPENDS ON Scene.addChild
  var s = new m.Scene();
  var o1 = new m.Object3D( { name: "First" } );
  s.addChild(o1);
  ok(s.removeChild(o1));
});

test ("Scene.hasChild throws exception when given a null object", function(){
  var s = new m.Scene();
  raises(function(){
    s.hasChild(null);
  }, "No object given");
});

test ("Scene.hasChild throws exception when not given an instance of Object3D", function(){
  var s = new m.Scene();
  raises(function(){
    s.hasChild("This is not an Object3D");
  }, "Not an Object3D");
});

test ("Scene.hasChild returns false when it doesn't contain an object", function(){
  var s = new m.Scene();
  var o1 = new m.Object3D( { name: "First" } );
  var o2 = new m.Object3D( { name: "Second" } );
  s.addChild(o1);
  var result = s.hasChild(o2);
  equals(result, false);
});

test ("Scene.hasChild returns true when it contains an object", function(){
  var s = new m.Scene();
  var o = new m.Object3D( { name: "First" } );
  s.addChild(o);
  ok(s.hasChild(o));
});