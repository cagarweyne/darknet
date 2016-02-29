module.exports = function(data) {
  //decorate each object to have coordLinks array for incoming links
    data.reduce(function(acc, obj, i,  arr){

    //loop through the linksFrom array if not empty
    if(obj.linksFrom !==undefined){
      obj.coordLinks = [];
      for (var j = 0;j <arr.length; j++ ) {
        if(obj.linksFrom.indexOf(arr[j].site) >= 0){
          //if url matches any of the links from urls then grab that url
          //collect the objects and push them into an array
          obj.coordLinks.push({x: arr[j].pos.x, y: arr[j].pos.y, z: arr[j].pos.z });
        }
      }

    }
  }, {});

  return data;
}
