"use strict";
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var $ = require('jquery');
var addLinks = require('./libs/addlinks');
var drawLines = require('./libs/drawlines');
var getObjectInteracted = require('./libs/getobject');
var createLabel = require('./libs/createlabels');
var addMetaInfo = require('./libs/addmetadata');
var createSprites = require('./libs/createsprites');

var visApp = (function() {

  $('#loadData').click(function(){

      $('#loader-wrapper').show();

    $.getJSON('https://portal.intelliagg.com/sites.json', function(data){

      init(data);

      //show our div element that will contain the details for each node
      $('.node-detail-container').show();
      $('#loader-wrapper').hide();

    }).fail(function(){

      $('#loadData').trigger("click");

    }); //end getJson function
  })

    // once everything is loaded, we run our Three.js stuff.
    function init(data) {

      var controls, map;

      var currentSelectedObject = { lines: [], sprites: [], labels: [] };
      console.log('data length', data.length);

      //run function to add coordLinks array to each particle object
      addLinks(data);

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      var scene = new THREE.Scene();

      // create a camera, which defines where we're looking at.
      var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000000);

      // create a render and set the size
      var canvasRenderer = new THREE.WebGLRenderer();
      //set the background color for the 3d spoace
      canvasRenderer.setClearColor(new THREE.Color(0x1E364B, 1.0));
      canvasRenderer.setSize(window.innerWidth, window.innerHeight);

      camera.position.x = 80;
      camera.position.y = 50;
      camera.position.z = 300;

      // add the output of the renderer to the html element
      var mountEle = document.getElementById("WebGL-output");
      mountEle.style.zIndex = '-1';
      mountEle.appendChild(canvasRenderer.domElement);

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				canvasRenderer.setSize( window.innerWidth, window.innerHeight );

			}

        function ondblclick(event) {

          var intersects = getObjectInteracted(THREE, event, camera, scene);

          if(intersects.length > 0) {

            var URL = 'http://' + intersects[0].object.name;
            window.open(URL, "_blank");
          }

        }

        function onDocumentMouseDown(event) {

          var intersects = getObjectInteracted(THREE, event, camera, scene);

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

          var intersects = getObjectInteracted(THREE, event, camera, scene);

          //if there are any objects that have been hit by ray then intersect will contain that object
          if(intersects.length > 0) {

            //garbage collection of any selected objects
            if(currentSelectedObject.sprites.length > 0 && currentSelectedObject.lines.length > 0){

              //remove the label
              scene.remove(currentSelectedObject.labels[0]);


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
                  scene.remove(currentSelectedObject.lines[l]);
                }

                //reset the array back to 0 for lines when completed deletion
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
              scene.remove(currentSelectedObject.labels[0]);

              //reset the labels array to 0
              currentSelectedObject.labels = [];
            }

            var object = intersects[0].object;

            //add the latest selected object to array
            currentSelectedObject.sprites.push(object);

            object.material.transparent = false;
            object.material.opacity = 1;

            //if sprite and also has coordLinks prop then draw lines linking in
            if(object.type === "Sprite" && object.coordLinks) {
              drawLines(object.coordLinks, object.position, object, scene, THREE, currentSelectedObject);
            }

            createLabel(THREE, intersects, currentSelectedObject, scene);

            }

        }

        //add event listener for events
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('dblclick', ondblclick, false);

        //add event listener when window is resized
        window.addEventListener( 'resize', onWindowResize, false );

        //add controls for interacting with the objects and moving about
        controls = new OrbitControls(camera, canvasRenderer.domElement);
        controls.addEventListener('change', canvasRenderer);

        map = new THREE.TextureLoader().load( "ball.png" );

        createSprites(data, THREE, addMetaInfo, scene, map);
        render();

        function render() {
            camera.lookAt(scene.position);
            requestAnimationFrame(render);
            canvasRenderer.render(scene, camera);
            controls.update();

        }
    }//end init function

})();

module.exports = visApp;
