(function(m){
  m.Camera = function() {
    var fov = null, 
    ratio = null, 
    nearClip = null, 
    farClip = null;
    
    //CONSTRUCTOR
    this.init = function(pFov, pRatio, pNearClip, pFarClip) {
      fov = pFov;
      ratio = pRatio;
      nearClip = pNearClip;
      farClip = pFarClip;
    };
    //PUBLIC FUNCTIONS
    this.getFov = function() { return fov; };
    this.getRatio = function() { return ratio; };
    this.getNearClip = function() { return nearClip; };
    this.getFarClip = function() { return farClip; };
    
    this.init();
  };
})(MODELER);