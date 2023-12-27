import * as THREE from 'THREE';
import SimplexNoise from './lib/perlin-noise-simplex.js';


const makeBg3dGeometry = function ( width, height ) {

	const simplexNoise = new SimplexNoise();
	const planeWidth  = width;
	const planeHeight = height;
	const planeSegX = ( width * 0.02 ) | 0;
	const planeSegY = ( height * 0.02 ) | 0;

	const geometry = new THREE.PlaneBufferGeometry(
		planeWidth,
		planeHeight,
		planeSegX,
		planeSegY
	);

	const scale = 120;

	for ( let i = 0, l = ( geometry.attributes.position.array.length / 3 ) | 0; i < l; i ++ ) {

		const x = geometry.attributes.position.array[ i * 3 ];
		const y = geometry.attributes.position.array[ i * 3 + 1 ];
		const z = simplexNoise.noise( x * 0.5, y * 0.5 ) * scale;

		geometry.attributes.position.array[ i * 3 ]     = x + ( Math.random() * 0.5 ) * scale;
		geometry.attributes.position.array[ i * 3 + 1 ] = y + ( Math.random() * 0.5 ) * scale;
		geometry.attributes.position.array[ i * 3 + 2 ] = z;

	}

	return geometry;

}

export default makeBg3dGeometry;
