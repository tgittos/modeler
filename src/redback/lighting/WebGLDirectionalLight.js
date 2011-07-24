REDBACK.Lighting.WebGLDirectionalLight = function(params, my) {
  var that, my = my || {},
  colour = [1.0, 1.0, 1.0], //default to white light
  ambientColour = [1.0, 1.0, 1.0],
  direction = null;
  
  var initialize = function(){
    if (params.colour) { colour = params.colour; }
    if (params.direction) { direction = params.direction; }
    if (params.ambientColour) { ambientColour = params.ambientColour; }
  };
  
  var getColour = function() { return colour; }
  var setColour = function(pColour) { colour = pColour; }
  var getDirection = function() { return direction; }
  var setDirection = function(pDirection) { direction = pDirection; }
  // maybe move the ambient colour to the scene?
  var getAmbientColour = function() { return ambientColour; }
  var setAmbientColour = function(pAmbientColour) { ambientColour = pAmbientColour; }

  that = {};
  initialize();
  
  that.getColour = getColour;
  that.setColour = setColour;
  that.getDirection = getDirection;
  that.setDirection = setDirection;
  that.getAmbientColour = getAmbientColour;
  that.setAmbientColour = setAmbientColour;
  
  return that;
}