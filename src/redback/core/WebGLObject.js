/*
  WebGLObject provides a basic framework for the requirements of WebGLSceneGraph,
  in terms of vertex buffers, face buffers, line buffers, u.v buffers, textures, etc.
*/
REDBACK.Core.WebGLObject = function(params, my) {
  var that, my = my || {},
  id = "",
  vertices = [],
  indices = [],
  lines = [],
  materials = [];
  
  var initialize = function() {
    if (params) {
      if (params.vertices) { setVertices(params.vertices); }
      if (params.indices) { setIndices(params.indices); }
      if (params.materials) { setMaterials(params.materials); }
      if (params.lines) { my.lines = params.lines; }
    }
  };
  
  var setVertices = function(pVertices) {
    my.vertices = my.vertices.concat(pVertices);
  };
  var setIndices = function(pIndices) {
    my.indices = my.indices.concat(pIndices);
    setLines(pIndices);
  };
  var setMaterials = function(pMaterials) {
    my.materials = my.materials.concat(pMaterials);
  };
  var setLines = function(pVertices) {
    // faces are defined in vertex triples, each one defining a triangle
    for(var offset = 0; offset < pVertices.length; offset += 3) {
      my.lines.push(pVertices[0 + offset], pVertices[1 + offset],
                 pVertices[1 + offset], pVertices[2 + offset],
                 pVertices[2 + offset], pVertices[0 + offset]);
     }
  };
  var getVertices = function()  { return my.vertices; };
  var getIndices = function()   { return my.indices; };
  var getLines = function()     { return my.lines; };
  var getMaterials = function() { return my.materials; };
  
  that = {};
  initialize();
  
  // protected
  my.id = id;
  my.vertices = vertices;
  my.indices = indices;
  my.lines = lines;
  my.materials = materials;
  
  // public
  that.id = id;
  that.setVertices = setVertices;
  that.setIndices = setIndices;
  that.setMaterials = setMaterials;
  that.getVertices = getVertices;
  that.getIndices = getIndices;
  that.getLines = getLines;
  that.getMaterials = getMaterials;
  
  return that;
};