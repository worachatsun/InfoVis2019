function main_streamline()
{
    var volume = new KVS.CreateTornadoData( 64, 64, 64 );
    var screen = new KVS.THREEScreen();

    screen.init( volume , {
    width: window.innerWidth * 0.6,
    height: 500,
    targetDom: document.getElementById("lob_stream"),
    enableAutoResize: false
  });
    setup();
    screen.loop();

    function setup()
    {
        var color = new KVS.Vec3( 0, 0, 0 );
        var box = new KVS.BoundingBox();
        box.setColor( color );
        box.setWidth( 2 );
        var val_x = 31.5;
        var val_y = 31.5;
        var val_z = 31.5;
        var seed_point = volume.objectCenter();
        var streamline = new KVS.Streamline();
        streamline.setIntegrationStepLength( 0.5 );
        streamline.setIntegrationTime( 500 );
        streamline.setIntegrationMethod( KVS.RungeKutta4 );
        streamline.setIntegrationDirection( KVS.ForwardDirection );
        streamline.setLineWidth( 5 );
        streamline.setSeedPoint( seed_point );

        var line1 = KVS.ToTHREELine( box.exec( volume ) );
        var line2 = KVS.ToTHREELine( streamline.exec( volume ) );

        screen.scene.add( line1 );
        screen.scene.add( line2 );

        document
            .getElementById("sl_x")
            .addEventListener("mousemove", function() {
                var value = +document.getElementById("sl_x").value;
                document.getElementById("label_x").innerHTML =
                "X: " + value;
        });

        document
            .getElementById("sl_y")
            .addEventListener("mousemove", function() {
                var value = +document.getElementById("sl_y").value;
                document.getElementById("label_y").innerHTML =
                "Y: " + value;
        });

        document
            .getElementById("sl_z")
            .addEventListener("mousemove", function() {
                var value = +document.getElementById("sl_z").value;
                document.getElementById("label_z").innerHTML =
                "Z: " + value;
        });

        document
            .getElementById("change")
            .addEventListener("click", function() {
                val_x = +document.getElementById("sl_x").value;
                val_y = +document.getElementById("sl_y").value;
                val_z = +document.getElementById("sl_z").value;
                var seed_point = {x: val_x, y: val_y, z: val_z};
                streamline.setIntegrationStepLength( 0.5 );
                streamline.setIntegrationTime( 500 );
                streamline.setIntegrationMethod( KVS.RungeKutta4 );
                streamline.setIntegrationDirection( KVS.ForwardDirection );
                streamline.setLineWidth( 5 );
                streamline.setSeedPoint( seed_point );
                var line2 = KVS.ToTHREELine( streamline.exec( volume ) );
                screen.scene.add( line2 );
        });

        screen.draw();

        document.addEventListener( 'mousemove', function() {
            screen.light.position.copy( screen.camera.position );
        });
    }
}