//Basic material
//So far, just wireframing to allow building
//primitives easily
MODELER.Materials = MODELER.Materials || {};
MODELER.Materials.Basic = function(params, my) {
  var that, my = my || {},
  wireframe = false,
  colour = $V([1, 1, 1, 1]); //Solid white
  function initialize() {
    if (params.wireframe) { wireframe = params.wireframe; }
    if (params.colour)    { colour = $V(params.colour); }
  };
  that = {};
  initialize();
  that.wireframe = wireframe;
  that.colour = colour;
  return that;
};