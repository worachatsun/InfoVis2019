function main() {
  //var volume = new KVS.SingleCubeData();
  //var volume = new KVS.CreateHydrogenData( 64, 64, 64 );
  var volume = new KVS.LobsterData();
  var screen = new KVS.THREEScreen();
  var mesh;

  screen.init(volume, {
    width: window.innerWidth * 0.6,
    height: 500,
    targetDom: document.getElementById("lob_normal"),
    enableAutoResize: false
  });
  setup();
  screen.loop();

  function setup() {
    var color = new KVS.Vec3(0, 0, 0);
    var box = new KVS.BoundingBox();
    box.setColor(color);
    box.setWidth(2);

    var smin = volume.min_value;
    var smax = volume.max_value;
    var isovalue = KVS.Mix(smin, smax, 0.5);
    var isosurface = new KVS.Isosurface();
    isosurface.setIsovalue(isovalue);

    var light = new THREE.PointLight();
    light.position.set(5, 5, 5);
    screen.scene.add(light);

    var camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    camera.position.set(0, 0, 7);
    screen.scene.add(camera);

    let material = new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      vertexShader: document.getElementById("shader.vert").text,
      fragmentShader: document.getElementById("shader.frag").text,
      uniforms: {
        light_position: { type: "v3", value: light.position },
        camera_position: { type: "v3", value: camera.position }
      }
    });

    document.getElementById("label").innerHTML =
      "Isovalue: " + Math.round(isovalue);

    var line = KVS.ToTHREELine(box.exec(volume));
    mesh = KVS.ToTHREEMesh(isosurface.exec(volume), material);
    screen.scene.add(line);
    screen.scene.add(mesh);

    document
      .getElementById("isovalue")
      .addEventListener("mousemove", function() {
        var value = +document.getElementById("isovalue").value;
        var isovalue = KVS.Mix(smin, smax, value);
        document.getElementById("label").innerHTML =
          "Isovalue: " + Math.round(isovalue);
      });

    document
      .getElementById("change-isovalue-button")
      .addEventListener("click", function() {
        screen.scene.remove(mesh);
        var value = +document.getElementById("isovalue").value;
        var isovalue = KVS.Mix(smin, smax, value);
        var isosurface = Isosurfaces(
          volume,
          isovalue,
          screen.camera,
          screen.light
        );
        var isosurface = new KVS.Isosurface();
        isosurface.setIsovalue(isovalue);
        mesh = KVS.ToTHREEMesh(isosurface.exec(volume), material);
        screen.scene.add(mesh);
      });

    document.addEventListener("mousemove", function() {
      screen.light.position.copy(screen.camera.position);
    });

    window.addEventListener("resize", function() {
      screen.resize([window.innerWidth * 0.8, window.innerHeight]);
    });

    screen.draw();
  }
}

function changeIsovalue() {}
