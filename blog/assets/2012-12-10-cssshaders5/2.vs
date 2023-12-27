precision mediump float;

attribute vec4 a_position;
uniform mat4 u_projectionMatrix;

uniform mat4 u_transform;

void main() {
    gl_Position = u_projectionMatrix * u_transform * a_position;
}