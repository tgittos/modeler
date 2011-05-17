// texture for a WebGL based material. 
// handles loading and storage only
// material is responsible for applying the texture.

// this isn't so much a texture, as it is a texture loader
// we never use this once it loads the texture
REDBACK.Textures.WebGLTexture = function(params, my) {
  var that, my = my || {},
  src = null,
  texture = null;
  var initialize = function(){
    if (!params) { params = {}; }
    if (params.src) { src = params.src; }
    load();
  };
  var load = function() {
    texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = imageLoaded;
    texture.image.src = src;
  };
  var imageLoaded = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    MODELER.Event.dispatch(MODELER.EVENTS.TEXTURE.TEXTURE_LOADED, texture);
  };
  var getTexture = function() { return texture; }
  that = {};
  initialize();
  that.getTexture = getTexture;
  return that;
}