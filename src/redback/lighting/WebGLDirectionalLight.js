/*
  Lighting is implemented in the shader
  It's kind of like a material, in that it has a shader program, and 
  params you send to the shader program.
  But it applies to all geometry in the scene, rather than just a selection
  of vertices as a material does.
*/
REDBACK.Lighting.WebGLDirectionalLight = function(params, my) {
  var that, my = my || {};
  var initialize = function(){
    
  };
  that = {};
  initialize();
  return that;
}