import * as THREE from 'THREE';
import makeBg3dGeometry     from './bg3dGeometry.js';
import makeBg3dFaceMaterial from './bg3dFaceMaterial.js';
import makeBg3dWireMaterial from './bg3dWireMaterial.js';

const DPR = ( window.devicePixelRatio ) ? window.devicePixelRatio : 1;
const screenPlane = [ new THREE.Mesh( new THREE.PlaneBufferGeometry( 10000, 10000, 1, 1 ) ) ];
const raycaster   = new THREE.Raycaster();

export default class Background {

	constructor ( contentEl, bgEl ) {

		this.contentEl = contentEl;
		this.bgEl = bgEl;
		this.contentElHeight = this.contentEl.offsetHeight
		this.contentElTop    = this.contentEl.offsetTop;
		this.width  = window.innerWidth;
		this.height = window.innerHeight;
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 10, 10000 );
		this.camera.position.z = this.getPixelPerfectZ();
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setSize( this.width, this.height );
		// this.renderer.setPixelRatio( DPR );
		this.renderer.setClearColor ( 0x0d1730 );
		this.bgEl.appendChild( this.renderer.domElement );

		const bg3dGeometry = makeBg3dGeometry( 400, 3000 ); // in css px

		this.face   = new THREE.Mesh  ( bg3dGeometry, makeBg3dFaceMaterial( 0xffffff ) );
		this.wire   = new THREE.Mesh  ( bg3dGeometry, makeBg3dWireMaterial( 0x243048 ) );
		this.points = new THREE.Points( bg3dGeometry, makeBg3dWireMaterial( 0x607192 ) );

		this.face.renderOrder   = 0;
		this.wire.renderOrder   = 1;
		this.points.renderOrder = 2;

		this.scene.add( this.face, this.wire, this.points );

		this.mouse        = new THREE.Vector2();
    this.delayedMouse = new THREE.Vector2();
		this.scrollY      = 0;
    this.delayedScrollY = 0;

		this.needsRendererUpdate = true;

		this.onScroll();

		window.addEventListener( 'mousemove', this.onMouseMove.bind( this ) );
		window.addEventListener( 'touchmove', this.onMouseMove.bind( this ) );
		window.addEventListener( 'scroll',    this.onScroll.bind( this ) );
		window.addEventListener( 'resize',    this.onResize.bind( this ) );

		this.face.material.uniforms.pointerPosition.value.set( 0, 1, 0 );
		this.wire.material.uniforms.pointerPosition.value.set( 0, 1, 0 );
		this.points.material.uniforms.pointerPosition.value.set( 0, 1, 0 );

		this.face.material.uniforms.contentsHeightHalf.value   = this.contentElHeight * 0.5;
		this.wire.material.uniforms.contentsHeightHalf.value   = this.contentElHeight * 0.5;
		this.points.material.uniforms.contentsHeightHalf.value = this.contentElHeight * 0.5;

		this.update();

	}

	getPixelPerfectZ () {

		const vFov = THREE.Math.degToRad( 75 );
		return this.height / ( 2 * Math.tan( vFov * 0.5 ) );

	}

	onMouseMove ( event ) {

		let _event;

		if ( event.changedTouches ) {

			_event = event.changedTouches[ 0 ];

		} else {

			_event = event;

		}

		this.mouse.x =   ( _event.clientX / this.width  ) * 2 - 1;
		this.mouse.y = - ( _event.clientY / this.height ) * 2 + 1;
		this.needsRendererUpdate = true;

	}

	onScroll () {

		// const y = ( ( window.pageYOffset + this.height - this.contentElTop ) / this.contentElHeight ); // 0 to 1
		this.scrollY = window.pageYOffset - this.contentElTop;
		this.needsRendererUpdate = true;

	}

	onResize () {

		this.width  = window.innerWidth;
		this.height = window.innerHeight;

		this.contentElHeight = this.contentEl.offsetHeight
		this.contentElTop    = this.contentEl.offsetTop;

		this.renderer.setSize( this.width, this.height );
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
		this.camera.position.z = this.getPixelPerfectZ();

		// shader内で、ビューポート内に入っていれば0~1になる計算をするために使う
		// ビューポートより上なら0未満、ビューポートにより下なら1以上
		this.face.material.uniforms.contentsHeightHalf.value   = this.contentElHeight * 0.5;
		this.wire.material.uniforms.contentsHeightHalf.value   = this.contentElHeight * 0.5;
		this.points.material.uniforms.contentsHeightHalf.value = this.contentElHeight * 0.5;

		this.onScroll();

	}

	raycast () {
		// z === 0 の平面に、マウスからのレイキャストを行う。
		// 交差した点の座標をシェーダーに送る

		if ( this.delayedMouse.x === 0 && this.delayedMouse.y === 0 ) {

			return;

		}

		raycaster.setFromCamera( this.delayedMouse, this.camera );
		const intersects = raycaster.intersectObjects( screenPlane );

		if ( intersects.length === 0 ) { return; }

		this.face.material.uniforms.pointerPosition.value.copy( intersects[ 0 ].point );
		this.wire.material.uniforms.pointerPosition.value.copy( intersects[ 0 ].point );
		this.points.material.uniforms.pointerPosition.value.copy( intersects[ 0 ].point );

	}

	update () {

		const elapsed = this.clock.getElapsedTime();

		// if ( elapsed > 50 ) {
		// 	console.log( 'end' );
		// 	return;
		// }

		requestAnimationFrame( this.update.bind( this ) );

		if ( !this.needsRendererUpdate ) { return; }

		this.delayedMouse.x += ( this.mouse.x - this.delayedMouse.x ) * 0.02;
		this.delayedMouse.y += ( this.mouse.y - this.delayedMouse.y ) * 0.02;
		this.delayedScrollY += ( this.scrollY - this.delayedScrollY ) * 0.02;

		this.raycast();
		this.camera.position.x = -this.delayedMouse.x * this.width * 0.25;
		this.camera.position.y = -this.delayedScrollY + this.contentElHeight * 0.5;
		this.renderer.render( this.scene, this.camera );

		// ディレイして動かしている座標が
		// 十分にオリジナルの座標に近づいたらレンダリングループを停止する
		if (
			Math.abs( Math.abs( this.delayedMouse.x ) - Math.abs( this.mouse.x ) ) < 0.1 &&
			Math.abs( Math.abs( this.delayedMouse.y ) - Math.abs( this.mouse.y ) ) < 0.1 &&
			Math.abs( Math.abs( this.delayedScrollY ) - Math.abs( this.scrollY ) ) < 1
		) {
			this.needsRendererUpdate = false;
		}

	}

}
