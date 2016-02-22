var urlLinks = require('./url-links');

module.exports = function (arr) {

  var sites = [];
  var coord = {};
  var urlSites = urlLinks(arr);
  var particleList = [];
  var lowest = 500;
  var highest = 0;

  arr.forEach(function(site, index){
    var siteData = {};
    var stripped = site.site.split('.');
    if(site.linksFrom){
      siteData["url"] = stripped[0];
      siteData["linksFrom"] = site.linksFrom;
      siteData["fullUrl"] = site.site;
    } else {
      siteData["url"] = stripped[0];
      siteData["fullUrl"] = site.site;
    }

    sites.push(siteData);
  });

  sites.forEach(function(obj, index){
      //console.log(obj);
      if(obj.url.length / 2 === 8 ) {
        var part1 = obj.url.slice(0, 8);
        var part2 = obj.url.slice(8);
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

        var coordObj = coord[index] = { x: (partOneTotal * 4) - 350 , y: (partTwoTotal * 4) - 350, linksFrom: obj.linksFrom, url: obj.fullUrl  };

        particleList.push(coordObj);
      }

  });

  //console.log(particleList);
  return particleList;
}
