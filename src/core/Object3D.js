//An Object3D is a collection of geometries
//All this junk needs to be distributed into
//Geometry, Quad & Tri and Vertex
(function(m){
  m.Object3D = function (params) {
    var faces = [],
    colours = [],
    id = null;

    this.x = 0, this.y = 0, this.z = 0,
    this.rotVector = null, this.rotDegrees = 0;
    
    //CONSTRUCTOR
    this.init = function (params) {
      if (params.faces) { faces = params.faces; }
      if (params.colours) {
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
    this.getFaces = function()    {
      return faces;
    };
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
    this.getForRender = function() {
      //Go through all the faces and call getForRender
      //Flatten each vertex array and face index array into
      //a pair of single arrays
      var flattened_vertices = [];
      var flattened_elementIndices = [];
      faces.each(function(){
        var render_obj = this.getForRender();
        flattened_vertices = flattened_vertices.concat(render_obj.vertices);
        flattened_elementIndices = flattened_elementIndices.concat(render_obj.elementIndices);
      });
      return {
        vertices: flattened_vertices,
        elementIndices: flattened_elementIndices
      };
    };
    this.init(params);
  };
  m.Object3D.VertexSize = 3;
  m.Object3D.ColourSize = 4;
})(MODELER);