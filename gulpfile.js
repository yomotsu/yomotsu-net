'use strict';

const gulp         = require( 'gulp' );
const gulpif       = require( 'gulp-if' );
const rename       = require( 'gulp-rename' );
const uglify       = require( 'gulp-uglify' );
const rollup       = require( 'rollup' );
const rollupStream = require( 'rollup-stream' );
const commonjs     = require( 'rollup-plugin-commonjs' );
const nodeResolve  = require( 'rollup-plugin-node-resolve' );
const babel        = require( 'rollup-plugin-babel' );
const source       = require( 'vinyl-source-stream' );
const buffer       = require( 'vinyl-buffer' );

const sass         = require( 'gulp-sass' );
const postcss      = require( 'gulp-postcss' );
const autoprefixer = require( 'autoprefixer' );
const csswring     = require( 'csswring' );
// const plumber      = require( 'gulp-plumber' );

const runSequence  = require( 'run-sequence' ).use( gulp );

let production = false;
let cache;

const AUTOPREFIXER_BROWSERS = {
	browsers: [
		'ie >= 11',
		'safari >= 8',
		'ios >= 8',
		'android >= 4',
	]
};


gulp.task( 'sass', () => {

	const processors = [
		autoprefixer( AUTOPREFIXER_BROWSERS ),
		csswring
	];

	return gulp.src( './assets/css/src/main.scss' )
	// .pipe( plumber( {
	// 	errorHandler: ( err ) => {

	// 		console.log( err.messageFormatted );
	// 		this.emit( 'end' );

	// 	}
	// } ) )
	.pipe( sass() )
	.pipe( gulp.dest( './assets/css/' ) )
	.pipe( rename( { extname: '.min.css' } ) )
	.pipe( postcss( processors ) )
	.pipe( gulp.dest( './assets/css/' ) );

} );

gulp.task( 'rollup', () => {

	return rollupStream( {
		entry: './assets/js/src/main.js',
		rollup: rollup,
		format: 'iife',
		banner: '// @yomotsu',
		cache: cache,
		plugins: [
			// replace( {
			// 	'process.env.NODE_ENV': JSON.stringify( 'production' )
			// } ),
			babel( {
				exclude: 'node_modules/**',
				presets: [ [ 'es2015', { 'loose' : true, 'modules': false } ] ],
				plugins: []
			} ),
			nodeResolve( {
				browser: true,
				preferBuiltins: false,
			} ),
			commonjs( {
				include: ['node_modules/**'],
				exclude: [],
				sourceMap: false,
			} )
		]
	} )
	.on( 'error', function( err ) {

		console.log( 'Error : ' + err.message );
		this.emit( 'end' );

	} )
	.on( 'bundle', ( bundle ) => { cache = bundle; } )
	.pipe( source( 'main.js' ) )
	.pipe( gulp.dest( './assets/js/' ) )
	.pipe( gulpif( production, buffer() ) )
	.pipe( gulpif( production, uglify( { preserveComments: 'some' } ) ) )
	.pipe( rename( { extname: '.min.js' } ) )
	.pipe( gulp.dest( './assets/js/' ) );

} );



gulp.task( 'watch', () => {

	gulp.watch( [ './assets/js/src/**/*.js' ], () => {
		runSequence( 'rollup' );
	} );

	gulp.watch( [ './assets/css/src/**/*.scss' ], () => {
	  runSequence( 'sass' );
	} );

} );


gulp.task( 'build', ( callback ) => {

	production = true;
	return runSequence( 'sass', 'rollup', callback );

} );

gulp.task( 'default', ( callback ) => {

	return runSequence( 'sass', 'rollup', 'watch', callback );

} );
