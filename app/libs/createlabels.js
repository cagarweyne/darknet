module.exports = function (THREE, intersects, currentSelectedObject, scene) {
    var object = intersects[0].object;
    // create a canvas element to display label
    var canvas1 = document.createElement('canvas');
    var context1 = canvas1.getContext('2d');
    context1.font = "Bold 20px Arial";
    context1.fillStyle = "#fff";
    context1.fillText('No Url', 0, 20);

    // canvas contents will be used for a texture
    var texture1 = new THREE.Texture(canvas1)
    texture1.needsUpdate = true;

    var labelMaterial = new THREE.SpriteMaterial( { map: texture1 } );

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
