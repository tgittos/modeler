//This is going to be an with a geometry with 6 Face4
//It's going to bootstrap itself up compositionally, rather than
//with an inheritence chain
//Perhaps make it with an .new method, like Ruby
//m.Cube.new = function() { make a cube }
MODELER.Cube = function(params, my) {
  var that, my = my || {},
  id = null,
  geometry = null,
  x = 0, y = 0, z = 0,
  width = 0, height = 0, depth = 0;
  rotVector = null, rotDegrees = 0;
  
  function initialize(){
    if (params.width)       { width = params.width; };
    if (params.height)      { height = params.height; };
    if (params.depth)       { depth = params.depth; };
    if (params.x)           { x = params.x; };
    if (params.y)           { y = params.y; };
    if (params.z)           { z = params.z; };
    if (params.rotVector)   { rotVector = params.rotVector; };
    if (params.rotDegrees)  { rotDegrees = params.rotDegrees; };
    geometry = MODELER.Geometry({
      faces: [
        createFace4(),
        createFace4({ y: 90 }, { x: width / -2 }),
        createFace4({ y: 180 }, { z: width / -2 }),
        createFace4({ y: 270 }, { x: width / 2 }),
        createFace4({ x: 90 }, { y: width / 2 }),
        createFace4({ x: -90 }, { y: width / -2 })
      ]
    });
  };
  function getForRender() {
    return geometry.getForRender();
  };
  function createFace4(rotation, translation) {
    //Center face around origin
    var matrix = $M([
      [width / -2,  height / -2,  depth / 2],
      [width / -2,  height / 2,   depth / 2],
      [width / 2,   height / 2,   depth / 2],
      [width / 2,   height / -2,  depth / 2]
    ]).ensure4x4();
    //Rotate the face
    if (rotation) {
      var rotVector = null, rotDegrees = null;
      if (rotation.x) { rotDegrees = Math.degreesToRadians(rotation.x); rotVector = Vector.create([1,0,0]); }
      if (rotation.y) { rotDegrees = Math.degreesToRadians(rotation.y); rotVector = Vector.create([0,1,0]); }
      var rot_matrix = Matrix.Rotation(Math.degreesToRadians(rotDegrees), rotVector).ensure4x4();
      matrix = matrix.x(rot_matrix);
    }
    //Translate the face
    if (translation) {
      var translation_vector = Vector.create([
        translation.x || 0, translation.y || 0, translation.z || 0
      ]);
      var trans_matrix = Matrix.Translation(translation_vector).ensure4x4();
      matrix = matrix.x(trans_matrix);
    }
    //Build the face
    return MODELER.Face4({
      vertices: matrix
    });
  };
  setID = function(value)  { id = id || value; };
  getID = function()       { return id; };
  initialize();
  that = {}; //No inheriting
  that.setID = setID;
  that.getID = getID;
  that.getForRender = getForRender;
  return that;
};