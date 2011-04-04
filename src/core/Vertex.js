MODELER.Vertex = function(params, my) {
  var that = null, my = my || {},
  position = Vector.Zero();
  initialize = function() {
    //Accepts both an array of floats
    //or a vector
    if (params instanceof Vector) {
      position = params;
    } else {
      position = $V(params);
    }
  };
  that = {};
  initialize();
  that.position = position;
  return that;
};