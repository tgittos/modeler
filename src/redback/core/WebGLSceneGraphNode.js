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
    var transformedObject = obj.clone().applyTransform(getGlobalTransform());
    return transformedObject;
  }
  var getGlobalTransform = function() {
    var parent_transform = M4x4.I;
    if (parent) { parent_transform = parent.getGlobalTransform(); }
    return M4x4.mul(local_transform, parent_transform);
  }
  var setLocalTransform = function(transform) {
    local_transform = transform;
  }
  
  that = {};
  initialize();
  that.parent = parent;
  that.children = children;
  that.getTransformedObject = getTransformedObject;
  that.setLocalTransform = setLocalTransform;
  return that;
};