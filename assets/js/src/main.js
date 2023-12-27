import Background from './bg3d.js';
import Pjax from 'pjax';

var bg3d = new Background(
	document.querySelector( '.ymt-PageContents' ),
	document.querySelector( '.ymt-PageBackground' )
);


const initDISQUS = () => {

	if ( window.DISQUS ) { return; }
	if ( !document.getElementById( 'disqus_thread' ) ) { return; }

	const dsq = document.createElement( 'script' );
	dsq.async = true;
	dsq.src = 'http://yomotsu.disqus.com/embed.js';
	document.head.appendChild( dsq );

}


const resetDISQUS = () => {

	if ( !window.DISQUS ) { return; }
	if ( !document.getElementById( 'disqus_thread' ) ) { return; }

	DISQUS.reset( {
		reload: true,
		config () {
			this.page.identifier = document.title;
			this.page.url = location.href;
		}
	} );

}

initDISQUS();

const router = new Pjax( {
	elements: 'a',
	selectors: [ 'title', 'link[rel="canonical"]', '.ymt-PageContents' ],
	switches: {
		'link[rel="canonical"]': function ( oldEl, newEl, options ) {

			oldEl.setAttribute( 'href', newEl.getAttribute( 'href' ) );

		},
		'.ymt-PageContents': function ( oldEl, newEl, options ) {

			const oldChild = oldEl.querySelector( '.ymt-PageContents__Inner' );
			const newChild = newEl.querySelector( '.ymt-PageContents__Inner' );

			oldChild.classList.add( 'leave' );
			newChild.classList.add( 'enter' );
			oldEl.appendChild( newChild );

			setTimeout( () => {

				oldChild.classList.remove( 'leave' );
				newChild.classList.remove( 'enter' );
				oldChild.classList.add( 'leaveActive' );
				newChild.classList.add( 'enterActive' );
				bg3d.onResize();

			}, 1 );

			setTimeout( () => {

				oldEl.removeChild( oldChild );
				newChild.classList.remove( 'enterActive' );
				initDISQUS(); // 前のページで DISQUS が設置されていない可能性があるため
				resetDISQUS();

			}, 500 );

		}
	},
	cacheBust: false,
	currentUrlFullReload: false,
	
} );

router.getElements = () => {

	const ignore = [
		':not( [href*="/wp/"] )',
		':not( [href*=".xml"] )',
		':not( [href*="/blog/assets/"] )'
	].join( '' );
	const selectors = [
		'a[href^="/"]' + ignore,
		'a[href^="//"]' + ignore,
		'a[href^="http://yomotsu"]' + ignore,
		'a[href^="http://www.yomotsu"]' + ignore,
	].join( ',' );

	return document.querySelectorAll( selectors );

}
