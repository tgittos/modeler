var MODELER = MODELER || {};
(function(){
  var webGLContextString = 'experimental-webgl';
  try {
    window.gl = document.createElement('canvas').getContext(webGLContextString);
  } catch (e) { };
  if (!gl) {
    throw "Could not initialize WebGL. Does your browser support it?";
  }; 
})();