module.exports = function (data, position, object, scene, THREE, currentSelectedObject) {

  for(var k = 0; k<data.length; k++) {
      var lineGeo = new THREE.Geometry();
      var lineColor = new THREE.LineBasicMaterial({ color: 0x34DDDD  });
      lineGeo.vertices.push(new THREE.Vector3(position.x, position.y, position.z));
      lineGeo.vertices.push(new THREE.Vector3(data[k].x, data[k].y, data[k].z));
      var line = new THREE.Line(lineGeo, lineColor);

      //add unique name to each line
      line.name = Math.random() + 'line';
      currentSelectedObject.lines.push(line);


      //if(data.length === 1) { line.name = "deep"; }
      scene.add(line);
  }
}
