REDBACK.Core.WebGLSceneGraphNode = function(params, my) {
  var that, my = my || {},
  obj = null,
  parent = null,
  children = [];
  
  var initialize = function() {
    if (params) {
      if (params.obj) { obj = params.obj; }
    }
  };
  var getObject = function() { 
    return {
      id: obj.id,
      vertices: obj.getVertices(),
      indices: obj.getIndices(),
      lines: obj.getLines(),
      materials: obj.getMaterials()
    }; 
  }
  var getGlobalTransform = function() {
    var parent_transform = M4x4.I;
    if (parent) { parent_transform = parent.getGlobalTransform(); }
    // build local transform from rotation/translation of the object
    var translation = M4x4.translate([obj.x, obj.y, obj.z], M4x4.I);
    var rotation = M4x4.rotate(Math.degreesToRadians(obj.rotDegrees), obj.rotVector, M4x4.I);
    var local_transform = M4x4.mul(translation, rotation);
    return M4x4.mul(local_transform, parent_transform);
  };
  
  var addObject = function(obj) {
    children.push(obj);
    obj.parent = this;
  };
  var removeObject = function(obj) {
    var that = this;
    children.push(obj.children);
    obj.children.each(function(){
      this.parent = that;
    });
    obj.parent = null;
  };
  
  // not used right now
  // keeping it because I might need it later
  /*
  var applyTransform = function(matrix) {
    var vertices = obj.getVertices();
    var transformed_buffer = [];
    // restriction: faces are sent as tris only.
    for (var offset = 0; offset < vertices.length; offset += REDBACK.ELEMENT_SIZE) {
      face_vector = [vertices[0 + offset], vertices[1 + offset], vertices[2 + offset]];
      var multiplied_matrix = V3.mul4x4(matrix, face_vector);
      transformed_buffer = transformed_buffer.concat(multiplied_matrix).concat(vertices.slice(offset + 3, offset + REDBACK.ELEMENT_SIZE));
    };
    return {
      id: obj.id,
      vertices: transformed_buffer,
      indices: obj.getIndices(),
      lines: obj.getLines(),
      materials: obj.getMaterials()
    };
  }
  */
  
  that = {};
  initialize();
  that.parent = parent;
  that.children = children;
  that.addObject = addObject;
  that.removeObject = removeObject;
  that.getObject = getObject;
  that.getGlobalTransform = getGlobalTransform;
  return that;
};