precision mediump float;

// vertex shader から受け取るために varying 変数を宣言
varying vec4 v_color;

void main() {
    css_MixColor = v_color;
}