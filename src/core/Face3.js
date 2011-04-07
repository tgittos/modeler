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
  elements = [],
  lines = [];
  //Private functions
  var initialize = function() {
    if (params.vertices) {
      if (params.vertices instanceof Matrix) {
        //Can decompose a matrix down to an array of vectors
        //Send the vectors to MODELER.Vertex constructor
        var rows = params.vertices.rows();
        //TODO: Consider moving this to a Util - Matrix.eachRow & Matrix.eachCol
        for (var i = 1; i <=  rows; i++) {
          var v = MODELER.Vertex(params.vertices.row(i))
          vertices.push(v);
        }
      } else {
        params.vertices.each(function(){
          if (this instanceof MODELER.Vertex) {
            vertices.push(this);
          } else {
            //Assume it's an array of floats
            var v = MODELER.Vertex(this);
            vertices.push(v);
          }
        });
      }
      //TODO: Review to remove magic numbers?
      elements = [[0, 1, 2]];
      lines = [
        [0, 1],
        [1, 2],
        [2, 0]
      ];
    }
  };
  var getVerticesAsArray = function() {
    var flattened_vertices = [];
    my.vertices.each(function(){
      flattened_vertices = flattened_vertices.concat(this.position.elements);
    });
    return flattened_vertices;
  };
  var getElementIndicesArray = function() {
    var flattened_elements = [];
    my.elements.each(function(){
      flattened_elements.push(
        this[0], this[1], this[2]
      );
    });
    return flattened_elements;
  };
  var getLinesArray = function() {
    //Figure out lines based on element indices and vertices
    var flattened_lines = [];
    my.lines.each(function(){
      flattened_lines = flattened_lines.concat(this);
    });
    return flattened_lines;
  };
  var inspect = function() {
    var string = '{';
    //Vertices
    var vertices_strings = [];
    string += 'vertices: [';
    my.vertices.each(function(){
      vertices_strings.push(this.inspect());
    });
    string += vertices_strings.join(', ');
    string += '],';
    //Elements
    var elements_strings = [];
    string += 'elements: [';
    my.elements.each(function(){
      elements_strings.push(this.inspect());
    });
    string += elements_strings.join(', ');
    string += '],';
    //Lines
    var lines_strings = [];
    string += 'lines: [';
    my.lines.each(function(){
      lines_strings.push(this.inspect());
    });
    string += lines_strings.join(', ');
    string += ']';
    return string += '}';
  }
  var getForRender = function() {
    //Return a flat array of vertices, and an array of vertex positions that make up tris
    //for rendering. This is all the OpenGL cares about
    return {
      vertices: getVerticesAsArray(),
      elementIndices: getElementIndicesArray(),
      lines: getLinesArray()
    };
  };
  
  that = {}; //Don't inherit from anything
  initialize();
  
  //Shared data
  my.vertices = vertices;
  my.elements = elements;
  my.lines = lines;
  
  //Public stuff
  that.inspect = inspect;
  that.getForRender = getForRender;
  
  return that; 
};