//Like Face3, but with 4 vertices!
//See Face3
MODELER.Face4 = function(params, my){
  var that, my = {} || my;
  var initialize = function() {
    my.elements.push([0, 2, 3]);
    my.lines = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0]
    ];
  };
  var convertTo4x4 = function(m) {
    return M4x3.make4x4(m);
  };
  var ensure = function() {
    //Ensure the vertices are 4x3
    my.vertices = M4x4.left4x3(my.vertices);
  };
  that = MODELER.Face3(params, my);
  my.convertTo4x4 = convertTo4x4;
  my.ensure = ensure;
  initialize();
  return that;
};