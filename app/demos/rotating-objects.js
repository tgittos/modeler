var renderer;
function pageLoaded() {

  var scene = MODELER.Scene();
  var camera = MODELER.Camera();
  
  var pyramid, cube;

  var material;
  material = MODELER.Materials.WebGLSolidColourMaterial({ 
    wireframe: true, 
    wireframe_mode: MODELER.Materials.WIREFRAME_MODE.WIREFRAME_ONLY
  });
  
  MODELER.Event.listen(MODELER.EVENTS.MATERIAL.MATERIAL_LOADED, function(d){
    //Send some geometry to the scene
    pyramid = MODELER.Pyramid({
      width: 2, height: 2, depth: 2,
      x: -1.5, y: 0.0, z: -5.0,
      rotVector: V3.y,
      material: material
    });
    scene.addChild(pyramid);

    cube = MODELER.Cube({
      width: 2, height: 2, depth: 2,
      x: 1.5, y: 0.0, z: -5.0,
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
      pyramid.rotDegrees += (90 * elapsed) / 1000.0;
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