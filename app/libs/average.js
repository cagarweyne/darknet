module.exports = function(data) {
  var xlow = 500,
      xhigh = 0,
      ylow = 500,
      yhigh = 0,
      zlow = 500,
      zhigh = 0;

  data.forEach(function(site, i){
    if (site.pos.x < xlow){
      xlow = site.pos.x;
    }
    if (site.pos.x > xhigh){
      xhigh = site.pos.x;
    }

    if (site.pos.y < ylow){
      ylow = site.pos.y;
    }
    if (site.pos.y > yhigh){
      yhigh = site.pos.y;
    }

    if (site.pos.z < zlow){
      zlow = site.pos.y;
    }
    if (site.pos.z > zhigh){
      zhigh = site.pos.z;
    }

  });

  //console.log('xlow:', xlow, 'xhigh:', xhigh, 'ylow:', ylow, 'yhigh:', yhigh, 'zlow:', zlow, 'zhigh:', zhigh);
}
