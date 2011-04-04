//An Object3D is a collection of geometries
//All this junk needs to be distributed into
//Geometry, Quad & Tri and Vertex
(function(m){
  m.Object3D = function (params) {
    var meshes = [];
    this.x = 0, this.y = 0, this.z = 0,
    this.rotVector = null, this.rotDegrees = 0;
    
    //CONSTRUCTOR
    this.init = function (params) {
      if (params.meshes) { meshes = params.meshes; }
      if (params.x)           { this.x = params.x; };
      if (params.y)           { this.y = params.y; };
      if (params.z)           { this.z = params.z; };
      if (params.rotVector)   { this.rotVector = $V(params.rotVector); };
      if (params.rotDegrees)  { this.rotDegrees = params.rotDegrees; };
    };
    
    //PUBLIC FUNCTIONS
    this.getColours = function() {
      //Return a flat array with the material colour for every vertex
      //TODO: This needs some serious work so that it will work with multiple meshes
      var flattened_colours = [];
      meshes.each(function(){
        var render_obj = this.getForRender();
        render_obj.vertices.each(function(){
          flattened_colours = flattened_colours.concat(render_obj.material.colour.elements)
        });
      });
      return flattened_colours;
    }
    this.getForRender = function() {
      //Go through all the faces and call getForRender
      //Flatten each vertex array and face index array into
      //a pair of single arrays
      var flattened_vertices = [];
      var flattened_elementIndices = [];
      meshes.each(function(){
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