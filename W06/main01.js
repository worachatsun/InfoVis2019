function main() {
  var width = 1000;
  var height = 500;

  var scene = new THREE.Scene();

  var fov = 45;
  var aspect = width / height;
  var near = 1;
  var far = 1000;
  var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 5);
  scene.add(camera);

  var light = new THREE.PointLight();
  light.position.set(5, 5, 5);
  scene.add(light);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  var geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 20);

  var material_lam = new THREE.ShaderMaterial({
    vertexColors: THREE.VertexColors,
    vertexShader: document.getElementById("gouraud.vert.lam").text,
    fragmentShader: document.getElementById("gouraud.frag").text,
    uniforms: {
      light_position: { type: "v3", value: light.position }
    }
  });

  var material_phong = new THREE.ShaderMaterial({
    vertexColors: THREE.VertexColors,
    vertexShader: document.getElementById("gouraud.vert.phong").text,
    fragmentShader: document.getElementById("gouraud.frag").text,
    uniforms: {
      light_position: { type: "v3", value: light.position },
      camera_position: { type: "v3", value: camera.position }
    }
  });

  geometry.faces.map(face => (face.color = new THREE.Color(0xbfebee)));

  var torus_knot_lam = new THREE.Mesh(geometry, material_lam);
  var torus_knot_phong = new THREE.Mesh(geometry, material_phong);

  torus_knot_lam.position.set(-2, 0, 0);
  torus_knot_phong.position.set(2, 0, 0);

  scene.add(torus_knot_lam);
  scene.add(torus_knot_phong);

  loop();

  function loop() {
    requestAnimationFrame(loop);
    torus_knot_lam.rotation.x += 0.01;
    torus_knot_lam.rotation.y += 0.01;
    torus_knot_phong.rotation.x += 0.01;
    torus_knot_phong.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
}
