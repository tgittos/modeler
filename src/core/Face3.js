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
      vertices = params.vertices;
      elements = [[0, 1, 2]];
      lines = [
        [0, 1],
        [1, 2],
        [2, 0]
      ];
    }
  };
  var rotate = function(rotation) {
    
    var rotation = M4x4.makeRotate(Math.degreesToRadians(rotation.degrees), rotation.axis);
    console.log(rotation);
    console.log(my.vertices);
    my.vertices = M4x4.mul(rotation, my.convertTo4x4(my.vertices));
    console.log(my.vertices);
    my.ensure();
    console.log(my.vertices)
    return this;
  };
  var translate = function(translation) {
    var v3 = [ translation.x || 0, translation.y || 0, translation.z || 0 ];
    var translation = M4x4.makeTranslate(v3);
    //console.log(translation);
    //console.log(my.vertices);
    my.vertices = M4x4.mul(translation, my.convertTo4x4(my.vertices));
    my.ensure();
    //console.log(my.vertices);
    return this;
  };
  var convertTo4x4 = function(m) {
    return M3x3.make4x4(m);
  };
  var ensure = function() {
    //Ensure the vertices are 3x3
    my.vertices = M4x4.topLeft3x3(my.vertices);
  }
  var getVerticesAsArray = function() {
    var flattened_vertices = [];
    my.vertices.each(function(){
      flattened_vertices = flattened_vertices.concat(this);
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
    string += 'vertices: ' + my.vertices.inspect() + ', ';
    //Elements
    var elements_strings = [];
    string += 'elements: [';
    my.elements.each(function(){
      elements_strings.push(this.inspect());
    });
    string += elements_strings.join(', ');
    string += '], ';
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
  my.convertTo4x4 = convertTo4x4;
  my.ensure = ensure;
  
  //Public stuff
  that.rotate = rotate;
  that.translate = translate;
  that.inspect = inspect;
  that.getForRender = getForRender;
  
  return that; 
};