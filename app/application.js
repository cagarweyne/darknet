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

      var currentSelectedObject = { lines: [], sprites: [], labels: [] };

      function removeEntity(object){
        scene.remove(object);
      }

      function DrawLines(data, position, object) {
        // console.log('number of links:',data.length);
        // console.log('expect: Object >>', typeof position);
        for(var k = 0; k<data.length; k++) {
            var lineGeo = new THREE.Geometry();
            var lineColor = new THREE.LineBasicMaterial({ color: 0x0000ff });
            lineGeo.vertices.push(new THREE.Vector3(position.x, position.y, position.z));
            lineGeo.vertices.push(new THREE.Vector3(data[k].x, data[k].y, data[k].z));
            var line = new THREE.Line(lineGeo, lineColor);

            //add unique name to each line
            line.name = Math.random() + 'line';
            currentSelectedObject.lines.push(line);


            //if(data.length === 1) { line.name = "deep"; }
            scene.add(line);
        }
      }

        var container = document.createElement('div');
        document.body.appendChild(container);

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

          if(intersects.length > 0) {

            intersects[0].object.material.transparent = false;
            intersects[0].object.material.opacity = 1;

            var object = intersects[0].object;

            var siteUrl = document.getElementById('site');
            siteUrl.innerHTML = object.name;

            var nodeTitle = document.getElementById('title');
            if(object.nodeTitle !==undefined) {
              nodeTitle.innerHTML = object.nodeTitle
            } else {
              nodeTitle.innerHTML = 'none';
            }

            var nodeLang = document.getElementById('lang');
            if(object.nodeLang !==undefined) {
              nodeLang.innerHTML = object.nodeLang;
            } else {
              nodeLang.innerHTML = 'none';
            }

            var incomingLinks = document.getElementById('incoming-links');
            if(object.coordLinks) {
              incomingLinks.innerHTML = object.coordLinks.length;
            } else {
              incomingLinks.innerHTML = 0;
            }

          }

        }

        function onDocumentMouseMove(event) {
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

            //garbage collection of any selected objects
            if(currentSelectedObject.sprites.length > 0 && currentSelectedObject.lines.length > 0){

              //remove the label
              removeEntity(currentSelectedObject.labels[0]);

              //reset the labels array to 0
              currentSelectedObject.labels = [];

              //if sprite and has coordLinks then remove lines and make opacity default again
              if(currentSelectedObject.sprites[0].type === "Sprite" && currentSelectedObject.sprites[0].coordLinks) {
                //default back opacity
                currentSelectedObject.sprites[0].material.transparent = true;
                currentSelectedObject.sprites[0].material.opacity = 0.5;

                //reset the sprites array to 0
                currentSelectedObject.sprites = [];

                //remove lines - loop over until end of array
                for(var l = 0; l<currentSelectedObject.lines.length ; l++) {
                  removeEntity(currentSelectedObject.lines[l]);
                }

                //reset the array back to 0 when completed deletion
                currentSelectedObject.lines = [];
              }

            }

            //if sprite and no lines then make opacity back to default
            else if(currentSelectedObject.sprites.length > 0) {
              currentSelectedObject.sprites[0].material.transparent = true;
              currentSelectedObject.sprites[0].material.opacity = 0.5;

              //reset sprites array to 0 when completed
              currentSelectedObject.sprites = [] ;

              //remove the label
              removeEntity(currentSelectedObject.labels[0]);

              //reset the labels array to 0
              currentSelectedObject.labels = [];
            }

            var object = intersects[0].object;

            //add the latest selected object to array
            currentSelectedObject.sprites.push(object);

            //log the object to console
            console.log('-----', intersects[0]);

            intersects[0].object.material.transparent = false;
            intersects[0].object.material.opacity = 1;

            //if sprite and also has coordLinks prop the draw lines linking in
            if(object.type === "Sprite" && object.coordLinks) {
              DrawLines(object.coordLinks, object.position, object);
              // if(scene.ObjectByName("deep")) { console.log( 'line with name: deep: ', scene.ObjectByName("abdi") ); }
            }

            // create a canvas element
          	var canvas1 = document.createElement('canvas');
          	var context1 = canvas1.getContext('2d');
          	context1.font = "Bold 20px Arial";
          	context1.fillStyle = "#fff";
            context1.fillText('No Url', 0, 20);

          	// canvas contents will be used for a texture
          	var texture1 = new THREE.Texture(canvas1)
          	texture1.needsUpdate = true;

          	var labelMaterial = new THREE.SpriteMaterial( { map: texture1, useScreenCoordinates: true } );

          	var sprite1 = new THREE.Sprite( labelMaterial );
          	sprite1.scale.set(10,10,1.0);
          	sprite1.position.set( object.position.x - 1, object.position.y, object.position.z );

            //add the label to the labels array in currentSelectedObject obj
            currentSelectedObject.labels.push(sprite1);
          	scene.add( sprite1 );

            if ( intersects[ 0 ].object.name ){
              context1.clearRect(0,0,640,480);
              var message = intersects[ 0 ].object.name;
              var metrics = context1.measureText(message);
              var width = metrics.width;
              context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
              context1.fillRect( 0,0, width+8,20+8);
              context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
              context1.fillRect( 2,2, width+4,20+4 );
              context1.fillStyle = "rgba(0,0,0,1)"; // text color
              context1.fillText( message, 4,20 );
              texture1.needsUpdate = true;
            }

            else {
              context1.clearRect(0,0,300,300);
              texture1.needsUpdate = true;
            }

          }

        }

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(canvasRenderer.domElement);

        //add event listener for mousedown
        document.addEventListener('mousemove', onDocumentMouseMove, false);
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

        function addMetaInfo(site, sprite) {
          //add the title to sprite if available
          if(site.title) {
            console.log('title:', site.title);
            sprite.nodeTitle = site.title;
          }

          //add the lang if available
          if(site.language) {
            sprite.nodeLang = site.language;
          }
        }

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

                //call addMetaInfo function to decorate sprite with more data
                addMetaInfo(data[x], sprite);

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

                //call addMetaInfo function to decorate sprite with more data
                addMetaInfo(data[x], sprite);

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
