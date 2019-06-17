function main_plane() {
  var volume = new KVS.LobsterData();
  var screen = new KVS.THREEScreen();

  screen.init(volume, {
    width: window.innerWidth * 0.6,
    height: 500,
    targetDom: document.getElementById("lob_plane"),
    enableAutoResize: false
  });

  var bounds = Bounds(volume);
  screen.scene.add(bounds);

  var surfaces = Isosurfaces(volume);
  screen.scene.add(surfaces);

  document.addEventListener("mousemove", function() {
    screen.light.position.copy(screen.camera.position);
  });

  window.addEventListener("resize", function() {
    screen.resize([window.innerWidth, window.innerHeight]);
  });

  screen.loop();
}
