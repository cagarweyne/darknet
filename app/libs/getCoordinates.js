module.exports = function (arr) {

  var sites = [];
  var coord = {};
  arr.forEach(function(site){
    var stripped = site.site.split('.');
    sites.push(stripped[0]);
  });
    var particleList = [];
    var lowest = 500;
    var highest = 0;
  sites.forEach(function(url, index){
      if(url.length / 2 === 8 ) {
        var part1 = url.slice(0, 8);
        var part2 = url.slice(8);
        //console.log('ascii value:', part2.charCodeAt(1));
        var partOneTotal = 0;
        for(var i=0; i <part1.length; i++) {
          partOneTotal += part1.charCodeAt(i) / 8;
        }
        if (partOneTotal < lowest){
          lowest = partOneTotal;
        }
        if (partOneTotal > highest){
          highest = partOneTotal;
        }

        var partTwoTotal = 0;
        for(var j=0; j <part2.length; j++) {
          partTwoTotal += part2.charCodeAt(j) / 8;
        }
        var coordObj = coord[index] = { x: (partOneTotal * 4) - 350 , y: (partTwoTotal * 4) - 350  };

        particleList.push(coordObj);
      }

  });
  console.log('lo x:', lowest);
  console.log('hi x:', highest);

  return particleList;
}
