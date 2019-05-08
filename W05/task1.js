var vertices = [
  [-0.6, -0.6, -0.6],
  [0.6, -0.6, -0.6],
  [0.6, -0.6, 0.6],
  [-0.6, -0.6, 0.6],

  [-0.6, 0.6, -0.6],
  [0.6, 0.6, -0.6],
  [0.6, 0.6, 0.6],
  [-0.6, 0.6, 0.6]
];

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 500);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.Geometry();

vertices.map(ver => {
  const vertice = new THREE.Vector3().fromArray(ver);
  geometry.vertices.push(vertice);
});

const faces = [];
var f0 = new THREE.Face3(0, 1, 2);
var f1 = new THREE.Face3(0, 3, 2);
var f2 = new THREE.Face3(1, 2, 5);
var f3 = new THREE.Face3(1, 5, 0);
var f4 = new THREE.Face3(0, 5, 4);
var f5 = new THREE.Face3(0, 3, 4);
var f6 = new THREE.Face3(3, 4, 7);
var f7 = new THREE.Face3(2, 3, 7);
var f8 = new THREE.Face3(4, 5, 7);
var f9 = new THREE.Face3(2, 5, 6);
var f10 = new THREE.Face3(2, 6, 7);
var f11 = new THREE.Face3(5, 6, 7);
geometry.faces.push(f0);
geometry.faces.push(f1);
geometry.faces.push(f2);
geometry.faces.push(f3);
geometry.faces.push(f4);
geometry.faces.push(f5);
geometry.faces.push(f6);
geometry.faces.push(f7);
geometry.faces.push(f8);
geometry.faces.push(f9);
geometry.faces.push(f10);
geometry.faces.push(f11);
// geometry.computeFaceNormals();

var material = new THREE.MeshBasicMaterial();
material.side = THREE.DoubleSide;
material.vertexColors = THREE.FaceColors;
geometry.faces[0].color = new THREE.Color(0xdd7778);
geometry.faces[1].color = new THREE.Color(0xdda197);
geometry.faces[2].color = new THREE.Color(0xffa147);
geometry.faces[3].color = new THREE.Color(0xf9ad4f);
geometry.faces[4].color = new THREE.Color(0x894633);
geometry.faces[5].color = new THREE.Color(0xa64a31);
geometry.faces[6].color = new THREE.Color(0x53bab0);
geometry.faces[7].color = new THREE.Color(0xadbc8a);
geometry.faces[8].color = new THREE.Color(0x91164d);
geometry.faces[9].color = new THREE.Color(0xe76c01);
geometry.faces[10].color = new THREE.Color(0x249acf);
geometry.faces[11].color = new THREE.Color(0x353037);

geometry.computeFaceNormals();

var cube = new THREE.Mesh(geometry, material);
cube.rotation.x = -0.1;
cube.rotation.y = 0;
cube.rotation.z = 0;
scene.add(cube);

camera.position.z = 3;

loop();

function loop() {
  requestAnimationFrame(loop);
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.005;
  renderer.render(scene, camera);
}
