module.exports = function (arr) {

  var sites = [];
  var coord = {};
  var urlSites = {};
  var particleList = [];
  var lowest = 500;
  var highest = 0;

  arr.forEach(function(site, index){
    var stripped = site.site.split('.');
    if(site.linksFrom) {
      urlSites[index] = { url: site.site, linksFrom: site.linksFrom };
    }

    sites.push(stripped[0]);
  });

  console.log(Object.keys(urlSites).length);
  console.log(Object.keys(urlSites)[0]);

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

        var urlKeys = Object.keys(urlSites); 
        if(Object.keys(urlSites)[index]){
          var coordObj = coord[index] = { x: (partOneTotal * 4) - 350 , y: (partTwoTotal * 4) - 350, url: urlSites[urlKeys[index]].url  };
        } else {
          var coordObj = coord[index] = { x: (partOneTotal * 4) - 350 , y: (partTwoTotal * 4) - 350  };
        }
        particleList.push(coordObj);
      }

  });
  console.log('lo x:', lowest);
  console.log('hi x:', highest);
  console.log(particleList);

  return particleList;
}
