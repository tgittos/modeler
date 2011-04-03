MODELER.Vertex = function(pos, my) {
  var that = {}, my = my || {},
  position = $V(pos);
  that.position = position;
  return that;
};