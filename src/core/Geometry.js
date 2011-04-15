//A Geometry is a collection of faces
//It forms the base of all 3D objects in the scene
MODELER.Geometry = function(params, my) {
  var that, my = my || {},
  faces = [];
  var initialize = function() {
    //Process faces
    if (!params) { params = {}; }
    if (params.faces) {
      faces = faces.concat(params.faces);
      weldVertices();
    }
  };
  var createFace3 = function() {
    
  };
  var createFace4 = function(dimensions) {
    assert(dimensions.width && dimensions.height, "dimensions are required for a face4")
    //Center face around origin
    //TODO: Consider passing in a position attribute that modifies the start position of each vertex
    var matrix = [
      dimensions.width / -2,  dimensions.height / -2, 0,
      dimensions.width / 2,  dimensions.height / -2, 0,
      dimensions.width / 2,   dimensions.height / 2, 0,
      dimensions.width / -2,   dimensions.height / 2, 0
    ];
    var face = MODELER.Face4({
      vertices: matrix
    });
    faces.push(face);
    return face;
  };
  var getForRender = function() {
    var flattened_vertices = [];
    var flattened_elementIndices = [];
    var flattened_lines = [];
    faces.each(function(i){
      var render_obj = this.getForRender();
      //Process the elementIndices. On their respective faces, they are absolute values,
      //but once the vertices get flattened, they become relative to that face, and need
      //to be converted back to absolute values
      var vertex_count = (flattened_vertices.length > 0) ? flattened_vertices.length / 3 : 0;
      render_obj.elementIndices.each(function(){
        //Each entry in the flattened_vertices array is a co-ord, with 3 co-ords belonging
        //to one vertex
        flattened_elementIndices.push(vertex_count + this);
      });
      //Do the same thing with lines as with elements
      render_obj.lines.each(function(){
        flattened_lines.push(vertex_count + this);
      });
      flattened_vertices = flattened_vertices.concat(render_obj.vertices);
    });
    return {
      vertices: flattened_vertices,
      elementIndices: flattened_elementIndices,
      lines: flattened_lines
    };
  };
  var inspect = function() {
    var string = '{';
    string += 'faces: ['
    var string_array = [];
    faces.each(function(){
      string_array.push(this.inspect());
    });
    string += string_array.join(', ');
    return string += ']}';
  };
  var weldVertices = function() {
    //When adding vertices, we need to remove vertices that have been repeated
    //several times, and instead make a face using existing vertices
  };
  initialize();
  that = {};
  that.createFace3 = createFace3;
  that.createFace4 = createFace4;
  that.inspect = inspect;
  that.getForRender = getForRender;
  return that;
};