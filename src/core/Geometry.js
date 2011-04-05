//A Geometry is a collection of faces
//It forms the base of all 3D objects in the scene
MODELER.Geometry = function(params, my) {
  var that, my = my || {},
  faces = [];
  function initialize() {
    //Process faces
    if (params.faces) {
      faces = faces.concat(params.faces);
      weldVertices();
    }
  };
  function getForRender() {
    var flattened_vertices = [];
    var flattened_elementIndices = [];
    faces.each(function(i){
      var render_obj = this.getForRender();
      //Process the elementIndices. On their respective faces, they are absolute values,
      //but once the vertices get flattened, they become relative to that face, and need
      //to be converted back to absolute values
      render_obj.elementIndices.each(function(){
        //Each entry in the flattened_vertices array is a co-ord, with 3 co-ords belonging
        //to one vertex
        var vertex_count = (flattened_vertices.length > 0) ? flattened_vertices.length / 3 : 0;
        flattened_elementIndices.push(vertex_count + this);
      });
      flattened_vertices = flattened_vertices.concat(render_obj.vertices);
    });
    return {
      vertices: flattened_vertices,
      elementIndices: flattened_elementIndices
    };
  };
  function inspect() {
    var string = '{';
    string += 'faces: ['
    var string_array = [];
    faces.each(function(){
      string_array.push(this.inspect());
    });
    string += string_array.join(', ');
    return string += ']}';
  };
  function weldVertices() {
    //When adding vertices, we need to remove vertices that have been repeated
    //several times, and instead make a face using existing vertices
  };
  initialize();
  that = {};
  that.inspect = inspect;
  that.getForRender = getForRender;
  return that;
};