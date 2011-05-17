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
    var cameraPositionMatrix = M4x4.translate(V3.$(camera.x, camera.y, camera.z), M4x4.I);
    if (!logged) { console.log('camera pos matrix: ' + cameraPositionMatrix.inspect()); }
    if (!logged) { console.log('perspective matrix: ' + perspectiveMatrix.inspect()); }
    
    //Render out the objects in the buffers
    // multiple objects in a scene
    var objects = scene.getChildren();
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i];
      
      //Position of object
      //var translationMatrix = M4x4.translate(V3.$(obj.x, obj.y, obj.z), M4x4.I);
      var translationMatrix = M4x4.translate(V3.$(obj.x, obj.y, obj.z), cameraPositionMatrix);
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
      this.material.setupShaderProgram(this.vertices);
      var shaderProgram = this.material.getShaderProgram();
      gl.useProgram(shaderProgram);
      // tells the shader program which buffer to use for vertex data
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
      gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute, 
        MODELER.Object3D.VertexSize, 
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
      
      // set blending/depth testing based on material transparency
      if (this.material.alpha < 1) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
      } else {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL); 
      }

      if (this.material.wireframe) {
        this.material.setDrawMode(MODELER.Materials.DRAW_MODE.WIREFRAME);
        //Render lines
        gl.lineWidth(this.material.wireframe_width);
        var lineBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.lines), gl.STATIC_DRAW);
        gl.drawElements(gl.LINES, this.lines.length, gl.UNSIGNED_SHORT, 0);
      }
      if (!this.material.wireframe || 
          (this.material.wireframe && this.material.wireframe_mode == MODELER.Materials.WIREFRAME_MODE.BOTH)) {
        this.material.setDrawMode(MODELER.Materials.DRAW_MODE.TEXTURE);
        //Render faces
        var faceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.elementIndices), gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, this.elementIndices.length, gl.UNSIGNED_SHORT, 0);
      }
    });
  };
    
  that = {};
  initialize();
  that.setSize = setSize;
  that.render = render;
  return that;
}