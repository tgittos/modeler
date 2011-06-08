//Basic material
//So far, just wireframing to allow building
//primitives easily
MODELER.Materials.WebGLSolidColourMaterial = function(params, my) { 
  var that, my = my || {},
  colour = [1, 1, 1, 1], //Solid white
  face_colour_buffer = null;
  function initialize() {
    if (params.colour)    { colour = params.colour; }
  };
  var initShaderProgram = function() {
    my.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(my.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(my.shaderProgram.vertexPositionAttribute);

    my.shaderProgram.vertexColorAttribute = gl.getAttribLocation(my.shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(my.shaderProgram.vertexColorAttribute);

    my.shaderProgram.pMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uPMatrix");
    my.shaderProgram.mvMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uMVMatrix");
  };
  var setupShaderProgram = function(vertices) {
    var face_colours = [];
    var edge_colours = [];
    vertices.each(function(){
      face_colours = face_colours.concat(colour);
      edge_colours = edge_colours.concat(my.wireframe_colour);
    });
    face_colour_buffer = bufferColour(face_colours);
    my.edge_colour_buffer = bufferColour(edge_colours);
  };
  var setDrawMode = function(mode) {
    if (mode == MODELER.Materials.DRAW_MODE.WIREFRAME) { 
      pointShaderToArray(shaderProgram.vertexColorAttribute, my.edge_colour_buffer, MODELER.Object3D.ColourSize);
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
  function inspect() {
    var string = '{';
    string += 'colour: ' + colour.inspect();
    string += ', wireframe: ' + wireframe;
    return string + '}';
  };
  
  // set some params as they go up to the parent object
  params.shaders = {
    fragmentShader: MODELER.BASE + '/shaders/webglcolour.fshader',
    vertexShader: MODELER.BASE + '/shaders/webglcolour.vshader'
  };
  that = MODELER.Materials.WebGLMaterial(params, my);
  my.initShaderProgram = initShaderProgram;
  initialize();
  
  // public stuff
  that.colour = colour;
  // overrides
  that.setupShaderProgram = setupShaderProgram;
  that.setDrawMode = setDrawMode;
  
  return that;
};