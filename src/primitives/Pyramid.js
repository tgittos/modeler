MODELER.Pyramid = function(params, my) {
  var that, my = my || {},
  mesh = null,
  x = 0, y = 0, z = 0,
  width = 0, height = 0, depth = 0;
  rotVector = null, rotDegrees = 0;
  
  function initialize(){
    if (params.width)       { width = params.width; };
    if (params.height)      { height = params.height; };
    if (params.depth)       { depth = params.depth; };
    if (params.x)           { x = params.x; };
    if (params.y)           { y = params.y; };
    if (params.z)           { z = params.z; };
    if (params.rotVector)   { rotVector = $V(params.rotVector); };
    if (params.rotDegrees)  { rotDegrees = params.rotDegrees; };
    var dimensions = {
      width: 2, height: 2, depth: 2
    };
    var geometry = MODELER.Geometry();
    geometry.addFace3(dimensions, { x: 45}/*, {z: depth / 2 }*/);
    //geometry.addFace3(dimensions, { y: 45 }/*, { y: width / -2 }*/);
    //geometry.addFace3(dimensions, { x: -45 }/*, { z: width / -2 }*/);
    //geometry.addFace3(dimensions, { z: -45, y: -90 }/*, { x: width / 2 }*/);
    //geometry.addFace4(dimensions, { x: 90 }, { y: height / -2 });
    mesh = MODELER.Mesh({
      geometry: geometry,
      material: params.material
    });
  };
  function getForRender() {
    return mesh.getForRender();
  };
  
  function getMeshes() { return [mesh]; }
  function inspect() {
    var string = '{';
    string += 'mesh: ' + mesh.inspect();
    return string + '}';
  };
  
  that = {}; //No inheriting
  initialize();
  that.getMeshes = getMeshes,
  that.getForRender = getForRender,
  that.inspect = inspect,
  that.x = x, that.y = y, that.z = z,
  that.rotDegrees = rotDegrees, that.rotVector = rotVector;
  return that;
};