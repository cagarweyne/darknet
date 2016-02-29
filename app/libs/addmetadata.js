module.exports = function (site, sprite) {
  //add the title to sprite if available
  if(site.title) {

    sprite.nodeTitle = site.title;
  }

  //add the lang if available
  if(site.language) {
    sprite.nodeLang = site.language;
  }
}
