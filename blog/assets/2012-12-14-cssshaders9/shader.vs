precision mediump float;

attribute vec4 a_position;
attribute vec2 a_meshCoord;

uniform mat4 u_projectionMatrix;
uniform mat4 u_transform;

// fragment shader に渡すために varying 変数を宣言
varying vec4 v_color;

void main() {
    float z = sin( a_meshCoord.x * 3.1415) * 100.0;
    vec4 pos = vec4( a_position.xy, z, a_position.w );

    // a_position を v_color に代入して fragment shader に渡す
    v_color = vec4( 0.0, 0.0, 0.0, min( 0.75, 1.0 - ( z / 100.0 ) ) );
    gl_Position = u_projectionMatrix * u_transform * pos;
}