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
    faces.each(function(){
      var render_obj = this.getForRender;
      flattened_vertices = flattened_vertices.concat(render_obj.vertices);
      flattened_elementIndices = flattened_elementIndices.concat(render_obj.elementIndices);
    });
    return {
      vertices: flattened_vertices,
      elementIndices: flattened_elementIndices
    };
  };
  
  function weldVertices() {
    //When adding vertices, we need to remove vertices that have been repeated
    //several times, and instead make a face using existing vertices
  };
  initialize();
  that = {};
  that.getForRender = getForRender;
  return that;
};