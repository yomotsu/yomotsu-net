import * as THREE from 'THREE';
import bg3dShader     from './shader/bg3dShader.vs.js';
import bg3dShaderFace from './shader/bg3dShaderFace.fs.js';

const makeBg3dFaceMaterial = function ( color ) {

	return new THREE.ShaderMaterial( {
		vertexShader  : bg3dShader,
		fragmentShader: bg3dShaderFace,
		uniforms: {
			color             : { type:  'c', value: new THREE.Color( color ) },
			pointerPosition   : { type: 'v3', value: new THREE.Vector3() },
			contentsHeightHalf: { type:  'f', value: 0 }
		},
		blending   : THREE.NormalBlending,
		transparent: true,
		side       : THREE.DoubleSide
	} );

}

export default makeBg3dFaceMaterial;
