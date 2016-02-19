"use strict";
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var $ = require('jquery');
var getCoordinates = require('./libs/getCoordinates');

var visApp = (function() {
  $.getJSON('https://portal.intelliagg.com/sites.json', function(data){
    console.log(data);
    // once everything is loaded, we run our Three.js stuff.
    init();

    function init() {

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create a render and set the size
        var canvasRenderer = new THREE.WebGLRenderer();
        canvasRenderer.setClearColor(new THREE.Color(0x000000, 1.0));
        canvasRenderer.setSize(window.innerWidth, window.innerHeight);

        camera.position.x = 20;
        camera.position.y = 0;
        camera.position.z = 300;

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(canvasRenderer.domElement);

        var controls = new OrbitControls(camera, canvasRenderer.domElement);

        var map = new THREE.TextureLoader().load( "ball.png" );

        createSprites();
        render();

        function createSprites() {
            var material = new THREE.SpriteMaterial({map: map, color: 0x00ff00});
            var coordinates = getCoordinates(data);

            for (var x = 0; x < coordinates.length; x++) {
                    var sprite = new THREE.Sprite(material);

                    sprite.position.set(coordinates[x].x, coordinates[x].y, 0);
                    scene.add(sprite);
            }
        }


        function render() {
            requestAnimationFrame(render);
            canvasRenderer.render(scene, camera);
            controls.update();
        }

    }//end init function
  });//end getJson function
})();

module.exports = visApp;
