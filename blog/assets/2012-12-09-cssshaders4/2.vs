precision mediump float;

attribute vec4 a_position;
uniform mat4 u_projectionMatrix;

void main() {
    mat4 translate = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.5, 0.0, 0.0, 1.0
    );
    gl_Position = u_projectionMatrix * translate * a_position;
}