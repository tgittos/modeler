//Hierarchy goes as follows:
//Object3D -> Mesh -> Geometry -> Face3 || Face4 -> Vertex
//                 -> Material
//Mesh has multiple materials, with face/texel mappings
MODELER.Mesh = function(params, my) {
  var that, my = my || {},
  geometry_groups = {},
  materials = [],
  material_mappings = {};
  var initialize = function() {
    // expecting an array of geometry groups, with associated materials
    params.each(function(){
      if (this.name && this.geometry) {
        addGeometryGroup(this.name, this.geometry);
      }
      if (this.material) {
        addMaterial(this.material);
        mapMaterial(this.name, materials.indexOf(this.material));
      }
    });
  };
  var addGeometryGroup = function(name, geometry) {
    if (geometry_groups[name]) { throw 'Geometry group with name ' + name + ' already exists'; return; }
    geometry_groups[name] = geometry;
  };
  var addMaterial = function(material) {
    if (!materials.contains(material)) {
      materials.push(material);
    }
  };
  var mapMaterial = function(geometry_name, material_index) {
    material_mappings[geometry_name] = material_index;
  }
  var getForRender = function() {
    var render_array = [];
    for(var key in geometry_groups) {
      var value = geometry_groups[key];
      var geom_render_obj = value.getForRender(); // returns an object with vertices, elementIndices and lines
      var render_obj = {
        vertices: geom_render_obj.vertices,
        elementIndices: geom_render_obj.elementIndices,
        lines: geom_render_obj.lines,
        material: materials[material_mappings[key]]
      };
      render_array.push(render_obj);
    };
    return render_array;
  };
  that = {};
  initialize();
  that.getForRender = getForRender;
  return that;
}