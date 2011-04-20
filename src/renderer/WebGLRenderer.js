//This should be able to render anything that can pump
//vertices into a buffer, but right now type checks for
//Object3D
MODELER.WebGLRenderer = function(params, my) {
  var that, my = my || {},
  width = 800,
  height = 600,
  vertex_buffers = {},
  face_buffers = {},
  colour_buffers = {},
  line_buffers = {},
  scene = null,
  camera = null,
  shaderProgram = null,
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
    
    //Load data into buffers on the GPU from the scene
    loadSceneIntoBuffers();
    //initShader();
    
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
      if (!logged) { 
        console.log('shader program: ');
        console.log(shaderProgram);
      }
      logged = true;

      //Set current buffer to objects buffer
      //TODO: HERE!
      
      //Vertex positions
      var vertex_buffer = vertex_buffers[obj.id];
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute, 
        MODELER.Object3D.VertexSize, 
        gl.FLOAT, false, 0, 0);
        
      //Vertex colours
      var colour_buffer = colour_buffers[obj.id];
      gl.bindBuffer(gl.ARRAY_BUFFER, colour_buffer);
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
        var line_buffer = line_buffers[obj.id];
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, line_buffer);
        gl.drawElements(gl.LINES, obj.getForRender().lines.length, gl.UNSIGNED_SHORT, 0);
      } else {
        //Render faces
        var face_buffer = face_buffers[obj.id];
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, face_buffer);
        gl.drawElements(gl.TRIANGLES, obj.getForRender().elementIndices.length, gl.UNSIGNED_SHORT, 0);
      }
    }
  };
  var loadSceneIntoBuffers = function() {
    assert(scene, "scene is not set");
    assert(typeof scene.getChildren === 'function', "scene does not implement getChildren");
    objects = scene.getChildren();
    objects.each(function(){
      sendObjectToBuffer(this);
    });
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
    console.log('colours: ' + colours.inspect());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);
    
    //Store the buffers for later drawing
    vertex_buffers[obj.id] = vertexBuffer;
    face_buffers[obj.id] = faceBuffer;
    line_buffers[obj.id] = lineBuffer;
    colour_buffers[obj.id] = colourBuffer;
  };
  
  var attachShaderProgram = function(program) {
    shaderProgram = program;
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  }
  
  /*
  var initShader = function() {
    var fragmentShader = loadShader('shader-fs', MODELER.Shader.Type.Fragment);
    var vertexShader = loadShader('shader-vs', MODELER.Shader.Type.Vertex);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  };
  // Adapted from learningwebgl.com
  var loadShader = function(filename, type) {
    
    var shaderScript = document.getElementById(filename);
    if (!shaderScript) {
      return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == MODELER.Shader.Type.Fragment) {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == MODELER.Shader.Type.Vertex) {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  */
    
  that = {};
  initialize();
  that.setSize = setSize;
  that.attachShaderProgram = attachShaderProgram;
  that.render = render;
  return that;
}