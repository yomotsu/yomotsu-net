const bg3dShaderWire = `
uniform vec3 color;
varying float vIntensityByPointer;

void main() {

	vec3 finalColor = min( vec3( vIntensityByPointer ) + color, vec3( 0.8 ) );
	gl_FragColor = vec4( finalColor, 1.0 );

}
`;

export default bg3dShaderWire;
