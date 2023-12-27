precision mediump float;

attribute vec4 a_position;
uniform mat4 u_projectionMatrix;

void main() {
    const float PI = 3.1415;
    float r = 45.0 * PI / 180.0;
    mat4 rotate = mat4(
         cos( r ), sin( r ), 0.0, 0.0,
        -sin( r ), cos( r ), 0.0, 0.0,
              0.0,      0.0, 1.0, 0.0,
              0.0,      0.0, 0.0, 1.0
    );
    gl_Position =  u_projectionMatrix * rotate * a_position;
}