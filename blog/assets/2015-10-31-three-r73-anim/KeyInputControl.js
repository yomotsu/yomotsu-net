// @author yomotsu
// MIT License

;( function ( THREE, ns ) {

  'use strict';

  var KEY_W     = 87,
      KEY_UP    = 38,
      KEY_S     = 83,
      KEY_DOWN  = 40,
      KEY_A     = 65,
      KEY_LEFT  = 37,
      KEY_D     = 68,
      KEY_RIGHT = 39,
      KEY_SPACE = 32;

  var DEG_0   = THREE.Math.degToRad(   0 ),
      DEG_45  = THREE.Math.degToRad(  45 ),
      DEG_90  = THREE.Math.degToRad(  90 ),
      DEG_135 = THREE.Math.degToRad( 135 ),
      DEG_180 = THREE.Math.degToRad( 180 ),
      DEG_225 = THREE.Math.degToRad( 225 ),
      DEG_270 = THREE.Math.degToRad( 270 ),
      DEG_315 = THREE.Math.degToRad( 315 ),
      DEG_360 = THREE.Math.degToRad( 360 );

  ns.KeyInputControl = function () {
    
    THREE.EventDispatcher.prototype.apply( this );
    this.isDisabled = false;

    this.isUp    = false;
    this.isDown  = false;
    this.isLeft  = false;
    this.isRight = false;
    this.isMoveKeyHolded = false;
    this.frontAngle = 0;

    this._keydownListener = onkeydown.bind( this );
    this._keyupListener   = onkeyup.bind( this );
    this._blurListener    = onblur.bind( this );

    window.addEventListener( 'keydown', this._keydownListener, false );
    window.addEventListener( 'keyup',   this._keyupListener,   false );
    window.addEventListener( 'blur',    this._blurListener,    false );

  }

  ns.KeyInputControl.prototype.jump = function () {

    this.dispatchEvent( { type: 'jumpkeypress' } );

  };

  ns.KeyInputControl.prototype.updateAngle = function () {

    var up    = this.isUp;
    var down  = this.isDown;
    var left  = this.isLeft;
    var right = this.isRight;

    if (  up && !left && !down && !right )      { this.frontAngle = DEG_0  ; }
    else if (  up &&  left && !down && !right ) { this.frontAngle = DEG_45 ; }
    else if ( !up &&  left && !down && !right ) { this.frontAngle = DEG_90 ; }
    else if ( !up &&  left &&  down && !right ) { this.frontAngle = DEG_135; }
    else if ( !up && !left &&  down && !right ) { this.frontAngle = DEG_180; }
    else if ( !up && !left &&  down &&  right ) { this.frontAngle = DEG_225; }
    else if ( !up && !left && !down &&  right ) { this.frontAngle = DEG_270; }
    else if (  up && !left && !down &&  right ) { this.frontAngle = DEG_315; }

  };


  function onkeydown ( e ) {

    if ( this.isDisabled ) { return; }

    switch ( e.keyCode ) {

      case KEY_W :
      case KEY_UP :
        this.isUp = true;
        break;

      case KEY_S :
      case KEY_DOWN :
        this.isDown = true;
        break;

      case KEY_A :
      case KEY_LEFT :
        this.isLeft = true;
        break;

      case KEY_D :
      case KEY_RIGHT :
        this.isRight = true;
        break;

      case KEY_SPACE :
        this.jump();
        break;

      default:
        return;

    }
    
    var prevAngle = this.frontAngle;

    this.updateAngle();

    if ( prevAngle !== this.frontAngle ) {

      this.dispatchEvent( { type: 'movekeychange' } );

    }

    if (
      ( this.isUp || this.isDown || this.isLeft || this.isRight ) &&
      !this.isMoveKeyHolded
    ) {

      this.isMoveKeyHolded = true;
      this.dispatchEvent( { type: 'movekeyon' } );

    }

  }

  function onkeyup ( e ) {

    if ( this.isDisabled ) { return; }

    switch ( e.keyCode ) {

      case KEY_W :
      case KEY_UP :
        this.isUp = false;
        break;

      case KEY_S :
      case KEY_DOWN :
        this.isDown = false;
        break;
        
      case KEY_A :
      case KEY_LEFT :
        this.isLeft = false;
        break;

      case KEY_D :
      case KEY_RIGHT :
        this.isRight = false;
        break;

      case KEY_SPACE :
        break;

      default:
        return;

    }
    
    var prevAngle = this.frontAngle;

    this.updateAngle();

    if ( prevAngle !== this.frontAngle ) {

      this.dispatchEvent( { type: 'movekeychange' } );

    }

    if ( !this.isUp && !this.isDown && !this.isLeft && !this.isRight &&
      (
           e.keyCode === KEY_W
        || e.keyCode === KEY_UP
        || e.keyCode === KEY_S
        || e.keyCode === KEY_DOWN
        || e.keyCode === KEY_A
        || e.keyCode === KEY_LEFT
        || e.keyCode === KEY_D
        || e.keyCode === KEY_RIGHT
      )
    ) {

      this.isMoveKeyHolded = false;
      this.dispatchEvent( { type: 'movekeyoff' } );

    }

  }

  function onblur ( e ) {

    this.isUp    = false;
    this.isDown  = false;
    this.isLeft  = false;
    this.isRight = false;
    
    if ( this.isMoveKeyHolded ) {

      this.isMoveKeyHolded = false;
      this.dispatchEvent( { type: 'movekeyoff' } );

    }

  }

} )( THREE, MW );
