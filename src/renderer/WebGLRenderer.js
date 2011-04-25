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
      var buffers = sendObjectToBuffer(obj);
      
      //Position of object
      var translationMatrix = M4x4.translate(V3.$(obj.x, obj.y, obj.z), M4x4.I);
      if (!logged) { console.log('translation matrix: ' + translationMatrix.inspect()); }
      //Rotation of object
      var rotationMatrix = M4x4.rotate(Math.degreesToRadians(obj.rotDegrees), obj.rotVector, translationMatrix);
      if (!logged) { console.log('rotation matrix: ' + rotationMatrix.inspect()); }
      var vertexMatrix = M4x4.mul(translationMatrix, rotationMatrix);
      if (!logged) { console.log('vertex matrix: ' + vertexMatrix.inspect()); }
      logged = true;

      //Set current buffer to objects buffer
      //TODO: HERE!
      
      //each object may have multiple meshes
      //each mesh may have multiple materials
      //each material will have textures and a shader program
      //rendering seems to rely heavily on the shader program,
      //so vertices are rendered deep in this loop.
      
      //for now, I have only single mesh/material capability,
      // but this will be fixed in the future
      var shaderProgram = obj.getMeshes()[0].getMaterial().getShaderProgram();
      attachShaderProgram(shaderProgram);
      
      //Vertex positions
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
      gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute, 
        MODELER.Object3D.VertexSize, 
        gl.FLOAT, false, 0, 0);
        
      //Vertex colours
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colour);
      gl.vertexAttribPointer(
        shaderProgram.vertexColorAttribute, 
        MODELER.Object3D.ColourSize, 
        gl.FLOAT, false, 0, 0);
      
      //Send matricies for translation and perspective to vertex shader
      gl.uniformMatrix4fv(
        shaderProgram.pMatrixUniform, 
        false, 
        new Float32Array(perspectiveMatrix)
      );
      gl.uniformMatrix4fv(
        shaderProgram.mvMatrixUniform, 
        false, 
        new Float32Array(vertexMatrix)
      );
      //TODO: Refactor the obj.getForRender().elementIndices.length function
      //into something a little more sane
      var material = obj.getForRender().material;
      if (material && material.wireframe) {
        //Render lines
        gl.lineWidth(1); //TODO: Remove hardcoded value
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.line);
        gl.drawElements(gl.LINES, obj.getForRender().lines.length, gl.UNSIGNED_SHORT, 0);
      } else {
        //Render faces
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.face);
        gl.drawElements(gl.TRIANGLES, obj.getForRender().elementIndices.length, gl.UNSIGNED_SHORT, 0);
      }
    }
  };
  var sendObjectToBuffer = function(obj) {
    assert(typeof obj.getForRender === 'function', "Not a renderable object");
    var renderBuffers = obj.getForRender();
    //console.log(renderBuffers);
    
    //Vertex position buffer
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(renderBuffers.vertices), gl.STATIC_DRAW);
    
    //Face buffer
    var faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderBuffers.elementIndices), gl.STATIC_DRAW);
    
    //Line buffer
    var lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderBuffers.lines), gl.STATIC_DRAW);
    
    //Colour buffer
    var colourBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
    var colours = []
    obj.getMeshes().each(function(){
      colours = colours.concat(renderBuffers.material.applyToMesh(this));
    });
    //console.log('colours: ' + colours.inspect());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);

    return {
      vertex: vertexBuffer,
      face: faceBuffer,
      line: lineBuffer,
      colour: colourBuffer
    };
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