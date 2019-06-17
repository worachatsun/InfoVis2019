var scene_stream = new THREE.Scene();

function main_streamlines() {
  var volume = new KVS.LobsterData();
  var width = 500;
  var height = 500;

  var stream = document.getElementById("Stream");

  var ambientLight = new THREE.AmbientLight(0x404040);
  scene_stream.add(ambientLight);

  var light = new THREE.PointLight(0xffffff);
  scene_stream.add(light);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setClearColor(0xa0a0a0, 1);
  stream.appendChild(renderer.domElement);
  //document.body.appendChild(renderer.domElement);

  var fov = 45;
  var aspect = width / height;
  var near = 1;
  var far = 5000;
  var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 300);
  scene_stream.add(camera);

  var trackball = new THREE.TrackballControls(camera, renderer.domElement);
  trackball.rotateSpeed = 3.0;

  var bounds = new Bounds(
    new THREE.Vector3(-volume.dimx / 2, -volume.dimy / 2, -volume.dimz / 2),
    new THREE.Vector3(volume.dimx / 2, volume.dimy / 2, volume.dimz / 2)
  );
  scene_stream.add(bounds);

  var lines = StreamLines(volume);
  lines.position.set(-volume.dimx / 2, -volume.dimy / 2, -volume.dimz / 2);
  scene_stream.add(lines);

  loop();

  function loop() {
    requestAnimationFrame(loop);
    trackball.update();
    light.position.copy(camera.position);
    renderer.render(scene_stream, camera);
  }
}
