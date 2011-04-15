//Basic material
//So far, just wireframing to allow building
//primitives easily
MODELER.Materials = MODELER.Materials || {};
MODELER.Materials.Basic = function(params, my) {
  var that, my = my || {},
  wireframe = false,
  colour = [1, 1, 1, 1]; //Solid white
  function initialize() {
    if (params.wireframe) { wireframe = params.wireframe; }
    if (params.colour)    { colour = params.colour; }
  };
  function applyToMesh(mesh) {
    //Right now, we assume the whole mesh gets the material
    //In the future, we might want different geometry groups to get
    //different materials in a single mesh.
    var flattened_colours = [];
    var render_obj = mesh.getForRender();
    render_obj.vertices.each(function(){
      flattened_colours = flattened_colours.concat(colour)
    });
    return flattened_colours;
  };
  function inspect() {
    var string = '{';
    string += 'colour: ' + colour.inspect();
    string += ', wireframe: ' + wireframe;
    return string + '}';
  };
  that = {};
  initialize();
  that.wireframe = wireframe;
  that.colour = colour;
  that.applyToMesh = applyToMesh;
  that.inspect = inspect;
  return that;
};