module.exports = function (THREE, event, camera, scene) {
  event.preventDefault();
  //align the mouse coordinates
  var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);

  //unproject the camera
  vector = vector.unproject(camera);

  //cast rays against the objects in space

  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  //check to see if any of the our object particles have bee hit by the ray

  var intersects = raycaster.intersectObjects(scene.children);

  return intersects;
}
