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

        function onDocumentMouseDown(event) {
          //align the mouse coordinates
          var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);

          //unproject the camera
          vector = vector.unproject(camera);

          //cast rays against the objects in space

          var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

          //check to see if any of the our object particles have bee hit by the ray

          var intersects = raycaster.intersectObjects(scene.children);

          //if there are any objects that have been hit by ray then intersect will contain it
          if(intersects.length > 0) {

            //log the object to console
            console.log(intersects[0]);

            intersects[0].object.material.transparent = true;
            intersects[0].object.material.opacity = 0.1;
          }
        }

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(canvasRenderer.domElement);

        //add event listener for mousedown
        document.addEventListener('mousedown', onDocumentMouseDown, false);

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
