var scene, camera, renderer;
var cube;
var lastTime = 0;
function pageLoaded() {
  
  scene = REDBACK.Core.WebGLSceneGraph();
  camera = MODELER.Camera();
  renderer = REDBACK.Core.WebGLRenderer( { scene: scene, camera: camera} );
  
  MODELER.Keyboard.Listener.start(cameraMove);
  
  // first load shaders
  MODELER.Event.listen(MODELER.EVENTS.FILEMANAGER.LOAD_PROGRESS, function(d){
    // log the progress
    console.log(d.data);
  });
	MODELER.Event.listen(MODELER.EVENTS.FILEMANAGER.LOAD_SUCCESS, fileManagerPreloaded);
	MODELER.IO.FileManager.preload([
		'/src/shaders/webgltexture.vshader',
		'/src/shaders/webgltexture.fshader',
		'/assets/textures/nehe.gif'
	]);
	
	function fileManagerPreloaded(){
		var cube_mat, cube_tex;
		cube_tex = REDBACK.Textures.WebGLTexture({
      image: MODELER.IO.FileManager.get('/assets/textures/nehe.gif')
    });
    console.log(cube_tex.getTexture());
    cube_mat = REDBACK.Materials.WebGLTextureMaterial({
      texture: cube_tex.getTexture()
    });
    cube = MODELER.Primitive.Cube({
      material: cube_mat
			,z: -10
			,rotVector: [1, 1, 0]
			,rotDegrees: 45
    });
    
    scene.addObject(cube);

    resizeViewport();
    render();
	}  
};
function render() {
  var timeNow = new Date().getTime();
  if (lastTime != 0) {
    var elapsed = timeNow - lastTime;
    
    //Do rendering magicks
    cube.rotDegrees += (90 * elapsed) / 1000.0;
  }
  lastTime = timeNow;

  //bail on render errors
  if (gl.getError() != 0) { return; }
  renderer.render();
  requestAnimationFrame(render);
};
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
function resizeViewport(e) {
  renderer.setSize(window.innerWidth - 4, window.innerHeight - 4);
};
window.onload = pageLoaded;
window.onresize = resizeViewport;