//Basic material
//So far, just wireframing to allow building
//primitives easily
MODELER.Materials = MODELER.Materials || {};
MODELER.Materials.Basic = function(params, my) {
  
  var that, my = my || {},
  wireframe = false,
  colour = [1, 1, 1, 1], //Solid white
  wireframe_colour = [0.5, 0.5, 0.5, 1], //muddy grey
  wireframe_mode = MODELER.Materials.Basic.WIREFRAME_MODE.WIREFRAME_ONLY,
  shaderProgram = null;
  function initialize() {
    if (params.wireframe) { wireframe = params.wireframe; }
    if (params.wireframe_mode) { wireframe_mode = params.wireframe_mode; }
    if (params.colour)    { colour = params.colour; }

        var shader = MODELER.WebGLShader({
          fragmentShader: '../src/shaders/Fragment.shader',
          vertexShader: '../src/shaders/Vertex.shader'
        }).getShaderProgram();
        MODELER.Event.listen(MODELER.EVENTS.SHADER.PROGRAM_LOADED, function(d) {
          shaderProgram = d.data;
      MODELER.Event.dispatch(MODELER.EVENTS.MATERIAL.MATERIAL_LOADED, shaderProgram);

        }, true);
  };
  function applyToMesh(mesh) {
    //Right now, we assume the whole mesh gets the material
    //In the future, we might want different geometry groups to get
    //different materials in a single mesh.
    var return_colours = {
      face_colours: [],
      edge_colours: []
    }
    var render_obj = mesh.getForRender();
    render_obj.each(function(){
      var mesh = this;
      mesh.vertices.each(function(){
        return_colours.face_colours = return_colours.face_colours.concat(colour);
        return_colours.edge_colours = return_colours.edge_colours.concat(wireframe_colour);
      });
    });
    return return_colours;
  };
  function getShaderProgram() { return shaderProgram; }
  function inspect() {
    var string = '{';
    string += 'colour: ' + colour.inspect();
    string += ', wireframe: ' + wireframe;
    return string + '}';
  };
  that = {};
  initialize();
  that.wireframe = wireframe;
  that.wireframe_mode = wireframe_mode;
  that.colour = colour;
  that.applyToMesh = applyToMesh;
  that.getShaderProgram = getShaderProgram;
  that.inspect = inspect;
  return that;
};
MODELER.Materials.Basic.WIREFRAME_MODE = {
  WIREFRAME_ONLY: 0,
  BOTH: 1
};