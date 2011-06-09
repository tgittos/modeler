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
    var transformedObject = obj.clone();
    transformedObject.applyTransform(getGlobalTransform());
    return transformedObject;
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
    var vertices = my.vertices;
    var transformed_buffer = [];
    // restriction: faces are sent as tris only.
    // 9 = x, y, z of 3 vertices
    for (var offset = 0; offset < vertices.length; offset += 9) {
      face_matrix = [
        vertices[0 + offset], vertices[1 + offset], vertices[2 + offset], 0,
        vertices[3 + offset], vertices[4 + offset], vertices[5 + offset], 0,
        vertices[6 + offset], vertices[7 + offset], vertices[8 + offset], 0,
        0, 0, 0, 0
      ];
      transformed_buffer = transformed_buffer.concat(
        M4x4.mul(face_matrix, matrix)
      );
    };
    return transformed_buffer;
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