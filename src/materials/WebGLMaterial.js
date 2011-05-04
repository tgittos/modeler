// base material for all WebGL materials
MODELER.Materials.WebGLMaterial = function(params, my) {
  var that, my = my || {},
  wireframe = false,
  wireframe_colour = [0.5, 0.5, 0.5, 1], //muddy grey
  wireframe_mode = MODELER.Materials.WIREFRAME_MODE.WIREFRAME_ONLY,
  wireframe_width = 2,
  shaderProgram = null,
  edge_colour_buffer = null;
  
  function initialize() {
    if (params.wireframe) { wireframe = params.wireframe; }
    if (params.wireframe_mode) { wireframe_mode = params.wireframe_mode; }
    if (params.wireframe_width) { wireframe_width = params.wireframe_width; }
    if (!params.shaders) { params.shaders = {}; }
    if (params.shaders.fragmentShader && params.shaders.vertexShader) {
      MODELER.WebGLShader({
        fragmentShader: params.shaders.fragmentShader,
        vertexShader: params.shaders.vertexShader
      }).getShaderProgram();
      MODELER.Event.listen(MODELER.EVENTS.SHADER.PROGRAM_LOADED, function(d) {
        my.shaderProgram = d.data;
        initShaderProgram();
        console.log('here');
        MODELER.Event.dispatch(MODELER.EVENTS.MATERIAL.MATERIAL_LOADED, shaderProgram);
      }, true);
    }
  };
  var initShaderProgram = function() {
    // this stuff should probably be migrated down into inherited materials
    my.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(my.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(my.shaderProgram.vertexPositionAttribute);
    
    my.shaderProgram.vertexColorAttribute = gl.getAttribLocation(my.shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(my.shaderProgram.vertexColorAttribute);

    my.shaderProgram.pMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uPMatrix");
    my.shaderProgram.mvMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uMVMatrix");
  };
  var setupShaderProgram = function(vertices) {
    // override this method in child materials, and call super
    var edge_colours = [];
    vertices.each(function(){
      edge_colours = edge_colours.concat(wireframe_colour);
    });
    edge_colour_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, edge_colour_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(edge_colours), gl.STATIC_DRAW);
  };
  var setDrawMode = function(mode) {
    // override this method in child materials, and call super
    if (mode == MODELER.Materials.DRAW_MODE.WIREFRAME) { 
      pointShaderToArray(my.shaderProgram.vertexColorAttribute, edge_colour_buffer, MODELER.Object3D.ColourSize);
    }
  };
  var pointShaderToArray = function(attribute, buffer, element_size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
      attribute, 
      element_size, 
      gl.FLOAT, false, 0, 0);
  };
  function getShaderProgram() { return my.shaderProgram; }
  function inspect() {
    var string = '{';
    string += 'colour: ' + colour.inspect();
    string += ', wireframe: ' + wireframe;
    return string + '}';
  };
  that = {};
  initialize();
  
  // 'protected' methods (shared down inheritence chain)
  my.wireframe = wireframe;
  my.wireframe_colour = wireframe_colour;
  my.wireframe_mode = wireframe_mode;
  my.wireframe_width = wireframe_width;
  my.shaderProgram = shaderProgram;
  my.edge_colour_buffer = edge_colour_buffer;
  my.initShaderProgram = initShaderProgram;
  my.setupShaderProgram = setupShaderProgram;
  my.setDrawMode = setDrawMode;
  
  // public methods
  that.wireframe = wireframe;
  that.wireframe_mode = wireframe_mode;
  that.wireframe_width = wireframe_width;
  that.getShaderProgram = getShaderProgram;
  that.setupShaderProgram = setupShaderProgram;
  that.setDrawMode = setDrawMode;
  that.inspect = inspect;
  
  return that;
};