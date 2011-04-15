//An Object3D is a collection of geometries
//All this junk needs to be distributed into
//Geometry, Quad & Tri and Vertex
MODELER.Object3D = function(params, my) {
  var that, my = my || {},
  meshes = [],
  x = 0, y = 0, z = 0,
  rotVector = null, rotDegrees = 0;

  var initialize = function () {
    if (params.meshes)      { meshes = params.meshes; }
    if (params.x)           { x = params.x; };
    if (params.y)           { y = params.y; };
    if (params.z)           { z = params.z; };
    if (params.rotVector)   { rotVector = params.rotVector; };
    if (params.rotDegrees)  { rotDegrees = params.rotDegrees; };
  };
    
  var getForRender = function() {
    //Go through all the faces and call getForRender
    //Flatten each vertex array and face index array into
    //a pair of single arrays
    var flattened_vertices = [];
    var flattened_elementIndices = [];
    var flattened_lines = [];
    var material = null;
    meshes.each(function(){
      var render_obj = this.getForRender();
      flattened_vertices = flattened_vertices.concat(render_obj.vertices);
      flattened_elementIndices = flattened_elementIndices.concat(render_obj.elementIndices);
      flattened_lines = flattened_lines.concat(render_obj.lines);
      material = render_obj.material; //Get only 1 material no matter how many meshes we have.
      //Obviously that needs to change...
    });
    return {
      vertices: flattened_vertices,
      elementIndices: flattened_elementIndices,
      lines: flattened_lines,
      material: material
    };
  };
  var getMeshes = function() {
    return meshes;
  };
  var inspect = function() {
    var string = '{';
    string += 'meshes: ' + meshes.inspect();
    return string + '}';
  }
    
  that = {};
  initialize();
  that.x = x, that.y = y, that.z = z,
  that.rotVector = rotVector, that.rotDegrees = rotDegrees;
  that.getForRender = getForRender;
  that.getMeshes = getMeshes;
  that.inspect = inspect;
  return that;
}
MODELER.Object3D.VertexSize = 3;
MODELER.Object3D.ColourSize = 4;