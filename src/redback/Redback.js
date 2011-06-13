// Low level render library
// Operates directly on array buffers and raw WebGL objects like materials and textures
// so that it depends on no abstraction, which makes it very fast
var REDBACK = {};
REDBACK.Core = {};
REDBACK.Materials = {};
REDBACK.Shaders = {};
REDBACK.Textures = {};

// constants
REDBACK.VERTEX_SIZE = 3;
REDBACK.VERTEX_BYTES = 4; // 4 for 4 bytes for a gl.FLOAT
REDBACK.VERTEX_STRIDE = REDBACK.VERTEX_SIZE * REDBACK.VERTEX_BYTES; 