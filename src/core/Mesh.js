//Hierarchy goes as follows:
//Object3D -> Mesh -> Geometry -> Face3 || Face4 -> Vertex
//                 -> Material
MODELER.Mesh = function(params, my) {
  var that, my = my || {},
  geometry = null,
  material = null;
  var initialize = function() {
    if (params.geometry) { geometry = params.geometry; }
    if (params.material) { material = params.material; }
  };
  var getForRender = function() {
    var render_obj = geometry.getForRender();
    render_obj.material = material;
    return render_obj;
  };
  var inspect = function() {
    var string = '{';
    string += 'geometry: ' + geometry.inspect();
    string += ', material: ' + material.inspect();
    return string + '}';
  };
  that = {};
  initialize();
  that.inspect = inspect;
  that.getForRender = getForRender;
  return that;
}