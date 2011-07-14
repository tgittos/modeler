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
  root_obj = null,
  buffer = null,
  dirty = false,
  object_counter = 0,
  lights = [],
  VERTEX_STRIDE = 12; // vertex stride is how many elements in a vertex - x, y, z * 4 bytes = 12
  
  var initialize = function() {
    root_obj = REDBACK.Core.WebGLSceneGraphNode();
  };
  var addObject = function(obj, parent) {
    dirty = true;
    if (obj.id.length <= 0) { obj.id = "Object" + object_counter++ };
    if (!parent) { parent = root_obj; }
    parent.addObject(REDBACK.Core.WebGLSceneGraphNode({obj: obj}));
    return obj.id;
  };
  var removeObject = function(obj) {
    dirty = true;
    var parent_obj = obj.parent;
    parent_obj.removeChild(obj);
  };
  var moveObject = function(obj, new_parent) {
    removeObject(obj);
    addObject(obj, new_parent);
  };
  var addLight = function(light) {
    lights.push(light);
  };
  var removeLight = function(light) {
    lights.remove(light);
  };
  var getLights = function() { return lights; }
  var getRenderBuffers = function() {    
    // hit the buffer first
    if (!dirty && buffer) { return buffer; }
    buffer = {
      vertex: [],
      index: [],
      line: [],
      material: []
    };
    
    // walk the tree, applying transformations 
    // TODO: Uncomment this and fix the buffering
    var node_stack = [];
    node_stack = node_stack.concat(root_obj.children);
    while (node_stack.length > 0) {
      var current_object = node_stack.pop();
      var obj = current_object.getObject();
      var obj_global_transform = current_object.getGlobalTransform();
      processObject(obj, obj_global_transform);
      node_stack = node_stack.concat(current_object.children);
    }
    //dirty = false;
    return buffer;
  };
  var processObject = function(obj, global_transform) {
    //console.log('processing ' + obj.id);
    /*
      Get the object's vertex, index, line and material buffers.
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
    
    // copy the arrays, don't ref them
    var vertex_buffer = obj.vertices.slice(0);
    var index_buffer = obj.indices.slice(0);
    var line_buffer = obj.lines.slice(0);
    var material_buffer = obj.materials.slice(0);
    var transform = global_transform.slice(0);
    
    // so far, this just packs materials and vertices, not indices or lines
    // TODO: There is an issue with the offset calculation that's borking up a scene with
    // more than one object.
    // Index and line indices need to be manually adjusted
    material_buffer.each(function(){
      var material = this;
      var found = false;
      buffer.material.each(function(){
        if (equals(this.material, material)) {
          // THIS HAS NEVER BEEN TESTED AS WORKING
          // NEED TO GET THE OBJ COMPARISON FUNCTION EVALUATING PROPERLY
          
          // material was found in our material buffer already
          var mat = this;
          // adding offsets to each index so that it references the correct vertex in the buffer
          for (var i = 0; i < index_buffer.length; i++) {
            index_buffer[i] += mat.offsets.vertex / REDBACK.ELEMENT_SIZE;
          };
          for (var i = 0; i < line_buffer.length; i++) {
            line_buffer[i] += mat.offsets.vertex / REDBACK.ELEMENT_SIZE;
          };
          //insert our object's buffers into the global buffers, at the material's current offset
          //the offset doesn't change because the material starts at the same point
          //in the global buffer, it just has more vertices, which is why we update the counts
          buffer.vertex.splice(mat.offsets.vertex / REBACK.VERTEX_BYTES, 0, vertex_buffer);
          buffer.index.splice(mat.offsets.index / 2, 0, index_buffer);
          buffer.line.splice(mat.offsets.line / 2, 0, line_buffer);
          // adding transform and offsets for transform
          mat.transforms = [];
          mat.transforms.push({
            matrix: transform,
            //offsets are the original offset, plus the old length. Do this before
            //we update the length
            offsets: {
              vertex: mat.offsets.vertex + mat.counts.vertex,
              index: mat.offsets.index + mat.counts.index,
              line: mat.offsets.line + mat.counts.line
            },
            counts: {
              vertex: vertex_buffer.length,
              index: index_buffer.length,
              line: line_buffer.length
            }
          });
          // need this to at least keep count of where our object boundaries are
          mat.counts.vertex += vertex_buffer.length;
          mat.counts.index += index_buffer.length;
          mat.counts.line += line_buffer.length;
          found = true;
          return;
        }
      });
      if (!found) {
        // the index entries reference vertices by index
        // hence adding the vertex offset to the indices
        for (var i = 0; i < index_buffer.length; i++) {
          index_buffer[i] += buffer.vertex.length / REDBACK.ELEMENT_SIZE;
        };
        for (var i = 0; i < line_buffer.length; i++) {
          line_buffer[i] += buffer.vertex.length / REDBACK.ELEMENT_SIZE;
        };
        // adding transform and offsets for transform
        material.transforms = [];
        material.transforms.push({
          matrix: transform,
          //offsets are the original offset, plus the old length. Do this before
          //we update the length
          offsets: {
            vertex: material.offsets.vertex,
            index: material.offsets.index,
            line: material.offsets.line
          },
          counts: {
            vertex: vertex_buffer.length,
            index: index_buffer.length,
            line: line_buffer.length
          }
        });
        // offsets are in bytes
        material.offsets.vertex = buffer.vertex.length * REDBACK.VERTEX_BYTES;
        material.offsets.index = buffer.index.length * 2; // 2 for gl.UNSIGNED_SHORT
        material.offsets.line = buffer.line.length * 2; // 2 for gl.UNSIGNED_SHORT
        
        buffer.vertex = buffer.vertex.concat(vertex_buffer);
        buffer.index = buffer.index.concat(index_buffer);
        buffer.line = buffer.line.concat(line_buffer);
        buffer.material.push(material);
      }
    });
  };
  
  that = {};
  initialize();
  that.initialize = initialize;
  that.addObject = addObject;
  that.removeObject = removeObject;
  that.addLight = addLight;
  that.removeLight = removeLight;
  that.getLights = getLights;
  that.getRenderBuffers = getRenderBuffers;
  return that;
};