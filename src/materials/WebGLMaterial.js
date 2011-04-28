// a WebGLMaterial has one shader and one or more textures
MODELER.Materials.WebGLMaterial = function(params, my) {
  var that, my = my || {},
  shader = null,
  // textures are stored with a name
  textures = {},
  ready = {
    shader: false,
    texture: false
  },
  wireframe = false;
  var initialize = function() {
    if (!params) { params = {}; }
    if (params.vertexShader && params.fragmentShader) {
      addShader(params.vertexShader, params.fragmentShader);
    };
    if (params.texture) {
      addTexture(params.texture.name, params.texture.image_path);
    };
    if (params.wireframe) { wireframe = params.wireframe; }
  };
  var addShader = function(vertexShader, fragmentShader){
    MODELER.Event.listen(MODELER.EVENTS.SHADER.PROGRAM_LOADED, function(d){
      var program = d.data;
      shader = program;
      ready.shader = true;
      loadedCheck();
    }, true);
    shader = MODELER.Materials.WebGLShader({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    shader.getShaderProgram();
  };
  var addTexture = function(name, image_path) {
    MODELER.Event.listen(MODELER.EVENTS.TEXTURE.LOAD_SUCCESS, function(d){
      var texture = d.data;
      textures[name] = texture;
      ready.texture = true;
      loadedCheck();
    }, true);
    MODELER.Materials.WebGLTexture({
      src: image_path
    });
  };
  var getShader = function() { return shader; };
  var loadedCheck = function() {
    if (ready.shader && ready.texture) {
      MODELER.Event.dispatch(MODELER.EVENTS.MATERIAL.MATERIAL_LOADED, getForRender());
    }
  };
  var getForRender = function() {
    // serialize the material down to an array of text/face pairs and a single shader program
    return {
      shaderProgram: shader,
      textures: textures
    };
  };
  that = {};
  initialize();
  that.wireframe = wireframe;
  that.addShader = addShader;
  that.addTexture = addTexture;
  that.getShader = getShader;
  that.getForRender = getForRender;
  return that;
}