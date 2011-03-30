//This is going to be an Object3D, with a geometry with 6 quads
//It's going to bootstrap itself up compositionally, rather than
//with an inheritence chain
//Perhaps make it with an .new method, like Ruby
//m.Cube.new = function() { make a cube }
(function(m){
  m.Cube = function(params) {
    m.Object3D.call(this);
    
    this.init(params) {
      
    };
    this.init(params);
  };
  m.Cube.prototype = new m.Object3D();
  m.Cube.prototype.constructor = m.Cube;
})(MODELER);