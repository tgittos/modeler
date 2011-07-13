/*
  Lighting is implemented in the shader
  It's kind of like a material, in that it has a shader program, and 
  params you send to the shader program.
  But it applies to all geometry in the scene, rather than just a selection
  of vertices as a material does.
*/
REDBACK.Lighting.WebGLDirectionalLight = function(params, my) {
  var that, my = my || {},
  colour: [1.0, 1.0, 1.0], //default to white light
  direction: null;
  
  var initialize = function(){
    if (params.colour) { colour = params.colour; }
    if (params.direction) { direction = params.direction; }
    /*
    Compute normal matrix - should probably live in the scene graph
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    */
  };
  
  var getColour = function() { return colour; }
  var setColour = function(pColour) { colour = pColour; }
  var getDirection = function() { return direction; }
  var setDirection = function(pDirection) { direction = pDirection; }
  var initShaderProgram = function() {
    // assigning these attributes to variables on the shaderProgram is a construct from the learningwebgl blog
    // I can remove them and replace them with smarter checks, such as seeing if the attribute is not null
    // See the webgl-md5 demo for more details
    
    my.shaderProgram.textureCoordAttribute = gl.getAttribLocation(my.shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(my.shaderProgram.textureCoordAttribute);
    
    my.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(my.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(my.shaderProgram.vertexPositionAttribute);
    
    my.shaderProgram.vertexNormalAttribute = gl.getAttributeLocation(my.shaderProgram, "aVertexNormal");
    gl.enableVertexArrtribArray(my.shaderProgram.vertexNormalAttribute);
    
    my.shaderProgram.samplerUniform = gl.getUniformLocation(my.shaderProgram, "uSampler");
    my.shaderProgram.pMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uPMatrix");
    my.shaderProgram.mvMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uMVMatrix");
    my.shaderProgram.nMatrixUniform = gl.getUniformLocation(my.shaderProgram, "uNMatrix");
    my.shaderProgram.lightingDirection = gl.getUniformLocation(my.shaderProgram, "uLightingDirection");
    my.shaderProgram.directionalColor = gl.getUniformLocation(my.shaderProgram, "uDirectionalColor");
  };
  
  my.initShaderProgram = initShaderProgram;
  params.shaders = {
    fragmentShader: MODELER.BASE + 'shaders/webgldirectionallighting.fshader',
    vertexShader: MODELER.BASE + 'shaders/webgldirectionallighting.vshader'
  };
  that = REDBACK.Materials.WebGLMaterial(params, my);
  initialize();
  
  return that;
}