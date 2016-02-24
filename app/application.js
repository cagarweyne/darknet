"use strict";
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var $ = require('jquery');
var getCoordinates = require('./libs/getCoordinates');
var average = require('./libs/average');

//to move out to separate file

var visApp = (function() {
  $.getJSON('https://portal.intelliagg.com/sites.json', function(data){
    //compare urlLinks obj with getCoordinates array

    var reducedCoords = {};
    var finalCoordArr = data.reduce(function(acc, obj, i,  arr){

      //loop through the linksFrom array if not empty
      if(obj.linksFrom !==undefined){
        //console.log('obj', obj);
        obj.coordLinks = [];
        for (var j = 0;j <arr.length; j++ ) {
          if(obj.linksFrom.indexOf(arr[j].site) >= 0){
            //if url matches any of the links from urls then grab that url
            //collect the objects and push them into an array
            obj.coordLinks.push({x: arr[j].pos.x, y: arr[j].pos.y, z: arr[j].pos.z });
          }
        }

      }
    }, reducedCoords);

    //console.log(data);

    // once everything is loaded, we run our Three.js stuff.
    init();

    function init() {
      function DrawLines(data, position) {
        for(var k = 0; k<data.length; k++) {
            var lineGeo = new THREE.Geometry();
            var lineColor = new THREE.LineBasicMaterial({ color: 0x0000ff });
            lineGeo.vertices.push(new THREE.Vector3(position.x, position.y, position.z));
            lineGeo.vertices.push(new THREE.Vector3(data[k].x, data[k].y, data[k].z));
            var line = new THREE.Line(lineGeo, lineColor);

            scene.add(line);
        }
      }

      var container = document.createElement('div');
      document.body.appendChild(container);

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000000);

        // create a render and set the size
        var canvasRenderer = new THREE.WebGLRenderer();
        canvasRenderer.setClearColor(new THREE.Color(0x000000, 1.0));
        canvasRenderer.setSize(window.innerWidth, window.innerHeight);

        camera.position.x = 80;
        camera.position.y = 50;
        camera.position.z = 300;



			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				canvasRenderer.setSize( window.innerWidth, window.innerHeight );

			}
        function onDocumentMouseDown(event) {
          event.preventDefault();
          //align the mouse coordinates
          var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);

          //unproject the camera
          vector = vector.unproject(camera);

          //cast rays against the objects in space

          var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

          //check to see if any of the our object particles have bee hit by the ray

          var intersects = raycaster.intersectObjects(scene.children);

          //if there are any objects that have been hit by ray then intersect will contain that object
          if(intersects.length > 0) {
            var object = intersects[0].object;
            var heading = document.getElementById('node-info');
            heading.innerHTML = "Node Details";
            var text = document.getElementById('more-details');
            text.innerHTML = object.name;

            //log the object to console
            console.log(intersects[0]);



            intersects[0].object.material.transparent = false;
            intersects[0].object.material.opacity = 1;

            //if sprite and also has coordLinks prop the draw lines linking in
            if(object.type === "Sprite" && object.coordLinks) {
              console.log()
              DrawLines(object.coordLinks, object.position);
            }

          }

        }

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(canvasRenderer.domElement);

        //add event listener for mousedown
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        window.addEventListener( 'resize', onWindowResize, false );

        var controls = new OrbitControls(camera, canvasRenderer.domElement);

        var map = new THREE.TextureLoader().load( "ball.png" );

        createSprites();
        render();

        //console.log('lb5vnwyafrlxgmlt.onion', scene.getChildByName("lb5vnwyafrlxgmlt.onion"));

        var oregoMat = new THREE.SpriteMaterial({map: map, color: 0xFFFFFF})

        var org = new THREE.Sprite(oregoMat);

        org.position.set(0,0,0);
        org.scale.x =  16;
        org.scale.y =  16;

        scene.add(org);

        function createSprites() {

            for (var x = 0; x < data.length; x++) {

                //loop over the coordLinks array and decorate each particle to have coordLinks array
                if(data[x].coordLinks){
                var withLinksmaterial = new THREE.SpriteMaterial({map: map, color: 0xFF0066, transparent: true, opacity: 0.5 });
                var sprite = new THREE.Sprite(withLinksmaterial);

                //set the position of each particle in space
                sprite.position.set(data[x].pos.x , data[x].pos.y, data[x].pos.z);
                //sprite.position.set((Math.random() * 800 - 400) * 10 , (Math.random() * 800 - 400) * 10 , (Math.random() * 800 - 400) * 10 );

                //set size of each particle
                sprite.scale.x =  4;
                sprite.scale.y =  4;

                //give object a unique name
                sprite.name = data[x].site;

                //add the coords of incoming links as prop to be used later - on click
                sprite.coordLinks = data[x].coordLinks;

                //add the sprite to scene in space
                scene.add(sprite);

                } else {

                //set white color for each particle with no links
                var material = new THREE.SpriteMaterial({map: map, color: 0xFFFFFF, transparent: true, opacity: 0.5 });

                var sprite = new THREE.Sprite(material);
                //set the position of each particle in space
                sprite.position.set(data[x].pos.x , data[x].pos.y, data[x].pos.z);

                //set size of each particle - no links smaller
                sprite.scale.x =  2;
                sprite.scale.y =  2;

                //give object a unique name
                sprite.name = data[x].site;

                //add the sprite to scene in space
                scene.add(sprite);

                }
            }//end for loop

        }//end createSprites function


        function render() {
            camera.lookAt(scene.position);
            requestAnimationFrame(render);
            canvasRenderer.render(scene, camera);
            controls.update();

        }
    }//end init function
  }); //end getJson function
})();

module.exports = visApp;
