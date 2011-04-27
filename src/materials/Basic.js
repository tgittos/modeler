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
  wireframe_width = 2,
  shaderProgram = null,
  face_colour_buffer = null,
  edge_colour_buffer = null;
  function initialize() {
    if (params.wireframe) { wireframe = params.wireframe; }
    if (params.wireframe_mode) { wireframe_mode = params.wireframe_mode; }
    if (params.wireframe_width) { wireframe_width = params.wireframe_width; }
    if (params.colour)    { colour = params.colour; }

    MODELER.WebGLShader({
      fragmentShader: '../src/shaders/Fragment.shader',
      vertexShader: '../src/shaders/Vertex.shader'
    }).getShaderProgram();
    MODELER.Event.listen(MODELER.EVENTS.SHADER.PROGRAM_LOADED, function(d) {
      shaderProgram = d.data;
      initShaderProgram();
      MODELER.Event.dispatch(MODELER.EVENTS.MATERIAL.MATERIAL_LOADED, shaderProgram);
    }, true);
  };
  var initShaderProgram = function() {
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  };
  var setupShaderProgram = function(vertices) {
    var face_colours = [];
    var edge_colours = [];
    vertices.each(function(){
      face_colours = face_colours.concat(colour);
      edge_colours = edge_colours.concat(wireframe_colour);
    });
    face_colour_buffer = bufferColour(face_colours);
    edge_colour_buffer = bufferColour(edge_colours);
  };
  var setDrawMode = function(mode) {
    if (mode == MODELER.Materials.Basic.DRAW_MODE.WIREFRAME) { 
      pointShaderToArray(shaderProgram.vertexColorAttribute, edge_colour_buffer, MODELER.Object3D.ColourSize);
    } else {
      pointShaderToArray(shaderProgram.vertexColorAttribute, face_colour_buffer, MODELER.Object3D.ColourSize);
    }
  };
  var bufferColour = function(colour) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colour), gl.STATIC_DRAW);
    return buffer;
  };
  var pointShaderToArray = function(attribute, buffer, element_size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
      attribute, 
      element_size, 
      gl.FLOAT, false, 0, 0);
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
  that.wireframe_width = wireframe_width;
  that.colour = colour;
  that.getShaderProgram = getShaderProgram;
  that.setupShaderProgram = setupShaderProgram;
  that.setDrawMode = setDrawMode;
  that.inspect = inspect;
  return that;
};
MODELER.Materials.Basic.WIREFRAME_MODE = {
  WIREFRAME_ONLY: 0,
  BOTH: 1
};
MODELER.Materials.Basic.DRAW_MODE = {
  WIREFRAME: 0,
  TEXTURE: 1
}