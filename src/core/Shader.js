MODELER.Shader = function(params, my) {
  var that, my = my || {};
  
  var initialize = function() { };
  
  that = {};
  initialize();
  return that;
};
MODELER.Shader.Type = {
  Fragment: 'x-shader/x-fragment',
  Vertex: 'x-shader/x-vertex'
};
