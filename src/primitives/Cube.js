//This is going to be an with a geometry with 6 Face4
//It's going to bootstrap itself up compositionally, rather than
//with an inheritence chain
//Perhaps make it with an .new method, like Ruby
//m.Cube.new = function() { make a cube }
MODELER.Cube = function(params, my) {
  var that, my = my || {},
  mesh = null,
  x = 0, y = 0, z = 0,
  width = 0, height = 0, depth = 0,
  rotVector = null, rotDegrees = 0;
  
  function initialize(){
    if (params.width)       { width = params.width; };
    if (params.height)      { height = params.height; };
    if (params.depth)       { depth = params.depth; };
    if (params.x)           { x = params.x; };
    if (params.y)           { y = params.y; };
    if (params.z)           { z = params.z; };
    if (params.rotVector)   { rotVector = params.rotVector; };
    if (params.rotDegrees)  { rotDegrees = params.rotDegrees; };
    var geometry = MODELER.Geometry();
    geometry.createFace4({ width: width, height: height }).translate({ z: depth / 2 });
    geometry.createFace4({ width: width, height: height }).rotate({ degrees: 90, axis: V3.y }).translate({ x: width / -2 });
    geometry.createFace4({ width: width, height: height }).rotate({ degrees: 180, axis: V3.y }).translate({ z: width / -2 });
    geometry.createFace4({ width: width, height: height }).rotate({ degrees: 270, axis: V3.y }).translate({ x: width / 2 });
    geometry.createFace4({ width: width, height: height }).rotate({ degrees: 90, axis: V3.x }).translate({ y: width / 2 });
    geometry.createFace4({ width: width, height: height }).rotate({ degrees: -90, axis: V3.x }).translate({ y: width / -2 });
    mesh = MODELER.Mesh([
      { name: "cube", geometry: geometry, material: params.material }
    ]);
  };
  function getForRender() {
    return mesh.getForRender();
  };
  function getMeshes() { return [mesh]; }
  initialize();
  that = {}; //No inheriting
  that.getMeshes = getMeshes,
  that.getForRender = getForRender,
  that.x = x, that.y = y, that.z = z,
  that.rotDegrees = rotDegrees, that.rotVector = rotVector;
  return that;
};