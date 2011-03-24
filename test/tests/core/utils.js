//Testing library for utils
module("Utilities");

test("Array.contains works", function(){
  var a = [1, 2, 3, 4, 5];
  equals(true, a.contains(3), "a contains 3");
  equals(false, a.contains(6), "a does not contain 6");
});

test("Array.each works", function(){
  var i = 1;
  var a = [1, 1, 1, 1, 1];
  a.each(function(){
    equals(i + 1, i + this, "i has been added to array value");
    i = i + this;
  });
});

test("Array.remove works", function(){
  var a = [1, 2, 3, 4, 5];
  a.remove(2);
  for (var i = 0; i < a.length; i++) {
    equals(false, a[i] === 2);
  }
});

test("assert works properly", function(){
  assert(true === true, "This should never be thrown");
  raises(function(){
    assert(true === false, "This should be thrown");
  }, "This should be thrown");
});

test("m.Utils.equals works propertly", function(){
  var one = { foo: "bar" };
  var two = { foo: "baz" };
  equals(MODELER.Utils.equals(one, two), false);
  equals(MODELER.Utils.equals(one, { foo: "bar"} ), true);
});