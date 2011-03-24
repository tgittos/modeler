//Multiply each vertex by the projection/perspective matrix, then by the translation matrix
//then by the vertex's position
(function(m){
  m.Shader.Vertex = 
    'attribute vec3 aVertexPosition; \
    uniform mat4 uMVMatrix; \
    uniform mat4 uPMatrix; \
    void main(void) { \
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
    }'
})(MODELER);