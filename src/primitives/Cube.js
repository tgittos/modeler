MODELER.Cube = function(params, my) {
  var that, my = my || {};
  
  var initialize = function(){
    // build the cube from scratch!
    // this is just to check if the renderer works
    // later, I will build an editor and drop this in, and export as a JSON object
    // then all primitives will just be JSON files
    my.vertices = [
      -1.0, -1.0, -1.0, // front bottom left  [0]
      -1.0, 1.0, -1.0, // front top left      [1]
      1.0, 1.0, -1.0, // front top right      [2]
      1.0, -1.0, -1.0, // front bottom right  [3]
      -1.0, -1.0, 1.0, // back bottom left    [4]
      -1.0, 1.0, 1.0, // back top left        [5]
      1.0, 1.0, 1.0, // back top right        [6]
      1.0, -1.0, 1.0 // back bottom right     [7]
    ];
    my.indices = [
      0, 1, 2, 0, 2, 3, // front face
      4, 5, 6, 4, 6, 7, // back face
      0, 4, 5, 0, 5, 1, // left face
      3, 7, 6, 3, 6, 2, // right face
      1, 5, 6, 1, 6, 2, // top face
      0, 4, 7, 0, 7, 3 // bottom face
    ];
    my.lines = [
      0, 1, 1, 2, 2, 3, 3, 0, // front face
      4, 5, 5, 6, 6, 7, 7, 4, // back face
      0, 4, 1, 5, 3, 7, 2, 6 // join the front and back faces to make the cube
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
        },
      }
      my.materials = [material_obj];
    };
  };
  
  that = REDBACK.Core.WebGLObject(params, my);
  initialize();
  return that;
};