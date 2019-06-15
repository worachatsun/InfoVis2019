function main() {
  var volume = new KVS.LobsterData();
  var screen = new KVS.THREEScreen();

  screen.init(volume, {
    width: window.innerWidth * 0.6,
    height: 500,
    targetDom: document.getElementById("lob_normal"),
    enableAutoResize: false
  });

  var bounds = Bounds(volume);
  screen.scene.add(bounds);

  var isovalue = 128;
  var surfaces = Isosurfaces(volume, isovalue, screen.camera, screen.light);
  screen.scene.add(surfaces);

  document
    .getElementById("change-isovalue-button")
    .addEventListener("click", async function() {
      await screen.scene.remove(surfaces);
      let value = await document.getElementById("isovalue").value;
      var surfaces = await Isosurfaces(
        volume,
        value,
        screen.camera,
        screen.light
      );
      await screen.scene.add(surfaces);
    });

  document.addEventListener("mousemove", function() {
    screen.light.position.copy(screen.camera.position);
  });

  // window.addEventListener('resize', function() {
  //           screen.resize([
  //               500,
  //               500
  //           ]);
  //       });

  screen.loop();
}
