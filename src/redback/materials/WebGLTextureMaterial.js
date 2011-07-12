// a WebGLMaterial has one shader and one texture
// maybe it needs multiple textures, I don't know at this stage
REDBACK.Materials.WebGLTextureMaterial = function(params, my) {
  var that, my = my || {},
  alpha = 1.0,
  texture = null,
  vertexBuffer = null;
  
  var initialize = function() {
    if (params.texture) { texture = params.texture; }
    if (params.alpha) { alpha = params.alpha; }
  };
  var initShaderProgram = function() {
    // assigning these attributes to variables on the shaderProgram is a construct from the learningwebgl blog
    // I can remove them and replace them with smarter checkes, such as seeing if the attribute is not null
    // See the webgl-md5 demo for more details
    
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
  var setupShaderProgram = function(vertices, pVertexBuffer) {
    //store a ref to the vertex buffer
    vertexBuffer = pVertexBuffer;
  }; 
  var setDrawMode = function(mode) {
    if (mode == REDBACK.Enum.DRAW_MODE.WIREFRAME) { 
      //pointShaderToArray(shaderProgram.vertexColorAttribute, my.edge_colour_buffer, MODELER.Object3D.ColourSize);
    } else {
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.vertexAttribPointer(my.shaderProgram.textureCoordAttribute, REDBACK.TEXEL_SIZE, gl.FLOAT, false, REDBACK.VERTEX_STRIDE, REDBACK.TEXEL_OFFSET * REDBACK.VERTEX_BYTES); //offsets are in bytes
      // now set up gl to take the texture
      // right now this only supports 1 texture
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(my.shaderProgram.samplerUniform, 0); //Magic number 0? What is this?
      gl.uniform1f(my.shaderProgram.alphaUniform, alpha);
    }
  };
  
  my.initShaderProgram = initShaderProgram;
  params.shaders = {
    fragmentShader: MODELER.BASE + 'shaders/webgltexture.fshader',
    vertexShader: MODELER.BASE + 'shaders/webgltexture.vshader'
  };
  that = REDBACK.Materials.WebGLMaterial(params, my);
  initialize();
  
  // overrides
  that.setupShaderProgram = setupShaderProgram;
  that.setDrawMode = setDrawMode;
  that.alpha = alpha;
  return that;
}
