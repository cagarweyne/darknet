"use strict";
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var $ = require('jquery');
var getCoordinates = require('./libs/getCoordinates');

var visApp = (function() {
  $.getJSON('https://portal.intelliagg.com/sites.json', function(data){
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
            var coordinates = getCoordinates(data);

            console.log('color:', '#'+(Math.random()*0xFFFFFF<<0).toString(16));

            for (var x = 0; x < coordinates.length; x++) {
                  var colors = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

                  //set color for each particle
                  var material = new THREE.SpriteMaterial({map: map, color: Math.random() * 0x808080 + 0x808080});

                    var sprite = new THREE.Sprite(material);

                    //set the position of each particle in space
                    sprite.position.set(coordinates[x].x, coordinates[x].y, Math.random() * 100);

                    //set size of each particle
                    sprite.scale.x =  3;
                    sprite.scale.y =  3;

                    //give object a unique name
                    sprite.name = "sprite-" + x;
                    //sprite.material.color = Math.random() * 0x808080;
                    //console.log(sprite)
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
