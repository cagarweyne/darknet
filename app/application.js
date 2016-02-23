"use strict";
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var $ = require('jquery');
var getCoordinates = require('./libs/getCoordinates');
var average = require('./libs/average');

var visApp = (function() {
  $.getJSON('https://portal.intelliagg.com/sites.json', function(data){
    //compare urlLinks obj with getCoordinates array
    //var coordinates = getCoordinates(data);

    average(data);


    var reducedCoords = {};
    var finalCoordArr = data.reduce(function(acc, obj, i,  arr){
      //loop through the linksFrom array if not empty
      if(obj.linksFrom !==undefined){
        obj.coordLinks = [];
        for (var j = 0;j <arr.length; j++ ) {
          if(obj.linksFrom.indexOf(arr[j].url) >= 0){
            //if url matches any of the links from urls then grab that url
            //collect the objects and push them into an array
            obj.coordLinks.push({x: arr[j].pos.x, y: arr[j].pos.y, z: arr[j].success });
          }
        }

      }
    }, reducedCoords);

    //console.log(coordinates);

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

        camera.position.x = 80;
        camera.position.y = 50;
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

          //if there are any objects that have been hit by ray then intersect will contain that object
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

        var oregoMat = new THREE.SpriteMaterial({map: map, color: 0xFFFFFF})

        var org = new THREE.Sprite(oregoMat);

        org.position.set(0,0,0);
        org.scale.x =  16;
        org.scale.y =  16;

        scene.add(org);

        function createSprites() {


            console.log('color:', '#'+(Math.random()*0xFFFFFF<<0).toString(16));

            for (var x = 0; x < data.length; x++) {
                  var colors = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

                  //set color for each particle
                  var material = new THREE.SpriteMaterial({map: map, color: Math.random() * 0x808080 + 0x808080});

                    var lineColor = new THREE.LineBasicMaterial({ color: 0x0000ff });
                    var geometry = new THREE.Geometry();

                    var sprite = new THREE.Sprite(material);

                    //set the position of each particle in space
                    sprite.position.set(data[x].pos.x , data[x].pos.y, data[x].pos.z);

                    //loop over the coordLinks array and get data for each line
                    //if data[x].coordLinks.length is not Undefined
                    if(data[x].coordLinks){
                      for(var k = 0; k<data[x].coordLinks.length; k++){
                        geometry.vertices.push(
                          new THREE.Vector3(
                          data[x].x,
                          data[x].y,
                          data[x].success
                        ),
                        new THREE.Vector3(data[x].coordLinks[k].x,data[x].coordLinks[k].y,data[x].coordLinks[k].success)
                      );
                      }
                    }


                    //set size of each particle
                    sprite.scale.x =  10;
                    sprite.scale.y =  10;

                    //give object a unique name
                    sprite.name = "sprite-" + x;
                    //sprite.material.color = Math.random() * 0x808080;

                    scene.add(sprite);
                    // line = new THREE.Line(geometry, lineColor);
                    //scene.add(line);



            }

        }


        function render() {
            camera.lookAt(scene.position);
            // if (camera.position )
            //console.log(camera.position);
            requestAnimationFrame(render);
            canvasRenderer.render(scene, camera);
            controls.update();

        }
        console.log(scene.children);
    }//end init function
  });//end getJson function
})();

module.exports = visApp;
