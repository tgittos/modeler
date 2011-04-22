var MODELER = MODELER || {};
MODELER.IO = MODELER.IO || {};

MODELER.webGLContextString = 'experimental-webgl';
(function(){
  try {
    window.canvas = document.createElement('canvas');
    window.gl = canvas.getContext(MODELER.webGLContextString);
  } catch (e) { };
  if (!gl) {
    throw "Could not initialize WebGL. Does your browser support it?";
  }; 
})();