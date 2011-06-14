var MODELER = MODELER || {};
MODELER.IO = MODELER.IO || {};
MODELER.Keyboard = MODELER.Keyboard || {};
MODELER.Primitive = MODELER.Primitive || {};

MODELER.webGLContextString = 'experimental-webgl';
MODELER.BASE = '/src/';

(function(){
  try {
    window.canvas = document.createElement('canvas');
    window.gl = WebGLDebugUtils.makeDebugContext(canvas.getContext(MODELER.webGLContextString));
    //window.gl = canvas.getContext(MODELER.webGLContextString);
  } catch (e) { };
  if (!gl) {
    throw "Could not initialize WebGL. Does your browser support it?";
  }; 
})();