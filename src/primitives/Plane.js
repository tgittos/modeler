MODELER.Plane = function(params, my) {
  var that, my = my || {},
  mesh = null,
  x = 0, y = 0, z = 0,
  width = 0, height = 0,
  rotVector = null, rotDegrees = 0;
  
  var initialize = function() {
    width = params.width || 2;
    height = params.height || 2;
    x = params.x || 0;
    y = params.y || 0;
    z = params.z || 0;
    rotVector = params.rotVector || [0, 0, 0];
    rotDegrees = params.rotDegrees || 0;
    createMesh();
  };
  var createMesh = function() {
    var geometry = MODELER.Geometry();
    geometry.createFace4({ width: width, height: height });
    mesh = MODELER.Mesh([
      { name: "plane", geometry: geometry, material: params.material }
    ]);
  };
  function getForRender() {
    return mesh.getForRender();
  };
  var getMeshes = function() { return [mesh]; }
  
  that = {}; //No inheriting
  initialize();
  that.getMeshes = getMeshes,
  that.getForRender = getForRender,
  that.x = x, that.y = y, that.z = z,
  that.rotDegrees = rotDegrees, that.rotVector = rotVector;
  return that;
  
};