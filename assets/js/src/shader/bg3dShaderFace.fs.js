const bg3dShaderFace = `
uniform vec3 color;

void main() {

	gl_FragColor = vec4( color, 0.02 );

}
`

export default bg3dShaderFace;
