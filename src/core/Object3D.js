(function(m){
  m.Object3D = function (params) {    
    //Array of vectorss
    var vertices = [],
    id = null;

    this.x = 0, this.y = 0, this.z = 0,
    this.rotX = 0, this.rotY = 0, this.rotZ = 0;
    
    //CONSTRUCTOR
    this.init = function (params) {
      if (params.vertices) {
        params.vertices.each(function(){
          vertices.push($V(this));
        });
      }
      if (params.x) { this.x = params.x; };
      if (params.y) { this.y = params.y; };
      if (params.z) { this.z = params.z; };
    };
    
    //PUBLIC FUNCTIONS
    this.setID = function(value)  { id = id || value; }
    this.getID = function()       { return id; };
    this.getVertices = function() { return vertices; };
    this.flatten = function() {
      var data = [];
      vertices.each(function(){
        data.push(this.e(1));
        data.push(this.e(2));
        data.push(this.e(3));
      });
      return data;
    };
    this.getVertexDimensions = function() { return (vertices[0]) ? vertices[0].dimensions() : null; }
    
    this.init(params);
  };
})(MODELER);