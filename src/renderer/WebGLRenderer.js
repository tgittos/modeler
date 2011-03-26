(function(m){
  m.WebGLRenderer = function (params) {
    var webGLContextString = 'experimental-webgl',
    canvas = document.createElement('canvas'),
    gl = null,
    width = 800,
    height = 600,
    buffers = {},
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
    this.getCanvas = function() { return canvas; }
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
      var pMatrix = gluPerspective(
        camera.getFov() || 45,
        camera.getRatio() || gl.viewportWidth / gl.viewportHeight,
        camera.getNearClip() || 0.1,
        camera.getFarClip() || 100.0
      );
      
      //Render out the objects in the buffers
      var objects = scene.getChildren();
      for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        
        var m = Matrix.Translation($V([obj.x, obj.y, obj.z])).ensure4x4();
        var objMvMatrix = Matrix.I(4).x(m); //Matrix multiplication
        
        //Set current buffer to objects buffer
        //TODO: HERE!
        var buffer = buffers[obj.getID()];
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(
          shaderProgram.vertexPositionAttribute, 
          obj.getVertexDimensions(), 
          gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(
          shaderProgram.pMatrixUniform, 
          false, 
          new Float32Array(pMatrix.flatten())
        );
        gl.uniformMatrix4fv(
          shaderProgram.mvMatrixUniform, 
          false, 
          new Float32Array(objMvMatrix.flatten())
        );
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, obj.getVertices().length);
        //gl.drawArrays(gl.TRIANGLES, 0, obj.getVertices().length);
      }
    };
    
    //PRIVATE FUNCTIONS
    loadSceneIntoBuffers = function() {
      assert(scene, "scene is set");
      assert(scene instanceof m.Scene, "scene is instance of Scene");
      objects = scene.getChildren();
      objects.each(function(){
        sendObjectToBuffer(this);
      });
    };
    sendObjectToBuffer = function(obj) {
      assert(obj instanceof m.Object3D);
      var vertexBuffer = gl.createBuffer();
      buffers[obj.getID()] = vertexBuffer;
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      var vertices = obj.flatten();
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
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
