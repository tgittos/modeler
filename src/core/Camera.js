MODELER.Camera = function(params, my) {
  var that, my = my || {},
  fov = null,
  ratio = null,
  nearClip = null,
  farClip = null,
  x = 0, y = 0, z = 0;
  
  var initialize = function(){
    //Default params
    params = params || {};
    params.fov = params.fov || 45;
    params.ratio = params.ratio || 800 / 600; //Fixed ratio, independent of dimensions
    params.nearClip = params.nearClip || 0.1;
    params.farClip = params.farClip || 100.0;
    //Assign params
    if (params.fov)       { fov = params.fov; };
    if (params.ratio)     { ratio = params.ratio; };
    if (params.nearClip)  { nearClip = params.nearClip; };
    if (params.farClip)   { farClip = params.farClip; };
    if (params.x)         { x = params.x; };
    if (params.y)         { y = params.y; };
    if (params.z)         { z = params.z; };
  };
  var getFov = function() { return fov; };
  var getRatio = function() { return ratio; };
  var getNearClip = function() { return nearClip; };
  var getFarClip = function() { return farClip; };
  
  that = {};
  initialize();
  that.getFov = getFov;
  that.getRatio = getRatio;
  that.getNearClip = getNearClip;
  that.getFarClip = getFarClip;
  that.x = x; that.y = y; that.z = z;
  return that;
};