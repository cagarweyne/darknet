"use strict";
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var $ = require('jquery');

var visApp = (function() {

  var container;
  var camera, scene, renderer, particles, geometry, material, i, h, color, colors = [], sprite, size;
  var mouseX = 0, mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  init();
  animate();

  function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    // camera.position.x = 20;
    // camera.position.y = 0;
    // camera.position.z = 1000;

    camera.position.x = 20;
    camera.position.y = 0;
    camera.position.z = 1400;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.00009 );

    geometry = new THREE.Geometry();

    sprite = new THREE.TextureLoader().load( "ball.png" );

    $.getJSON('https://portal.intelliagg.com/sites.json', function(data){
      console.log('>>>', data);
    });

    for ( i = 0; i < 25000; i ++ ) {

      var vertex = new THREE.Vector3();
      vertex.x = 2000 * Math.random() - 1000;
      vertex.y = 2000 * Math.random() - 1000;
      vertex.z = 2000 * Math.random() - 1000;

      geometry.vertices.push( vertex );

      colors[ i ] = new THREE.Color( 0x00ff00 );
      //colors[ i ].setHSL( ( vertex.x + 1000 ) / 2000, 1, 0.5 );

    }

    geometry.colors = colors;

    material = new THREE.PointsMaterial( { size: 80, map: sprite, vertexColors: THREE.VertexColors, alphaTest: 0.5, transparent: true } );
    material.color.setHSL( 1.0, 0.2, 0.7 );

    particles = new THREE.Points( geometry, material );
    scene.add( particles );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor('#989D9E');

    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    window.addEventListener( 'resize', onWindowResize, false );

  }

  var controls = new OrbitControls(camera, renderer.domElement);


  function onDocumentMouseMove( event ) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

  }

  function onDocumentTouchStart( event ) {

    if ( event.touches.length === 1 ) {

      event.preventDefault();

      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      mouseY = event.touches[ 0 ].pageY - windowHalfY;

    }

  }

  function onDocumentTouchMove( event ) {

    if ( event.touches.length === 1 ) {

      event.preventDefault();

      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      mouseY = event.touches[ 0 ].pageY - windowHalfY;

    }

  }

  function onWindowResize( event ) {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  //

  function animate() {

    requestAnimationFrame( animate );

    render();
    //stats.update();

  }

  function render() {

    var time = Date.now() * 0.00005;

    // camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    // camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

    camera.lookAt( scene.position );

    h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
    //material.color.setHSL( h, 1.0, 0.6 );

    renderer.render( scene, camera );
    //controls.update();

  }
})();

module.exports = visApp;
