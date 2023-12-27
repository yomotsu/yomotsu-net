import * as THREE from 'THREE';
import bg3dShader     from './shader/bg3dShader.vs.js';
import bg3dShaderWire from './shader/bg3dShaderWire.fs.js';

const makeBg3dMaterial = function ( color ) {

	return new THREE.ShaderMaterial( {
		vertexShader  : bg3dShader,
		fragmentShader: bg3dShaderWire,
		uniforms: {
			color             : { type:  'c', value: new THREE.Color( color ) },
			pointerPosition   : { type: 'v3', value: new THREE.Vector3() },
			contentsHeightHalf: { type:  'f', value: 0 }
		},
		blending   : THREE.NormalBlending,
		transparent: false,
		depthTest  : false,
		depthWrite : false,
		wireframe  : true
	} );

}

export default makeBg3dMaterial;
