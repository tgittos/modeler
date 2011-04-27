//This should be able to render anything that can pump
//vertices into a buffer, but right now type checks for
//Object3D
MODELER.WebGLRenderer = function(params, my) {
  var that, my = my || {},
  width = 800,
  height = 600,
  scene = null,
  camera = null,
  logged = false;
  
  var initialize = function() {
    // reassign gl to be our 
    if (!gl) {
      return;
    };
    document.body.appendChild(canvas);
    setSize();
    
    scene = params.scene;
    camera = params.camera;
    
    //Set some defaults for gl
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  };
  
  var setSize = function (pWidth, pHeight) {
    width = pWidth || width;
    height = pHeight || height;
    canvas.width = width;
    canvas.height = height;
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;  
  };
  var render = function () {
    // multiple viewport nonsense
    //glViewport(width/2,height/2,width/2,height/2);
    //glScissor(width/2,height/2,width/2,height/2);
    // render as per normal
    // repeat for each viewport
    
    //Set the viewport dimensions ?
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Set up the perspective of the rendered scene -> Camera
    //TODO: Move the defaults into the Camera class instead of here
    var perspectiveMatrix = M4x4.makePerspective(
      camera.getFov(),
      camera.getRatio(),
      camera.getNearClip(),
      camera.getFarClip()
    );
    if (!logged) { console.log('perspective matrix: ' + perspectiveMatrix.inspect()); }
    
    //Render out the objects in the buffers
    // multiple objects in a scene
    var objects = scene.getChildren();
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i];
      
      //Position of object
      var translationMatrix = M4x4.translate(V3.$(obj.x, obj.y, obj.z), M4x4.I);
      if (!logged) { console.log('translation matrix: ' + translationMatrix.inspect()); }
      //Rotation of object
      var rotationMatrix = M4x4.rotate(Math.degreesToRadians(obj.rotDegrees), obj.rotVector, translationMatrix);
      if (!logged) { console.log('rotation matrix: ' + rotationMatrix.inspect()); }
      var vertexMatrix = M4x4.mul(translationMatrix, rotationMatrix);
      if (!logged) { console.log('vertex matrix: ' + vertexMatrix.inspect()); }
      logged = true;

      drawObject(obj, perspectiveMatrix, vertexMatrix);
    }
  };
  var drawObject = function(obj, perspectiveMatrix, vertexMatrix) {
    assert(typeof obj.getForRender === 'function', "Not a renderable object");
    var render_array = obj.getForRender();
    // go through each material, get it's shader program
    // get the shader program, and the vertices the program applies to
    // and draw them to the screen
    render_array.each(function(){
      var shaderProgram = this.material.getShaderProgram();
      attachShaderProgram(shaderProgram);
      // tells the shader program which buffer to use for vertex data
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
      gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute, 
        MODELER.Object3D.VertexSize, 
        gl.FLOAT, false, 0, 0);
      // TODO: this whole section needs refactoring
      // tells the shader program which buffer to use for colour data
      var colours = [];
      var that = this;
      obj.getMeshes().each(function(){
        colours = colours.concat(that.material.applyToMesh(this));
      });
      var colourBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);
      gl.vertexAttribPointer(
        shaderProgram.vertexColorAttribute, 
        MODELER.Object3D.ColourSize, 
        gl.FLOAT, false, 0, 0);
      // tells the shader program about the perspective matrix
      gl.uniformMatrix4fv(
        shaderProgram.pMatrixUniform, 
        false, 
        new Float32Array(perspectiveMatrix)
      );
      // tells the shader about the vertex position matrix (move matrix)
      gl.uniformMatrix4fv(
        shaderProgram.mvMatrixUniform, 
        false, 
        new Float32Array(vertexMatrix)
      );
      //TODO: Refactor the obj.getForRender().elementIndices.length function
      //into something a little more sane
      if (this.material.wireframe) {
        //Render lines
        gl.lineWidth(1); //TODO: Remove hardcoded value
        var lineBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.lines), gl.STATIC_DRAW);
        gl.drawElements(gl.LINES, this.lines.length, gl.UNSIGNED_SHORT, 0);
      }
      //Render faces
      var faceBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.elementIndices), gl.STATIC_DRAW);
      gl.drawElements(gl.TRIANGLES, this.elementIndices.length, gl.UNSIGNED_SHORT, 0);
    });
  };
  
  var attachShaderProgram = function(program) {
    // this stuff should probably belong in the material, considering we use
    // attributes to map textures and colours and positions and things
    var shaderProgram = program;
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  };
    
  that = {};
  initialize();
  that.setSize = setSize;
  that.attachShaderProgram = attachShaderProgram;
  that.render = render;
  return that;
}