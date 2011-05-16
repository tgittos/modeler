MODELER.Sphere = function(params, my) {
  var that, my = my || {},
  longitudes = 8, latitudes = 8,
  radius = 2;
  
  var initialize = function() {
    longitudes = params.longitudes || longitudes;
    latitudes = params.latitudes || latitudes;
    radius = params.radius || radius;
    createMesh();
  };
  var createMesh = function() {
    // first and last latitudinal bands will be tris
    // the in betweens will be quads
    var vertices = [];
    var indices = [];
    for (var i = 0; i <= latitudes; i++) {
      var theta = i * Math.PI / latitudes;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var j = 0; j < longitudes; j++) {
        var phi = j * 2 * Math.PI / longitudes;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        
        vertices.push(radius * x);
        vertices.push(radius * y);
        vertices.push(radius * z);
      }
    }
    for (var i = 0; i < latitudes; i++) {
      for (var j = 0; j < longitudes; j++) {
        var first = (i * (longitudes + 1)) + j;
        var second = first + longitudes + 1;
        // 2 triangles
        indices.push(first);
        indices.push(second);
        indices.push(first + 1);

        indices.push(second);
        indices.push(second + 1);
        indices.push(first + 1);
      }
    }
    // set the vertices and the indices right onto the geometry
    var geometry = MODELER.Geometry();    
    geometry.setFace3s(vertices, indices);
    my.mesh = MODELER.Mesh([
      { name: "sphere", geometry: geometry, material: params.material }
    ]);
  };
  
  that = MODELER.Primitive(params, my);
  initialize();
  return that;
};