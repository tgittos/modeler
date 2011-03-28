(function(m){
  m.Object3D = function (params) {    
    //Array of vectorss
    var vertices = [],
    colours = [],
    id = null;

    this.x = 0, this.y = 0, this.z = 0,
    this.rotVector = null, this.rotDegrees = 0;
    
    //CONSTRUCTOR
    this.init = function (params) {
      if (params.vertices) {
        params.vertices.each(function(){
          vertices.push($V(this));
        });
      }
      if (params.colours) {
        console.log(params.colours);
        params.colours.each(function(i){
          colours.push($V(this));
        });
      }
      if (params.x)           { this.x = params.x; };
      if (params.y)           { this.y = params.y; };
      if (params.z)           { this.z = params.z; };
      if (params.rotVector)   { this.rotVector = $V(params.rotVector); };
      if (params.rotDegrees)  { this.rotDegrees = params.rotDegrees; };
    };
    
    //PUBLIC FUNCTIONS
    this.setID = function(value)  { id = id || value; };
    this.getID = function()       { return id; };
    this.getVertices = function() { return vertices; };
    this.getColours = function()  { return colours; };
    //TODO: Refactor this so it doesnt require calling getVertices or getColours
    //and passing it to this function
    this.flatten = function(arr) {
      var data = [];
      arr.each(function(){
        var dim = this.dimensions();
        for (var i = 1; i <= dim; i++) {
          data.push(this.e(i));
        }
      });
      return data;
    };
    
    this.init(params);
  };
  m.Object3D.VertexSize = 3;
  m.Object3D.ColourSize = 4;
})(MODELER);