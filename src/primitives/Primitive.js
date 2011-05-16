MODELER.Primitive = function(params, my) {
  var that, my = my || {},
  mesh = null,
  x = 0, y = 0, z = 0,
  rotVector = V3.y, rotDegrees = 0;
  function getForRender() {
    return my.mesh.getForRender();
  };
  function getMeshes() { return [my.mesh]; }
  that = {};
  my.mesh = mesh;
  my.x = x; my.y = y; my.z = z;
  my.rotVector = rotVector; my.rotDegrees = rotDegrees;
  that.x = my.x; that.y = my.y; that.z = my.z;
  that.rotVector = my.rotVector; that.rotDegrees = my.rotDegrees;
  that.getForRender = getForRender;
  that.getMeshes = getMeshes;
  return that;
};