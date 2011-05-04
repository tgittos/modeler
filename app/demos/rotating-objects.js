function pageLoaded() {

  var scene = MODELER.Scene();
  var camera = MODELER.Camera();

  //Send some geometry to the scene
  var pyramid = MODELER.Pyramid({
    width: 2, height: 2, depth: 2,
    x: -1.5, y: 0.0, z: -5.0,
    rotVector: V3.y,
    material: MODELER.Materials.WebGLSolidColourMaterial({ wireframe: true })
  });
  scene.addChild(pyramid);
  
  var cube = MODELER.Cube({
    width: 2, height: 2, depth: 2,
    x: 1.5, y: 0.0, z: -5.0,
    rotVector: [1, 1, 0],
    rotDegrees: 45,
    material: MODELER.Materials.WebGLSolidColourMaterial({ wireframe: true })
  });
  scene.addChild(cube);
  
  var renderer = MODELER.WebGLRenderer( { scene: scene, camera: camera} );
  
  //Render loop
  var lastTime = 0;
  (function render() {
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
  })();
}
window.onload = pageLoaded;