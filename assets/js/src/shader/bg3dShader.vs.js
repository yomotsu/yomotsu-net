const bg3dShader = `
uniform vec3 pointerPosition;
uniform float contentsHeightHalf;

varying float vIntensityByPointer;

#ifndef PI
#define PI 3.141592653589793
#endif

float sineInOut( float t ) {

	return -0.5 * ( cos( PI * t ) - 1.0 );

}

float maxIntensityDistance = 200.0; // in css px

void main() {

	float verticalProsess = ( contentsHeightHalf - position.y ) / contentsHeightHalf;

	float transX = ( sineInOut( verticalProsess + 1.0 ) * 600.0 - 300.0 );
	float rotY = ( verticalProsess * PI + PI * 0.2 );
	mat4 rotationMatrix = mat4(
		cos( rotY ), 0.0, -sin( rotY ), 0.0,
		0.0, 1.0, 0.0, 0.0,
		sin( rotY ), 0.0,  cos( rotY ), 0.0,
		0.0, 0.0, 0.0, 1.0
	);

	vec4 newPosition = rotationMatrix * vec4( position.x, position.y, position.z, 1.0 );
	newPosition.x += transX;

	// begin ray stuff
	float intensityByPointer = max( maxIntensityDistance - distance( newPosition.xyz, pointerPosition.xyz ), 0.0 );
	vec3 angle = - normalize( newPosition.xyz ) + normalize( pointerPosition.xyz );
	newPosition.xyz += angle * intensityByPointer;
	// end ray stuff

	gl_Position = projectionMatrix * modelViewMatrix * newPosition;
	gl_PointSize = 2.0;
	vIntensityByPointer = intensityByPointer / maxIntensityDistance;

}
`;

export default bg3dShader;
