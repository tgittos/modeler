MODELER.Vertex = function(params, my) {
  var that = null, my = my || {},
  position = Vector.Zero();
  var initialize = function() {
    //Accepts both an array of floats
    //or a vector
    if (params instanceof Vector) {
      position = params;
    } else {
      position = $V(params);
    }
  };
  var inspect = function() {
    var string = '{';
    string += 'position: ' + position.inspect();
    return string + '}';
  };
  that = {};
  initialize();
  that.position = position;
  that.inspect = inspect;
  return that;
};