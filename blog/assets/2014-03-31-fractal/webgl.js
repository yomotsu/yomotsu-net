var s = document.createElement( 'style' );
s.innerHTML = 'body{padding:0;margin:0;}canvas{display:block;}';
document.body.appendChild( s );

var c = document.createElement( 'canvas' );
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild( c );
var gl = c.getContext( 'experimental-webgl', { preserveDrawingBuffer: true } );

var vShaderSource = [
  'attribute vec2 a_position;',
  'void main(){',
  '  gl_Position = vec4( a_position, 1., 1. );',
  '}'
].join('\n');

var vertexShader = gl.createShader( gl.VERTEX_SHADER );
gl.shaderSource( vertexShader, vShaderSource );
gl.compileShader( vertexShader );

var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
gl.shaderSource( fragmentShader, document.getElementById( 'fs' ).textContent );
gl.compileShader( fragmentShader );

var program = gl.createProgram();
gl.attachShader( program, vertexShader );
gl.attachShader( program, fragmentShader );
gl.linkProgram( program );
gl.useProgram( program );

var vertexBuffer = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ - 1.0, - 1.0, 1.0, - 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ), gl.STATIC_DRAW );
var a_position = gl.getAttribLocation( program, 'a_position' );
gl.vertexAttribPointer( a_position, 2, gl.FLOAT, false, 0, 0 );
gl.enableVertexAttribArray( a_position );

var time = gl.getUniformLocation( program, 'time' );
var resolution = gl.getUniformLocation( program, 'resolution' );

( function update () {
  // setTimeout( update, 1000 );
  requestAnimationFrame( update );
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.uniform1f( time, performance.now() / 1000 );
  gl.uniform2fv( resolution, new Float32Array( [ window.innerWidth, window.innerHeight ] ) );
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
  gl.drawArrays( gl.TRIANGLES, 0, 6 );
} )();