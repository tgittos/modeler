MODELER.Primitive.Pyramid = function(params, my) {
  var that, my = my || {};
  
  var initialize = function(){
    // build the cube from scratch!
    // this is just to check if the renderer works
    // later, I will build an editor and drop this in, and export as a JSON object
    // then all primitives will just be JSON files
    my.vertices = [
      0.0, 1.0, 0.0, // top [0]
      -1.0, -1.0, 1.0, // front bottom left [1]
      -1.0, -1.0, -1.0, // back bottom left [2]
      1.0, -1.0, -1.0, // back bottom right [3]
      1.0, -1.0, 1.0 // front bottom right [4]
    ];
    my.indices = [
      0, 4, 1, // front
      0, 1, 2, // left
      0, 2, 3, // back
      0, 3, 4, // right
      1, 2, 3, 1, 3, 4 // bottom
    ];
    my.lines = [
      1, 2, 2, 3, 3, 4, 4, 1, // base
      0, 1, 0, 2, 0, 3, 0, 4 // 4 triangular faces
    ];
    if (params.material) {
      var material_obj = {
        material: params.material,
        offsets: {
          vertex: 0, 
          index: 0, 
          line: 0
        },
        counts: {
          vertex: my.vertices.length, 
          index: my.indices.length, 
          line: my.lines.length
        }
      }
      my.materials = [material_obj];
    };
  };
  
  that = REDBACK.Core.WebGLObject(params, my);
  initialize();
  return that;
};