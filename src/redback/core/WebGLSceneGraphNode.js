REDBACK.Core.WebGLSceneGraphNode = function(params, my) {
  var that, my = my || {},
  obj = null,
  parent = null,
  children = [],
  local_transform = M4x4.I;
  
  var initialize = function() {
    if (params) {
      if (params.obj) { obj = params.obj; }
    }
  };
  var getTransformedObject = function() {
    return applyTransform(getGlobalTransform());
  };
  var getGlobalTransform = function() {
    var parent_transform = M4x4.I;
    if (parent) { parent_transform = parent.getGlobalTransform(); }
    return M4x4.mul(local_transform, parent_transform);
  };
  var setLocalTransform = function(transform) {
    local_transform = transform;
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
  var applyTransform = function(matrix) {
    var vertices = obj.getVertices();
    
    var transformed_buffer = [];
    // restriction: faces are sent as tris only.
    for (var offset = 0; offset < vertices.length; offset += 3) {
      face_matrix = [vertices[0 + offset], vertices[1 + offset], vertices[2 + offset], 0];
      var multiplied_matrix = M4x4.mul(matrix, face_matrix);
      transformed_buffer = transformed_buffer.concat(
        [multiplied_matrix[0], multiplied_matrix[1], multiplied_matrix[2]]
      );
    };
    return {
      vertices: transformed_buffer,
      indices: obj.getIndices(),
      lines: obj.getLines(),
      materials: obj.getMaterials()
    };
  }
  
  that = {};
  initialize();
  that.parent = parent;
  that.children = children;
  that.getTransformedObject = getTransformedObject;
  that.setLocalTransform = setLocalTransform;
  that.addObject = addObject;
  that.removeObject = removeObject;
  return that;
};