/*
  WebGLObject provides a basic framework for the requirements of WebGLSceneGraph,
  in terms of vertex buffers, face buffers, line buffers, u.v buffers, textures, etc.
*/
REDBACK.Core.WebGLObject = function(params, my) {
  var that, my = my || {},
  vertices = [],
  indices = [],
  lines = [],
  materials = [];
  
  var initialize = function() {
    if (params) {
      if (params.vertices) { setVertices(params.vertices); }
      if (params.indices) { setIndices(params.indices); }
      if (params.materials) { setMaterials(params.materials); }
    }
  };
  
  var setVertices = function(pVertices) {
    vertices = vertices.concat(pVertices);
  };
  var setIndices = function(pIndices) {
    indices = indices.concat(pIndices);
    setLines(pIndices);
  };
  var setMaterials = function(pMaterials) {
    materials = materials.concat(pMaterials);
  };
  var setLines = function(pVertices) {
    // faces are defined in vertex triples, each one defining a triangle
    lines.push(pVertices[0], pVertices[1],
               pVertices[1], pVertices[2],
               pVertices[2], pVertices[0]);
  };
  var getVertices = function()  { return vertices; };
  var getIndices = function()   { return indices; };
  var getLines = function()     { return lines; };
  var getMaterials = function   { return materials; };
  
  that = {};
  initialize();
  
  // public functions
  that.setVertices = setVertices;
  that.setIndices = setIndices;
  that.setMaterials = setMaterials;
  that.getVertices = getVertices;
  that.getIndices = getIndices;
  that.getLines = getLines;
  that.getMaterials = getMaterials;
  
  return that;
};