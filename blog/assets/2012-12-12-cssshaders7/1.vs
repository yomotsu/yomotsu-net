precision mediump float;

attribute vec4 a_position;
attribute vec2 a_meshCoord;

uniform mat4 u_projectionMatrix;
uniform mat4 u_transform;

void main() {
    float z = sin( a_meshCoord.x * 3.1415) * 100.0;
    vec4 pos = vec4( a_position.xy, z, a_position.w );

    gl_Position = u_projectionMatrix * u_transform * pos;
}