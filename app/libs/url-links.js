module.exports = function(arr) {
    var urlSites = {};
    arr.forEach(function(site, index){
      if(site.linksFrom) {
        urlSites[index] = { url: site.site, linksFrom: site.linksFrom };
      }
    });

    return urlSites; 
}
