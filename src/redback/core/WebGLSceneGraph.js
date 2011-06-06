/*
  WebGLSceneGraph optimises the way data is sent to the renderer. It's the main interface for the client
  application and the renderer
  
  Objects are stored in a tree outlining their heirarchy and composition.
  When a render frame is requested, the renderer will ask the SceneGraph for data.
  This data is computed with a tree traversal, each object having parent's rotations applied.
  The data is also cached, and a variable is defined to let the SceneGraph know whether or not it 
  needs to recompute the render data
*/
REDBACK.Core.WebGLSceneGraph = function(params, my) {
  
  /*
   BASICS OF ARRAY INTERLEAVING AND PACKING
   You can stuff more information in a vertex than just it's x, y, z position, using strides
   which are then passed down to the WebGL attribPointer and draw calls.
   For example, consider you want to put a vertex's x, y, z and u, v (texturing) co-ords in 
   one array
   Each vertex in the vertex array has 5 elements in it - 3 for position, 2 for texturing.
   Example:
   var verts = [
       1, 1, 1, 0, 1, // (x, y, z), (u, v)...
       2, 2, 2, 0, 1,
       3, 3, 3, 0, 1,
   ];
   var vertBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
   gl.vertexAttribPointer(shader_attrib_position, 3, gl.FLOAT, false, 20, 0);
   gl.vertexAttribPointer(shader_attrib_texcoord, 2, gl.FLOAT, false, 20, 12);
   
   In the first call to vertexAttribPointer, we set the shader's position attrib as 3 elements in
   length, floats, with each entry starting every 20th byte (5 elements * 4 bytes for a float), 
   initially starting at 0.
   
   In the second call to vertexAttribPointer, we set the shader's texture attrib as 2 elements in
   length, floats, with each entry starting every 20th bytes, initially starting at 12 (3 elements
   for x, y, z * 4 bytes each)
   
   This way we don't need a buffer for texture co-ordinates, because we've packed it in with the
   vertices
  */
  
  /*
    Multiple objects will be buffered into the one vertex, index and line array.
    However, those arrays will have their contents grouped not by object, but by surface defined
    by material.
    The renderer does not care about how the vertex, index and other buffers are arranged, and as
    long as we provide the proper methods to manage it, neither will the user.
  */
  
  var that, my = my || {},
  vertices = [],
  indices = [],
  lines = [],
  materials = [],
  object_offsets = {},
  object_counter = 0,
  vertex_stride = 12; // vertex stride is how many elements in a vertex
  
  var initialize = function() {
    
  };
  var add_object = function(obj) {
    
    /*
      Loop through passed in materials
      If the material is already in the material buffer:
        - Find the materials offset & length for vertices, indices and lines
        - Insert vertices, indices and lines
        - Update length attributes of materials
        - Use new offset and length in object buffer
      Otherwise:
        - Append vertices, indices and lines
        - Append material
        - Update object buffer
    */
    
    /*
      obj format:
      {
        vertices: array of vertices,
        indices: aray of indices,
        materials: { 
          material: WebGLMaterial, 
          offsets: {
            vertex: vertex offset,
            index: index offset
          },
          lengths: {
            vertex: number of verts it applies to,
            index: number of indices
          }
        }
      }
    */

    obj.materials.each(function(){
      var mat = get_material(this);
      if (mat) {
        vertices = vertices.splice(mat.offsets.vertex + mat.lengths.vertex, 0, obj.vertices);
        indices = indices.splice(mat.offsets.index + mat.lengths.index, 0, obj.indices);
      } else {
        var obj_lines = calculate_lines(obj.vertices);
        this.offsets.vertex += vertices.length;
        this.offsets.index += indices.length;
        this.offsets.lines += lines.length;
        this.lengths.vertex = obj.vertices.length;
        this.lengths.index = obj.indices.length;
        this.lengths.lines = obj_lines.length;
        vertices = vertices.concat(obj.vertices);
        indices = indices.concat(obj.indices);
        lines = lines.concat(obj_lines);
        materials = materials.concat(this);
      }
    });
    
    object_offsets[object_counter++] = {
      vertex_offset: vertices.length,
      index_offset: indices.length,
      lines_offset: lines
    }
    
  };
  var remove_object = function(obj) {
    
  };
  var get_vertex_buffer = function() { return vertices; };
  var get_index_buffer = function() { return indices; };
  var get_line_buffer = function() { return lines; };
  var get_material_buffer = function() { return materials; };
  var calculate_lines = function(vertices) {
    line_buffer = [];
    for (var i = 0; i < vertices.length; i+= 3) {
      line_buffer = line_buffer.concat([
        vertices[i], vertices[i + 1],
        vertices[i + 1], vertices[i + 2],
        vertices[i + 2], vertices[i]
      ]);
    }
  };
  var get_material = function(material) {
    var mat = null;
    materials.each(function(){
      if this.material.equals(material.material) {
        mat = this;
        return;
      }
    });
    return mat;
  }
  
  that = {};
  initialize();
  that.add_object = add_object;
  that.remove_object = remove_object;
  that.get_vertex_buffer = get_vertex_buffer;
  that.get_index_buffer = get_index_buffer;
  that.get_line_buffer = get_line_buffer;
  that.get_material_buffer = get_material_buffer;
  return that;
};