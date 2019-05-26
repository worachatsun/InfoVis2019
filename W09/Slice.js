Slice = volume => {
  const { x, y, z } = volume.max_coord;
  let slice = new THREE.Mesh(
    new THREE.PlaneGeometry(x, y, z),
    new THREE.MeshBasicMaterial({ color: 0xffc733, side: THREE.DoubleSide })
  );
  slice.position.x = x / 2;
  slice.position.y = y / 2;
  slice.position.z = z / 2;

  return slice;
};
