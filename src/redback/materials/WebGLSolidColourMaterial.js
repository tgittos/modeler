//Basic material
//So far, just wireframing to allow building
//primitives easily
REDBACK.Materials.WebGLSolidColourMaterial = function(params, my) { 
  var that, my = my || {},
  colour = [1.0, 1.0, 1.0, 1.0], //Solid white
  colour_buffer = null;
  function initialize() {
    if (params.colour)    { colour = params.colour; }
  };
  var initShaderProgram = function() {
    // assigning these attributes to variables on the shaderProgram is a construct from the learningwebgl blog
    // I can remove them and replace them with smarter checkes, such as seeing if the attribute is not null
    // See the webgl-md5 demo for more details
    my.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(my.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(my.shaderProgram.vertexPositionAttribute);

    my.shaderProgram.vertexColorAttribute = gl.getAttribLocation(my.shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(my.shaderProgram.vertexColorAttribute);

    my.shaderProgram.pMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uPMatrix");
    my.shaderProgram.mvMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uMVMatrix");
  };
  var logged = false;
  // TODO: I need to create one big colour map for all vertices
  // and buffer it once. Pool colours from all sorts of materials into one buffer, ordered by vertex index
  var setupShaderProgram = function(vertices) {
    var colours = [];
    for (var i = 0; i < vertices.length; i += REDBACK.ELEMENT_SIZE) {
      colours = colours.concat(colour).concat(my.wireframe_colour);
    };
    logged = true;
    colour_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colour_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);
  };
  var setDrawMode = function(mode) {
    gl.bindBuffer(gl.ARRAY_BUFFER, colour_buffer);
    // stride = 8 elements at 4 bytes each = 32
    // wireframe offset = 4 elements at 4 bytes each = 16
    if (mode == REDBACK.Enum.DRAW_MODE.WIREFRAME) { 
      gl.vertexAttribPointer(my.shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 32, 16);
    } else {
      gl.vertexAttribPointer(my.shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 32, 0);
    }
  };
  function inspect() {
    var string = '{';
    string += 'colour: ' + colour.inspect();
    string += ', wireframe: ' + wireframe;
    return string + '}';
  };
  
  // set some params as they go up to the parent object
  params.shaders = {
    fragmentShader: MODELER.BASE + 'shaders/webglcolour.fshader',
    vertexShader: MODELER.BASE + 'shaders/webglcolour.vshader'
  };
  my.initShaderProgram = initShaderProgram;
  that = REDBACK.Materials.WebGLMaterial(params, my);
  initialize();
  
  // public stuff
  that.colour = colour;
  // overrides
  that.setupShaderProgram = setupShaderProgram;
  that.setDrawMode = setDrawMode;
  
  return that;
};
