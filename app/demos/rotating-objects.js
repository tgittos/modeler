var renderer;
var cube, pyramid;
var lastTime = 0;
function pageLoaded() {
  
  var scene = REDBACK.Core.WebGLSceneGraph();
  var camera = MODELER.Camera();
  renderer = REDBACK.Core.WebGLRenderer( { scene: scene, camera: camera} );
  
  // first load shaders
	MODELER.Event.listen(MODELER.EVENTS.FILEMANAGER.LOAD_SUCCESS, fileManagerPreloaded);
	MODELER.IO.FileManager.preload([
		'/src/shaders/webglcolour.vshader',
		'/src/shaders/webglcolour.fshader'
	]);
	
	function fileManagerPreloaded(){
		
		var cube_mat, pyramid_mat;
    cube_mat = REDBACK.Materials.WebGLSolidColourMaterial({ 
      wireframe: true, 
      wireframe_mode: REDBACK.Enum.WIREFRAME_MODE.WIREFRAME_ONLY
    });
		pyramid_mat = REDBACK.Materials.WebGLSolidColourMaterial({
			wireframe: true,
			wireframe_mode: REDBACK.Enum.WIREFRAME_MODE.WIREFRAME_ONLY
		});
		
    cube = MODELER.Primitive.Cube({
      material: cube_mat
			,z: -10, x: 3
			,rotVector: [1, 1, 0]
			,rotDegrees: 45
    });
    pyramid = MODELER.Primitive.Pyramid({
      material: pyramid_mat
      ,z: -10, x: -3
      ,rotVector: [0, 1, 0]
      ,rotDegrees: 45
    });

    scene.addObject(pyramid);
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
    pyramid.rotDegrees += (90 * elapsed) / 1000.0;
  }
  lastTime = timeNow;

  renderer.render();
  requestAnimationFrame(render);
};
function resizeViewport(e) {
  renderer.setSize(window.innerWidth - 4, window.innerHeight - 4);
};
window.onload = pageLoaded;
window.onresize = resizeViewport;