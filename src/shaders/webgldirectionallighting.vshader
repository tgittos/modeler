// NEW ITEMS NEED TO BE PASSED INTO THE SHADER USING THE RENDERING ENGINE

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aVertexNormal; //NEW

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix; //NEW

uniform vec3 uLightingDirection; //NEW
uniform vec3 uDirectionalColor; //NEW

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;
  vec3 transformedNormal = uNMatrix * aVertexNormal;
  float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
  vLightWeighting = uDirectionalColor * directionalLightWeighting;
}