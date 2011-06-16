MODELER.Primitive.Cube = function(params, my) {
  var that, my = my || {};
  
  var initialize = function(){
    // build the cube from scratch!
    // this is just to check if the renderer works
    // later, I will build an editor and drop this in, and export as a JSON object
    // then all primitives will just be JSON files
    my.vertices = [
      // vertex         normal              texel
      -1.0, -1.0, 1.0,  0.0, 0.0, 1.0,      0.0, 0.0, // front bottom left    [0]   (front)
      -1.0, 1.0, 1.0,   0.0, 0.0, 1.0,      0.0, 1.0, // front top left       [1]   (front)
      1.0, 1.0, 1.0,    0.0, 0.0, 1.0,      1.0, 1.0, // front top right      [2]   (front)
      1.0, -1.0, 1.0,   0.0, 0.0, 1.0,      1.0, 0.0, // front bottom right   [3]   (front)
      -1.0, -1.0, -1.0, -1.0, 0.0, 0.0,     0.0, 0.0, // back bottom left     [4]   (left)
      -1.0, 1.0, -1.0,  -1.0, 0.0, 0.0,     0.0, 1.0, // back top left        [5]   (left)
      -1.0, 1.0, 1.0,   -1.0, 0.0, 0.0,     1.0, 1.0, // front top left       [6]   (left)
      -1.0, -1.0, 1.0,  -1.0, 0.0, 0.0,     1.0, 0.0, // front bottom left    [7]   (left)
      -1.0, -1.0, -1.0, 0.0, 0.0, -1.0,     1.0, 0.0, // back bottom left     [8]   (back)
      -1.0, 1.0, -1.0,  0.0, 0.0, -1.0,     1.0, 1.0, // back top left        [9]   (back)
      1.0, 1.0, -1.0,   0.0, 0.0, -1.0,     0.0, 1.0, // back top right       [10]  (back)
      1.0, -1.0, -1.0,  0.0, 0.0, -1.0,     0.0, 0.0, // back bottom right    [11]  (back)
      1.0, -1.0, 1.0,   1.0, 0.0, 0.0,      0.0, 0.0, // front bottom right   [12]  (right)
      1.0, 1.0, 1.0,    1.0, 0.0, 0.0,      0.0, 1.0, // front top right      [13]  (right)
      1.0, 1.0, -1.0,   1.0, 0.0, 0.0,      1.0, 1.0, // back top right       [14]  (right)
      1.0, -1.0, -1.0,  1.0, 0.0, 0.0,      1.0, 0.0, // back bottom right    [15]  (right)
      -1.0, 1.0, 1.0,   0.0, 1.0, 0.0,      0.0, 0.0, // front top left       [16]  (top)
      -1.0, 1.0, -1.0,  0.0, 1.0, 0.0,      0.0, 1.0, // back top left        [17]  (top)
      1.0, 1.0, -1.0,   0.0, 1.0, 0.0,      1.0, 1.0, // back top right       [18]  (top)
      1.0, 1.0, 1.0,    0.0, 1.0, 0.0,      1.0, 0.0, // front top right      [19]  (top)
      -1.0, -1.0, 1.0,  0.0, -1.0, 0.0,     1.0, 0.0, // front bottom left    [20]  (bottom)
      -1.0, -1.0, -1.0, 0.0, -1.0, 0.0,     1.0, 1.0, // back bottom left     [21]  (bottom)
      1.0, -1.0, -1.0,  0.0, -1.0, 0.0,     0.0, 1.0, // back bottom right    [22]  (bottom)
      1.0, -1.0, 1.0,   0.0, -1.0, 0.0,     0.0, 0.0  // front bottom right   [23]  (bottom)
    ];
    my.indices = [
      0, 1, 2, 0, 2, 3,       // front face
      4, 5, 6, 4, 6, 7,       // left face
      8, 9, 10, 8, 10, 11,    // back face
      12, 13, 14, 12, 14, 15, // right face
      16, 17, 18, 16, 18, 19, // top face
      20, 21, 22, 20, 22, 23  // bottom face
    ];
    my.lines = [
      0, 1, 1, 2, 2, 3, 3, 0,     // front face
      8, 9, 9, 10, 10, 11, 11, 8, // back face
      0, 8, 1, 9, 2, 10, 3, 11    // join the front and back faces to make the cube
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