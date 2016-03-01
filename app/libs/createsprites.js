module.exports = function createSprites(data, THREE, addMetaInfo, scene, map, colors) {

    for (var x = 0; x < data.length; x++) {
        //loop over the coordLinks array and decorate each particle to have coordLinks array
        if(data[x].coordLinks){
          var spriteColor;
          if(typeof data[x].autoClass === 'object') {
            var spriteColor = colors[data[x].autoClass[0]];
            // for(var l=0; l<data[x].autoClass.length; l++) {
            //   console.log('colorssss', colors[data[x].autoClass[l]]);
            //   var spriteColor = colors[data[x].autoClass[l]];
            // }
          } else {
            spriteColor = colors[data[x].autoClass];
          }

          if(sprite === undefined) { console.log('color undefined', spriteColor); }

          var withLinksmaterial = new THREE.SpriteMaterial({map: map, color: spriteColor, transparent: true, opacity: 0.7 });
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
        var material = new THREE.SpriteMaterial({map: map, color: 0x990000, transparent: true, opacity: 0.7 });

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
