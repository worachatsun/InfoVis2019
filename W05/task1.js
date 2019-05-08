const vertices = [
  [-0.6, -0.6, -0.6],
  [0.6, -0.6, -0.6],
  [0.6, -0.6, 0.6],
  [-0.6, -0.6, 0.6],

  [-0.6, 0.6, -0.6],
  [0.6, 0.6, -0.6],
  [0.6, 0.6, 0.6],
  [-0.6, 0.6, 0.6]
];

const asstes = [
  { face: [0, 1, 2], color: 0x0040ff }, //blue
  { face: [0, 3, 2], color: 0x00bfff },
  { face: [1, 2, 5], color: 0xcc6600 }, //brown
  { face: [2, 5, 6], color: 0xb35900 },
  { face: [1, 5, 0], color: 0xff751a }, //orange
  { face: [0, 5, 4], color: 0xff8533 },
  { face: [0, 3, 4], color: 0x00b300 }, //green
  { face: [3, 4, 7], color: 0x00cc00 },
  { face: [2, 3, 7], color: 0x1a1a1a }, //black
  { face: [2, 6, 7], color: 0x333333 },
  { face: [4, 5, 7], color: 0xb300b3 }, //purple
  { face: [5, 6, 7], color: 0xe600e6 }
];

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 3;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 500);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.Geometry();
let material = new THREE.MeshBasicMaterial();

vertices.map(ver => {
  const vertice = new THREE.Vector3().fromArray(ver);
  geometry.vertices.push(vertice);
});

asstes.map((asset, index) => {
  const tFace = new THREE.Face3(asset.face[0], asset.face[1], asset.face[2]);
  geometry.faces.push(tFace);
  geometry.faces[index].color = new THREE.Color(asset.color);
});

geometry.computeFaceNormals();

material.side = THREE.DoubleSide;
material.vertexColors = THREE.FaceColors;

let cube = new THREE.Mesh(geometry, material);

scene.add(cube);

loop();

function loop() {
  requestAnimationFrame(loop);
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.005;
  renderer.render(scene, camera);
}
