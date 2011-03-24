(function(m){
  m.Scene = function () {
    var children = [];
    
    //PUBLIC FUNCTIONS
    this.addChild = function (obj) {
      assert(obj, "No object given");
      assert(obj instanceof m.Object3D, "Not a Object3D");
      if (!children.contains(obj)) { children.push(obj); }
      return true;
    };
    
    this.removeChild = function (obj) {
      assert(obj, "No object given");
      assert(obj instanceof m.Object3D, "Not an Object3D");
      if (children.contains(obj)) { 
        children.remove(obj); 
        return true;
      }
      return false;
    };
    
    this.hasChild = function (obj) {
      assert(obj, "No object given");
      assert(obj instanceof m.Object3D, "Not an Object3D");
      return children.contains(obj);
    };
    
    this.getChildren = function() {
      return children;
    };
    
    //PRIVATE FUNCTIONS
  }
})(MODELER);
