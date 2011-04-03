//A Face3 is a type of face with 3 vertices.
//It has vertices, and maybe later, a material and a normal, etc
MODELER.Face3 = function(params, my){
  //Private vars
  var that, my = my || {},
  //Vertices are the points that get sent to the GPU to draw
  vertices = [],
  //Elements define which vertices in the buffer define elements
  //Elements are 3 sided polygons (triangles), ergo will be stored
  //as an array of 3 element arrays, where each element is an index
  //to a vertex in the vertex array
  elements = [];
  //Shared data
  my.vertices = vertices;
  my.elements = elements;
  //Private functions
  var initialize = function() {
    if (params.vertices) {
      params.vertices.each(function(){
        if (this instanceof MODELER.Vertex) {
          vertices.push(this);
        } else {
          //Assume it's an array of floats
          var v = MODELER.Vertex(this);
          vertices.push(v);
        }
      });
      //TODO: Review to remove magic numbers?
      elements = [[0, 1, 2]];
    }
  };
  var getVerticesAsArray = function() {
    var flattened_vertices = [];
    vertices.each(function(){
      flattened_vertices = flattened_vertices.concat(this.position.elements);
    });
    return flattened_vertices;
  };
  var getElementIndicesArray = function() {
    var flattened_elements = [];
    elements.each(function(){
      flattened_elements.push(
        this[0], this[1], this[2]
      );
    });
    return flattened_elements;
  };
  var getForRender = function() {
    //Return a flat array of vertices, and an array of vertex positions that make up tris
    //for rendering. This is all the OpenGL cares about
    return {
      vertices: getVerticesAsArray(),
      elementIndices: getElementIndicesArray()
    };
  };
  //Public functions
  that = {}; //Don't inherit from anything
  initialize();
  that.getForRender = getForRender;
  return that; 
};