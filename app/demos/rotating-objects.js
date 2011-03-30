function pageLoaded() {

  //DEBUG ONLY
  //$C = new MODELER.Debugger( { force: true } );
  //END DEBUG
  
  var scene = new MODELER.Scene();
  var camera = new MODELER.Camera();  

  //Send some geometry to the scene
  var pyramid = new MODELER.Object3D({
    vertices: [
      // Front face
      [0.0,  1.0,  0.0],
      [-1.0, -1.0,  1.0],
      [1.0, -1.0,  1.0],
      // Right face
      [0.0,  1.0,  0.0],
      [1.0, -1.0,  1.0],
      [1.0, -1.0, -1.0],
      // Back face
      [0.0,  1.0,  0.0],
      [1.0, -1.0, -1.0],
      [-1.0, -1.0, -1.0],
      // Left face
      [0.0,  1.0,  0.0],
      [-1.0, -1.0, -1.0],
      [-1.0, -1.0,  1.0]
    ],
    colours: [
      // Front face
      [1.0, 0.0, 0.0, 1.0],
      [0.0, 1.0, 0.0, 1.0],
      [0.0, 0.0, 1.0, 1.0],
      // Right face
      [1.0, 0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0, 1.0],
      [0.0, 1.0, 0.0, 1.0],
      // Back face
      [1.0, 0.0, 0.0, 1.0],
      [0.0, 1.0, 0.0, 1.0],
      [0.0, 0.0, 1.0, 1.0],
      // Left face
      [1.0, 0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0, 1.0],
      [0.0, 1.0, 0.0, 1.0]
    ],
    x: -1.5,
    y: 0.0,
    z: -7.0,
    rotVector: [0, 1, 0]
  });

  var square = new MODELER.Object3D({
    vertices: [
      // Front face
      [-1.0, -1.0,  1.0],
      [1.0, -1.0,  1.0],
      [1.0,  1.0,  1.0],
      [-1.0,  1.0,  1.0],

      // Back face
      [-1.0, -1.0, -1.0],
      [-1.0,  1.0, -1.0],
      [1.0,  1.0, -1.0],
      [1.0, -1.0, -1.0],

      // Top face
      [-1.0,  1.0, -1.0],
      [-1.0,  1.0,  1.0],
      [1.0,  1.0,  1.0],
      [1.0,  1.0, -1.0],

      // Bottom face
      [-1.0, -1.0, -1.0],
      [1.0, -1.0, -1.0],
      [1.0, -1.0,  1.0],
      [-1.0, -1.0,  1.0],

      // Right face
      [1.0, -1.0, -1.0],
      [1.0,  1.0, -1.0],
      [1.0,  1.0,  1.0],
      [1.0, -1.0,  1.0],

      // Left face
      [-1.0, -1.0, -1.0],
      [-1.0, -1.0,  1.0],
      [-1.0,  1.0,  1.0],
      [-1.0,  1.0, -1.0]
    ],
    colours: [
      [1.0, 0.0, 0.0, 1.0],     // Front face
      [1.0, 0.0, 0.0, 1.0],     // Front face
      [1.0, 0.0, 0.0, 1.0],     // Front face
      [1.0, 0.0, 0.0, 1.0],     // Front face
      [1.0, 1.0, 0.0, 1.0],     // Back face
      [1.0, 1.0, 0.0, 1.0],     // Back face
      [1.0, 1.0, 0.0, 1.0],     // Back face
      [1.0, 1.0, 0.0, 1.0],     // Back face
      [0.0, 1.0, 0.0, 1.0],     // Top face
      [0.0, 1.0, 0.0, 1.0],     // Top face
      [0.0, 1.0, 0.0, 1.0],     // Top face
      [0.0, 1.0, 0.0, 1.0],     // Top face
      [1.0, 0.5, 0.5, 1.0],     // Bottom face
      [1.0, 0.5, 0.5, 1.0],     // Bottom face
      [1.0, 0.5, 0.5, 1.0],     // Bottom face
      [1.0, 0.5, 0.5, 1.0],     // Bottom face
      [1.0, 0.0, 1.0, 1.0],     // Right face
      [1.0, 0.0, 1.0, 1.0],     // Right face
      [1.0, 0.0, 1.0, 1.0],     // Right face
      [1.0, 0.0, 1.0, 1.0],     // Right face
      [0.0, 0.0, 1.0, 1.0],     // Left face
      [0.0, 0.0, 1.0, 1.0],     // Left face
      [0.0, 0.0, 1.0, 1.0],     // Left face
      [0.0, 0.0, 1.0, 1.0]     // Left face
    ],
    //Faces are tri vertex indices, not an actual face
    faces: [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ],
    x: 1.5,
    y: 0.0,
    z: -7.0,
    rotVector: [1, 1, 0]
  });

  scene.addChild(pyramid);
  scene.addChild(square);

  var renderer = new MODELER.WebGLRenderer( { scene: scene, camera: camera} );

  //Render loop
  var lastTime = 0;
  function render() {
    window.requestAnimationFrame(render);
    
    //Rotation logic
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
      var elapsed = timeNow - lastTime;

      //Rotating at 90 degrees per second
      pyramid.rotDegrees += (90 * elapsed) / 1000.0;
      square.rotDegrees += (75 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
    
    renderer.render();
  }
  render();
  
}
window.onload = pageLoaded;