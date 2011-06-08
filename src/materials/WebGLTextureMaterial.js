// a WebGLMaterial has one shader and one texture
// maybe it needs multiple textures, I don't know at this stage
MODELER.Materials.WebGLTextureMaterial = function(params, my) {
  var that, my = my || {},
  alpha = 1.0,
  texture = null,
  texels = [];
  
  var initialize = function() {
    if (params.texture) { texture = params.texture; }
    if (params.alpha) { alpha = params.alpha; }
  };
  var initShaderProgram = function() {
    my.shaderProgram.textureCoordAttribute = gl.getAttribLocation(my.shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(my.shaderProgram.textureCoordAttribute);
    
    my.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(my.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(my.shaderProgram.vertexPositionAttribute);

    // wireframe won't work without this, but this isn't in the shader program yet
    //my.shaderProgram.vertexColorAttribute = gl.getAttribLocation(my.shaderProgram, "aVertexColor");
    //gl.enableVertexAttribArray(my.shaderProgram.vertexColorAttribute);
    
    my.shaderProgram.samplerUniform = gl.getUniformLocation(my.shaderProgram, "uSampler");
    my.shaderProgram.alphaUniform = gl.getUniformLocation(my.shaderProgram, "uAlpha");
    my.shaderProgram.pMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uPMatrix");
    my.shaderProgram.mvMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uMVMatrix");
  };
  var setupShaderProgram = function(vertices) {
    // recieve a flat array of vertices
    // assume we get quads and process in 4 vertex chunks
    // 0, 0 bottom left
    // 1, 1 top right
    var face4_count = vertices.length / 4;
    for (var i = 0; i < face4_count; i++) {
      // static mapping of corners, maybe find another way to pass in the mapping?
      texels.push(
        0, 0,
        0, 1,
        1, 1,
        1, 0
      );
    };
  }; 
  var setDrawMode = function(mode) {
    if (mode == MODELER.Materials.DRAW_MODE.WIREFRAME) { 
      //pointShaderToArray(shaderProgram.vertexColorAttribute, my.edge_colour_buffer, MODELER.Object3D.ColourSize);
    } else {
      var TEXEL_SIZE = 2; // TODO: Move this to a constant somewhere
      // buffer the texels
      var texelBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texelBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texels), gl.STATIC_DRAW);
      // tell the shader program about the buffer
      my.pointShaderToArray(my.shaderProgram.textureCoordAttribute, texelBuffer, TEXEL_SIZE);
      // now set up gl to take the texture
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(my.shaderProgram.samplerUniform, 0); //Magic number 0? What is this?
      gl.uniform1f(my.shaderProgram.alphaUniform, alpha);
    }
  };
  
  params.shaders = {
    fragmentShader: MODELER.BASE + '/shaders/webgltexture.fshader',
    vertexShader: MODELER.BASE + '/shaders/webgltexture.vshader'
  };
  that = MODELER.Materials.WebGLMaterial(params, my);
  my.initShaderProgram = initShaderProgram;
  initialize();
  
  // overrides
  that.setupShaderProgram = setupShaderProgram;
  that.setDrawMode = setDrawMode;
  that.alpha = alpha;
  return that;
}