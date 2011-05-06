var renderer;
function pageLoaded() {

  var scene = MODELER.Scene();
  var camera = MODELER.Camera();
  
  function cameraMove(e) {
    var key = e.which; //GOOD FOR MAC ONLY SO FAR
    switch (key) {
      // todo: move this to a camera.moveForward and camera.lookAt model
      // todo: make the rendering of the movement interpolate much better, for less
      // jerky movement
      case MODELER.EVENTS.KEYBOARD.W: camera.z += 0.5; break;
      case MODELER.EVENTS.KEYBOARD.A: camera.x += 0.5; break;
      case MODELER.EVENTS.KEYBOARD.S: camera.z -= 0.5; break;
      case MODELER.EVENTS.KEYBOARD.D: camera.x -= 0.5; break;
    }
  }
  MODELER.Keyboard.Listener.start(cameraMove);
  
  var cube;
  
  var texture = MODELER.Materials.WebGLTexture({
    src: '../assets/textures/nehe.gif'
  });
  
  MODELER.Event.listen(MODELER.EVENTS.TEXTURE.TEXTURE_LOADED, function(d){
    material = MODELER.Materials.WebGLTextureMaterial({
      texture: d.data
    });
  });      
  
  MODELER.Event.listen(MODELER.EVENTS.MATERIAL.MATERIAL_LOADED, function(d){
    cube = MODELER.Cube({
      width: 2, height: 2, depth: 2,
      x: 0, y: 0.0, z: -5.0,
      rotVector: [1, 1, 0],
      rotDegrees: 45,
      material: material
    });
    scene.addChild(cube);
    render();
  }, true);
  
  renderer = MODELER.WebGLRenderer( { scene: scene, camera: camera} );
  resizeViewport();
  
  //Render loop
  var lastTime = 0;
  function render() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
      var elapsed = timeNow - lastTime;
      
      //Do rendering magicks
      cube.rotDegrees += (90 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
    
    renderer.render();
    requestAnimationFrame(render);
  };
};
function resizeViewport(e) {
  renderer.setSize(window.innerWidth - 4, window.innerHeight - 4);
};
window.onload = pageLoaded;
window.onresize = resizeViewport;