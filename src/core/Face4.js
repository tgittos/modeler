//Like Face3, but with 4 vertices!
//See Face3
MODELER.Face4 = function(params, my){
  var that, my = {} || my;
  var initialize = function() {
    //TODO: Figure out if we can intelligently figure out which vertex belongs to which element
    //For now, just assume elements are specified in a sane order (clockwise)
    //Patch in one extra face, using the 4th vertex
    my.elements.push([0, 2, 3]);
    //Override lines array so that it doesn't draw a tri instead of a quad
    //also so we don't see 2 tris instead of one quad
    my.lines = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0]
    ];
  };
  that = MODELER.Face3(params, my);
  initialize();
  return that;
};