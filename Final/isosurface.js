function main() {
  var volume = new KVS.LobsterData();
  var screen = new KVS.THREEScreen();
  var screen2 = new KVS.THREEScreen();
  var screen3 = new KVS.THREEScreen();
  var mesh;

  screen.init(volume, {
    width: window.innerWidth * 0.6,
    height: 500,
    targetDom: document.getElementById("lob_normal"),
    enableAutoResize: false
  });

  screen2.init(volume, {
    width: window.innerWidth * 0.6,
    height: 500,
    targetDom: document.getElementById("lob_test"),
    enableAutoResize: false
  });

  screen3.init(volume, {
    width: window.innerWidth * 0.6,
    height: 500,
    targetDom: document.getElementById("lob_stream"),
    enableAutoResize: false
  });

  setup();
  screen.loop();
  screen2.loop();
  screen3.loop();

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

    document.getElementById("label").innerHTML =
      "Isovalue: " + Math.round(isovalue);

    var line = KVS.ToTHREELine(box.exec(volume));
    mesh = KVS.ToTHREEMesh(
      isosurface.exec(volume),
      phongMaterial(light, camera)
    );
    var mesh2 = mesh.clone();
    // var mesh3 = mesh.clone();
    screen.scene.add(line);
    screen.scene.add(mesh);

    mesh2 = KVS.ToTHREEMesh(
      isosurface.exec(volume),
      raycasterMaterial(screen2, volume)
    );
    screen2.scene.add(line.clone());
    screen2.scene.add(mesh2);

    var seed_point = volume.objectCenter();
    var streamline = new KVS.Streamline();
    streamline.setIntegrationStepLength(0.5);
    streamline.setIntegrationTime(500);
    streamline.setIntegrationMethod(KVS.RungeKutta4);
    streamline.setIntegrationDirection(KVS.ForwardDirection);
    streamline.setLineWidth(5);
    streamline.setSeedPoint(seed_point);
    var line1 = KVS.ToTHREELine(box.exec(volume));
    var line2 = KVS.ToTHREELine(streamline.exec(volume));
    screen3.scene.add(line1);
    screen3.scene.add(line2);

    document
      .getElementById("isovalue")
      .addEventListener("mousemove", function() {
        var value = +document.getElementById("isovalue").value;
        var isovalue = KVS.Mix(smin, smax, value);
        document.getElementById("label").innerHTML =
          "Isovalue: " + Math.round(isovalue);
      });

    document
      .getElementById("isovalue_volumn")
      .addEventListener("mousemove", function() {
        var value = +document.getElementById("isovalue_volumn").value;
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
        mesh = KVS.ToTHREEMesh(
          isosurface.exec(volume),
          phongMaterial(light, camera)
        );
        screen.scene.add(mesh);
      });

    document
      .getElementById("change-isovalue-button_volumn")
      .addEventListener("click", function() {
        screen.scene.remove(mesh2);
        var value = +document.getElementById("isovalue_volumn").value;
        var isovalue = KVS.Mix(smin, smax, value);
        var isosurface = Isosurfaces(
          volume,
          isovalue,
          screen.camera,
          screen.light
        );
        var isosurface = new KVS.Isosurface();
        isosurface.setIsovalue(isovalue);
        mesh2 = KVS.ToTHREEMesh(
          isosurface.exec(volume),
          raycasterMaterial(screen2, volume)
        );
        screen2.scene.add(mesh2);
      });

    document.addEventListener("mousemove", function() {
      screen.light.position.copy(screen.camera.position);
      screen2.light.position.copy(screen.camera.position);
      screen3.light.position.copy(screen.camera.position);
    });

    window.addEventListener("resize", function() {
      screen.resize([window.innerWidth * 0.8, window.innerHeight]);
      screen2.resize([window.innerWidth * 0.8, window.innerHeight]);
      screen3.resize([window.innerWidth * 0.8, window.innerHeight]);
    });

    screen.draw();
    screen2.draw();
    screen3.draw();
  }
}

function changeIsovalue() {}

function phongMaterial(l, c) {
  let material = new THREE.ShaderMaterial({
    vertexColors: THREE.VertexColors,
    vertexShader: document.getElementById("shader.vert").text,
    fragmentShader: document.getElementById("shader.frag").text,
    uniforms: {
      light_position: { type: "v3", value: l.position },
      camera_position: { type: "v3", value: c.position }
    }
  });

  return material;
}

function raycasterMaterial(screen, volume) {
  var exit_texture = new THREE.WebGLRenderTarget(screen.width, screen.height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    format: THREE.RGBFormat,
    type: THREE.FloatType,
    generateMipmaps: false
  });
  var volume_texture = VolumeTexture(volume);
  var transfer_function_texture = TransferFunctionTexture();

  var raycaster_material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("raycaster.vert").textContent,
    fragmentShader: document.getElementById("raycaster.frag").textContent,
    side: THREE.FrontSide,
    uniforms: {
      volume_resolution: { type: "v3", value: volume.resolution },
      exit_points: { type: "t", value: exit_texture },
      volume_data: { type: "t", value: volume_texture },
      transfer_function_data: { type: "t", value: transfer_function_texture },
      light_position: { type: "v3", value: screen.light.position },
      camera_position: { type: "v3", value: screen.camera.position },
      background_color: {
        type: "v3",
        value: new THREE.Vector3().fromArray(
          screen.renderer.getClearColor().toArray()
        )
      }
    }
  });
  return raycaster_material;
}

function TransferFunctionTexture() {
  var resolution = 256;
  var width = resolution;
  var height = 1;
  var data = new Float32Array(width * height * 4);
  for (var i = 0; i < resolution; i++) {
    var color = KVS.RainbowColorMap(0, 255, i);
    var alpha = i / 255.0;
    data[4 * i + 0] = color.x;
    data[4 * i + 1] = color.y;
    data[4 * i + 2] = color.z;
    data[4 * i + 3] = alpha;
  }

  var format = THREE.RGBAFormat;
  var type = THREE.FloatType;

  var texture = new THREE.DataTexture(data, width, height, format, type);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function VolumeTexture(volume) {
  var width = volume.resolution.x * volume.resolution.z;
  var height = volume.resolution.y;
  var data = new Uint8Array(width * height);
  for (var z = 0, index = 0; z < volume.resolution.z; z++) {
    for (var y = 0; y < volume.resolution.y; y++) {
      for (var x = 0; x < volume.resolution.x; x++, index++) {
        var u = volume.resolution.x * z + x;
        var v = y;
        data[width * v + u] = volume.values[index][0];
      }
    }
  }

  var format = THREE.AlphaFormat;
  var type = THREE.UnsignedByteType;

  var texture = new THREE.DataTexture(data, width, height, format, type);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function TransferFunctionTexture() {
  var resolution = 256;
  var width = resolution;
  var height = 1;
  var data = new Float32Array(width * height * 4);
  for (var i = 0; i < resolution; i++) {
    var color = KVS.RainbowColorMap(0, 255, i);
    var alpha = i / 255.0;
    data[4 * i + 0] = color.x;
    data[4 * i + 1] = color.y;
    data[4 * i + 2] = color.z;
    data[4 * i + 3] = alpha;
  }

  var format = THREE.RGBAFormat;
  var type = THREE.FloatType;

  var texture = new THREE.DataTexture(data, width, height, format, type);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
