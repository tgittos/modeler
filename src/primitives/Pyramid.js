MODELER.Pyramid = function(params, my) {
  var that, my = my || {},
  mesh = null,
  x = 0, y = 0, z = 0,
  width = 0, height = 0, depth = 0;
  rotVector = V3.x, rotDegrees = 0;
  
  function initialize(){
    if (params.width)       { width = params.width; };
    if (params.height)      { height = params.height; };
    if (params.depth)       { depth = params.depth; };
    if (params.x)           { x = params.x; };
    if (params.y)           { y = params.y; };
    if (params.z)           { z = params.z; };
    if (params.rotVector)   { rotVector = params.rotVector; };
    if (params.rotDegrees)  { rotDegrees = params.rotDegrees; };
    var dimensions = {
      width: 2, height: 2, depth: 2
    };
    var sin60 = 0.866025404;
    var cos60 = 0.5;
    var adjusted_height = (height / -2) - ((height / -2) * sin60);
    //var hyp = height / 2;
    //var new_height = hyp * sin60;
    var geometry = MODELER.Geometry();
    geometry.createFace4(dimensions).rotate({degrees: 90, axis: V3.x}).translate({ y: height / -2 });
    geometry.createFace3(dimensions).rotate({ degrees: -30, axis: V3.x }).translate({ y: adjusted_height, z: depth / 2 * cos60 });
    geometry.createFace3(dimensions).rotate({ degrees: 90, axis: V3.y }).rotate({ degrees: 30, axis: V3.z }).translate({y: adjusted_height, x: depth / 2 * cos60 });
    geometry.createFace3(dimensions).rotate({ degrees: 30, axis: V3.x }).translate({ y: adjusted_height, z: depth / -2 * cos60 });
    geometry.createFace3(dimensions).rotate({ degrees: -90, axis: V3.y}).rotate({ degrees: -30, axis: V3.z }).translate({y: adjusted_height, x: depth / -2 * cos60 });
    
    mesh = MODELER.Mesh([
      { name: "pyramid", geometry: geometry, material: params.material }
    ]);
  };
  function getForRender() {
    return mesh.getForRender();
  };
  
  function getMeshes() { return [mesh]; }
  
  that = {}; //No inheriting
  initialize();
  that.getMeshes = getMeshes,
  that.getForRender = getForRender,
  that.x = x, that.y = y, that.z = z,
  that.rotDegrees = rotDegrees, that.rotVector = rotVector;
  return that;
};