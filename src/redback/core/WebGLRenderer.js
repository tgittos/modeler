REDBACK.Core.WebGLRenderer = function(params, my) {
  var that, my = my || {},
  width = 800,
  height = 600,
  scene = null, // delete this?
  camera = null, // delete this?
  logged = false;
  
  // its not the responsibility of the renderer to prepare scenes for rendering
  // in terms of rotations, adding objects to other objects, etc.
  // the renderer just cares about getting vertices and faces (and maybe lines, if I keep them)
  // and sending them to the GPU
  // It does rely on some vertex/face conventions, such as vertices and faces and lines having offsets
  // and strides
  // so we need a render object template
  
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
    
    // TODO: CHANGES

    // 1. we dont need separate buffers for each object - this is slowing down the rendering
    // at the very least, we can stuff each object into the same buffer
    // and have at most 2 buffers - vertex and indices
    // Different objects with different shaders can be managed by specifying a buffer offset
    // in the drawElements call
    // gl.drawElements(gl.TRIANGLES, surface.elementCount, gl.UNSIGNED_SHORT, surface.indexOffset)
    // So bind the buffers once, then loop over the shaders and draw the appropriate elements
    // [DONE]

    // 2. line drawing can be implemented in the shader level, meaning we don't need to construct
    // a line buffer and send it in

    // 3. normals (when we have them) and texture coords (u, v) can be stuffed into the same
    // buffer as the vertices, and then point the shader to them
    // see: http://blog.tojicode.com/2011/05/interleaved-array-basics.html

    // 4. remove dependency on slow abstractions, operate only on buffers and WebGL objects
    // [DONE?]
    var buffers = scene.getRenderBuffers();
    
    //DEBUG
    if (!logged) {
      console.log(buffers.vertex);
      console.log('vertex: ' + buffers.vertex.length);
      console.log(buffers.index);
      console.log('index: ' + buffers.index.length);
      console.log(buffers.line);
      console.log('line: ' + buffers.line.length);
      console.log(buffers.material);
    }
    // END DEBUG
    
    // send vertices to a single buffer, once only
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffers.vertex), gl.STATIC_DRAW);
    
    // send indices to a single buffer, once only
    var faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(buffers.index), gl.STATIC_DRAW);
    
    // send lines to a single buffer, once only
    var lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(buffers.line), gl.STATIC_DRAW);

    buffers.material.each(function(){
      if(!logged) { 
        console.log('vertices sent to material: ' + buffers.vertex); 
        console.log('num vertices: ' + buffers.vertex.length);
      }
      
      this.material.setupShaderProgram(buffers.vertex, vertexBuffer);
      if(!logged) { console.log(this.material); }
      var shaderProgram = this.material.getShaderProgram();
      gl.useProgram(shaderProgram);
      
      // tell shader program which vertices to render
      // 12 stride because 3 floats per vertex at 4bytes each, starting at 0 index for each stride
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, REDBACK.VERTEX_SIZE, gl.FLOAT, false, REDBACK.VERTEX_STRIDE, REDBACK.VERTEX_OFFSET * REDBACK.VERTEX_BYTES);
      // tell shader program about the perspective matrix
      gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, new Float32Array(perspectiveMatrix));
      // tells the shader about the vertex position matrix (move matrix) (CONSIDER REMOVING FROM SHADER AND HERE)
      // THIS IS THE JOB OF THE SCENE GRAPH
      gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, new Float32Array(M4x4.I));
      
      // set blending/depth testing based on material transparency
      if (this.material.alpha < 1) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
      } else {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL); 
      }

      // render lines
      if (this.material.wireframe) {
        if (!logged) {
          console.log('line offset: ' + this.offsets.line);
          console.log('line counts: ' + this.counts.line);
          console.log('line buffer: ' + buffers.line);
          console.log('Now rendering: ' + buffers.line.slice(this.offsets.line / 2, this.offsets.line / 2 + this.counts.line)); 
        }
        this.material.setDrawMode(REDBACK.Enum.DRAW_MODE.WIREFRAME);
        gl.lineWidth(this.material.wireframe_width);
        if (!logged) { console.log('binding buffer ' + lineBuffer); }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer);
        gl.drawElements(gl.LINES, this.counts.line, gl.UNSIGNED_SHORT, this.offsets.line);
      }
      // render faces
      if (!this.material.wireframe || 
          (this.material.wireframe && this.material.wireframe_mode == REDBACK.Enum.WIREFRAME_MODE.BOTH)) {
        if (!logged) {
          console.log('face offset: ' + this.offsets.index);
          console.log('face counts: ' + this.counts.index);
          console.log('face buffer: ' + buffers.index);
          console.log('Now rendering: ' + buffers.index.slice(this.offsets.index / 2, this.offsets.index / 2 + this.counts.index)); 
        }
        this.material.setDrawMode(REDBACK.Enum.DRAW_MODE.TEXTURE);
        if (!logged) { console.log('binding buffer ' + faceBuffer); }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
        gl.drawElements(gl.TRIANGLES, this.counts.index, gl.UNSIGNED_SHORT, this.offsets.index);
      }
    });
    logged = true;
  };
    
  that = {};
  initialize();
  that.setSize = setSize;
  that.render = render;
  return that;
}