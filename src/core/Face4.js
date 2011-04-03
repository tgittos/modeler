//Like Face3, but with 4 vertices!
//See Face3
MODELER.Face4 = function(params, my){
  var that, my = {} || my;
  var initialize = function() {
    //TODO: Figure out if we can intelligently figure out which vertex belongs to which element
    //For now, just assume elements are specified in a sane order (clockwise)
    //Patch in one extra face, using the 4th vertex
    my.elements.push([0, 2, 3]);
  }
  that = MODELER.Face3.new(params, my);
  initialize();
  return that;
};