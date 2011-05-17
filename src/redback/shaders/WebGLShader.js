// materials are comprised of texture files and shader files
// this material is the root of all webgl materials
// it allows you to specify vertex and fragment shaders for a material
// and any texture files required
REDBACK.Shaders.WebGLShader = function(params, my) {
  var that, my = my || {},
  vertexShader = null,
  fragmentShader = null,
  material = null,
  vertexShader_url = null, fragmentShader_url = null,
  vertexShader_src = null, fragmentShader_src = null;
  var initialize = function() {
    if (!params.vertexShader) { /* TODO: load default shader */ params.vertexShader = {}; }
    if (!params.fragmentShader) { /* TODO: load default shader */ params.fragmentShader = {}; }
    if (params.vertexShader) { vertexShader_url = params.vertexShader; }
    if (params.fragmentShader) { fragmentShader_url = params.fragmentShader; }
  };
  var getShaderProgram = function() {
    MODELER.Event.listen(MODELER.EVENTS.SYNCLOADER.LOAD_SUCCESS, shaderLoadSuccess, true);
    MODELER.Event.listen(MODELER.EVENTS.SYNCLOADER.LOAD_FAILURE, shaderLoadFailure, true);
    MODELER.IO.SyncLoader.loadFiles([vertexShader_url, fragmentShader_url]);
  };
  var shaderLoadSuccess = function(d){
    //unsub the failure listener
    MODELER.Event.stopListening(MODELER.EVENTS.SYNCLOADER.LOAD_FAILURE, shaderLoadFailure);
    
    vertexShader_src = d.data[0];
    fragmentShader_src = d.data[1];
    vertexShader = compileShader(vertexShader_src, MODELER.Shader.Type.Vertex);
    fragmentShader = compileShader(fragmentShader_src, MODELER.Shader.Type.Fragment);
    
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders: ", gl.getProgramInfoLog(shaderProgram));
    }
    MODELER.Event.dispatch(MODELER.EVENTS.SHADER.PROGRAM_LOADED, shaderProgram);
  };
  var shaderLoadFailure = function(urls){
    MODELER.Event.stopListening(MODELER.EVENTS.SYNCLOADER.LOAD_SUCCESS, shaderLoadSuccess);
    alert('failed to load ', url);
  };
  var compileShader = function(src, type) {
    var shader;
    if (type == MODELER.Shader.Type.Fragment) {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == MODELER.Shader.Type.Vertex) {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  that = {};
  initialize();
  that.getShaderProgram = getShaderProgram;
  return that;
};