// Low level render library
// Operates directly on array buffers and raw WebGL objects like materials and textures
// so that it depends on no abstraction, which makes it very fast
var REDBACK = {};
REDBACK.Core = {};
REDBACK.Materials = {};
REDBACK.Shaders = {};
REDBACK.Textures = {};

//DEBUG
// keep the old modeler namespace alive until transition is complete
MODELER.Materials = MODELER.Materials || {};
//END DEBUG