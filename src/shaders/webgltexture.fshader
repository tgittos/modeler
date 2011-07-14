#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void) {
  vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
  // Base texture
  //gl_FragColor = vec4(textureColor.rgb, textureColor.a * uAlpha);
  // Lighting
  //gl_FragColor = vec4(vLightWeighting, 1);
  // Both
  gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a * uAlpha);
}