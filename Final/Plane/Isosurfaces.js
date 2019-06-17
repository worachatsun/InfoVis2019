function Isosurfaces(volume) {
  var geometry = new THREE.Geometry();
  let material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
    side: THREE.DoubleSide
  });

  var sq_dimension = {
    a: 5.0,
    b: 0.0,
    c: -40.3,
    d: 200.0
  };

  var cmap = [];
  for (var i = 0; i < 256; i++) {
    var S = i / 256; // [0,1]
    var R = Math.max(Math.cos((S - 1.0) * Math.PI), 0.0);
    var G = Math.max(Math.cos((S - 0.5) * Math.PI), 0.0);
    var B = Math.max(Math.cos(S * Math.PI), 0.0);
    var color = new THREE.Color(R, G, B);
    cmap.push(color);
  }

  var lines = volume.resolution.x;
  var slices = volume.resolution.x * volume.resolution.y;

  var lut = new KVS.MarchingCubesTable();
  var cell_index = 0;
  var counter = 0;
  for (var z = 0; z < volume.resolution.z - 1; z++) {
    for (var y = 0; y < volume.resolution.y - 1; y++) {
      for (var x = 0; x < volume.resolution.x - 1; x++) {
        // var indices = cell_node_indices(cell_index++);
        var index = table_index(x, y, z);
        if (index == 0) {
          continue;
        }
        if (index == 255) {
          continue;
        }

        for (var j = 0; lut.edgeID[index][j] != -1; j += 3) {
          var eid0 = lut.edgeID[index][j];
          var eid1 = lut.edgeID[index][j + 2];
          var eid2 = lut.edgeID[index][j + 1];

          var vid0 = lut.vertexID[eid0][0];
          var vid1 = lut.vertexID[eid0][1];
          var vid2 = lut.vertexID[eid1][0];
          var vid3 = lut.vertexID[eid1][1];
          var vid4 = lut.vertexID[eid2][0];
          var vid5 = lut.vertexID[eid2][1];

          var v0 = new THREE.Vector3(x + vid0[0], y + vid0[1], z + vid0[2]);
          var v1 = new THREE.Vector3(x + vid1[0], y + vid1[1], z + vid1[2]);
          var v2 = new THREE.Vector3(x + vid2[0], y + vid2[1], z + vid2[2]);
          var v3 = new THREE.Vector3(x + vid3[0], y + vid3[1], z + vid3[2]);
          var v4 = new THREE.Vector3(x + vid4[0], y + vid4[1], z + vid4[2]);
          var v5 = new THREE.Vector3(x + vid5[0], y + vid5[1], z + vid5[2]);

          var v01 = interpolated_vertex(v0, v1);
          var v23 = interpolated_vertex(v2, v3);
          var v45 = interpolated_vertex(v4, v5);

          geometry.vertices.push(v01);
          geometry.vertices.push(v23);
          geometry.vertices.push(v45);

          var id0 = counter++;
          var id1 = counter++;
          var id2 = counter++;

          var { C01, C23, C45 } = color_creater();

          var face = new THREE.Face3(id0, id1, id2);
          face.vertexColors.push(C01);
          face.vertexColors.push(C23);
          face.vertexColors.push(C45);
          geometry.faces.push(face);
        }
      }
      cell_index++;
    }
    cell_index += volume.resolution.x;
  }

  geometry.computeVertexNormals();

  material.vertexColors = THREE.VertexColors;

  return new THREE.Mesh(geometry, material);

  function table_index(x, y, z) {
    var s0 = plane(x, y, z, sq_dimension);
    var s1 = plane(x + 1, y, z, sq_dimension);
    var s2 = plane(x + 1, y + 1, z, sq_dimension);
    var s3 = plane(x, y + 1, z, sq_dimension);
    var s4 = plane(x, y, z + 1, sq_dimension);
    var s5 = plane(x + 1, y, z + 1, sq_dimension);
    var s6 = plane(x + 1, y + 1, z + 1, sq_dimension);
    var s7 = plane(x, y + 1, z + 1, sq_dimension);

    var index = 0;
    if (s0 > 0) {
      index |= 1;
    }
    if (s1 > 0) {
      index |= 2;
    }
    if (s2 > 0) {
      index |= 4;
    }
    if (s3 > 0) {
      index |= 8;
    }
    if (s4 > 0) {
      index |= 16;
    }
    if (s5 > 0) {
      index |= 32;
    }
    if (s6 > 0) {
      index |= 64;
    }
    if (s7 > 0) {
      index |= 128;
    }

    return index;
  }

  function interpolated_vertex(v0, v1) {
    let plane0 = plane(v0.x, v0.y, v0.z, sq_dimension);
    let t = plane0 / (plane0 - plane(v1.x, v1.y, v1.z, sq_dimension));
    return new THREE.Vector3(
      v0.x * (1 - t) + v1.x * t,
      v0.y * (1 - t) + v1.y * t,
      v0.z * (1 - t) + v1.z * t
    );
  }

  function plane(x, y, z, dimen) {
    let { a, b, c, d } = dimen;
    return a * x + b * y + c * z + d;
  }

  function color_creater() {
    var s0 = volume.values[v0.x + v0.y * lines + v0.z * slices];
    var s1 = volume.values[v1.x + v1.y * lines + v1.z * slices];
    var s2 = volume.values[v2.x + v2.y * lines + v2.z * slices];
    var s3 = volume.values[v3.x + v3.y * lines + v3.z * slices];
    var s4 = volume.values[v4.x + v4.y * lines + v4.z * slices];
    var s5 = volume.values[v5.x + v5.y * lines + v5.z * slices];

    return {
      C01: new THREE.Color(
        cmap[s0].r + cmap[s1].r,
        cmap[s0].g + cmap[s1].g,
        cmap[s0].b + cmap[s1].b
      ),
      C23: new THREE.Color(
        cmap[s2].r + cmap[s3].r,
        cmap[s2].g + cmap[s3].g,
        cmap[s2].b + cmap[s3].b
      ),
      C45: new THREE.Color(
        cmap[s4].r + cmap[s5].r,
        cmap[s4].g + cmap[s5].g,
        cmap[s4].b + cmap[s5].b
      )
    };
  }
}
