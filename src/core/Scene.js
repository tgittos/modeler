(function(m){
  m.Scene = function () {
    var children = [],
    nextObjectID = 0;
    
    //PUBLIC FUNCTIONS
    this.addChild = function (obj) {
      assert(obj, "No object given");
      assert(typeof obj.getForRender === 'function', "Not a renderable object");
      if (!children.contains(obj)) { 
        obj.setID("Object" + nextObjectID++);
        children.push(obj); 
      }
      return true;
    };
    
    this.removeChild = function (obj) {
      assert(obj, "No object given");
      assert(typeof obj.getForRender === 'function', "Not a renderable object");
      if (children.contains(obj)) { 
        children.remove(obj); 
        return true;
      }
      return false;
    };
    
    this.hasChild = function (obj) {
      assert(obj, "No object given");
      assert(typeof obj.getForRender === 'function', "Not a renderable object");
      return children.contains(obj);
    };
    
    this.getChildren = function() {
      return children;
    };
    
    //PRIVATE FUNCTIONS
  }
})(MODELER);
