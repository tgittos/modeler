MODELER.Scene = function(params, my) {
  var that, my = my || {},
  children = [],
  nextObjectID = 0;
  
  var initialize = function() { };
  var addChild = function (obj) {
    assert(obj, "No object given");
    assert(typeof obj.getForRender === 'function', "Not a renderable object");
    if (!children.contains(obj)) { 
      obj.id = "Object" + nextObjectID++;
      children.push(obj); 
    }
    return true;
  };
  var removeChild = function (obj) {
    assert(obj, "No object given");
    assert(typeof obj.getForRender === 'function', "Not a renderable object");
    if (children.contains(obj)) { 
      children.remove(obj); 
      return true;
    }
    return false;
  };
  var hasChild = function (obj) {
    assert(obj, "No object given");
    assert(typeof obj.getForRender === 'function', "Not a renderable object");
    return children.contains(obj);
  };
  var getChildren = function() {
    return children;
  };
  
  that = {};
  initialize();
  that.addChild = addChild;
  that.removeChild = removeChild;
  that.hasChild = hasChild;
  that.getChildren = getChildren;
  return that;
}
