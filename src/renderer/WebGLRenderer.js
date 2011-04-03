//This should be able to render anything that can pump
//vertices into a buffer, but right now type checks for
//Object3D

(function(m){
  m.WebGLRenderer = function (params) {
    var webGLContextString = 'experimental-webgl',
    canvas = document.createElement('canvas'),
    gl = null,
    width = 800,
    height = 600,
    vertex_buffers = {},
    face_buffers = {},
    colour_buffers = {},
    scene = null,
    camera = null,
    shaderProgram = null;
    
    //CONSTRUCTOR
    this.init = function(params) {
      //Get a rendering context
      try {
        gl = canvas.getContext(webGLContextString);
      } catch (e) { };
      if (!gl) {
        throw "Could not initialize WebGL. Does your browser support it?";
        return;
      };
      document.body.appendChild(canvas);
      this.setSize();
      
      scene = params.scene;
      camera = params.camera;
      
      //Load data into buffers on the GPU from the scene
      loadSceneIntoBuffers();
      initShader();
      
      //Set some defaults for gl
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    };
    
    //PUBLIC FUNCTIONS
    this.setSize = function (pWidth, pHeight) {
      width = pWidth || width;
      height = pHeight || height;
      canvas.width = width;
      canvas.height = height;
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;  
    };
    this.render = function () {
      //Set the viewport dimensions ?
      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      //Set up the perspective of the rendered scene -> Camera
      var perspectiveMatrix = gluPerspective(
        camera.getFov() || 45,
        camera.getRatio() || gl.viewportWidth / gl.viewportHeight,
        camera.getNearClip() || 0.1,
        camera.getFarClip() || 100.0
      );
      
      //Render out the objects in the buffers
      var objects = scene.getChildren();
      for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        
        //Position of object
        var translationMatrix = Matrix.Translation($V([obj.x, obj.y, obj.z])).ensure4x4();
        //Rotation of object
        var rotationMatrix = Matrix.Rotation(Math.degreesToRadians(obj.rotDegrees), obj.rotVector).ensure4x4();
        var vertexMatrix = translationMatrix.x(rotationMatrix);
        
        //Set current buffer to objects buffer
        //TODO: HERE!
        
        //Vertex positions
        var vertex_buffer = vertex_buffers[obj.getID()];
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.vertexAttribPointer(
          shaderProgram.vertexPositionAttribute, 
          MODELER.Object3D.VertexSize, 
          gl.FLOAT, false, 0, 0);
          
        //Vertex colours
        var colour_buffer = colour_buffers[obj.getID()];
        gl.bindBuffer(gl.ARRAY_BUFFER, colour_buffer);
        gl.vertexAttribPointer(
          shaderProgram.vertexColorAttribute, 
          MODELER.Object3D.ColourSize, 
          gl.FLOAT, false, 0, 0);
          
        //Object faces
        var face_buffer = face_buffers[obj.getID()];
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, face_buffer);
        
        //Send matricies for translation and perspective to vertex shader
        gl.uniformMatrix4fv(
          shaderProgram.pMatrixUniform, 
          false, 
          new Float32Array(perspectiveMatrix.flatten())
        );
        gl.uniformMatrix4fv(
          shaderProgram.mvMatrixUniform, 
          false, 
          new Float32Array(vertexMatrix.flatten())
        );
        //TODO: Refactor the obj.getForRender().elementIndices.length function
        //into something a little more sane
        gl.drawElements(gl.TRIANGLES, obj.getForRender().elementIndices.length, gl.UNSIGNED_SHORT, 0);
      }
    };
    
    //PRIVATE FUNCTIONS
    loadSceneIntoBuffers = function() {
      assert(scene, "scene is set");
      assert(scene instanceof m.Scene, "scene is not an instance of Scene");
      objects = scene.getChildren();
      objects.each(function(){
        sendObjectToBuffer(this);
      });
    };
    sendObjectToBuffer = function(obj) {
      assert(typeof obj.getForRender === 'function', "Not a renderable object");
      var renderBuffers = obj.getForRender();
      
      //Vertex position buffer
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(renderBuffers.vertices), gl.STATIC_DRAW);
      
      //Face buffer
      var faceBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderBuffers.elementIndices), gl.STATIC_DRAW);
      
      //Colour buffer
      var colourBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
      var colours = obj.flatten(obj.getColours());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);
      
      //Store the buffers for later drawing
      var obj_id = obj.getID();
      vertex_buffers[obj_id] = vertexBuffer;
      face_buffers[obj_id] = faceBuffer;
      colour_buffers[obj_id] = colourBuffer;
    };
    initShader = function() {
      var fragmentShader = loadShader('shader-fs', m.Shader.Type.Fragment);
      var vertexShader = loadShader('shader-vs', m.Shader.Type.Vertex);
  
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
    loadShader = function(filename, type) {
      /*
      var url = "../shaders/" + filename;
      var script = document.createElement('script');
      script.setAttribute("type", type);
      script.setAttribute("src", url);
      script.setAttribute("id", filename);
      document.getElementsByTagName("head")[0].appendChild(script);
      */
      
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
      if (shaderScript.type == m.Shader.Type.Fragment) {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == m.Shader.Type.Vertex) {
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
    
    this.init(params);
  }
})(MODELER);