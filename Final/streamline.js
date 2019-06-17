function StreamLines( volume )
{
    var smin = 0.0;
    var smax = 10.0;

    var line_set = new THREE.Group();
    var start_points = [];

    var p_material = new THREE.PointsMaterial();
    p_material.color = new THREE.Color("red");
    p_material.size = 0.3;
    var p_geometry = new THREE.Geometry();

    /*
    for(var i = 0; i < 500; i++)
    {
	var seed = seedPoint();
	start_points.push(seed);
	p_geometry.vertices.push(seed);
	}*/

    for(var i = 60; i < 80; i++)
    {
	for(var j = 40;j < 80; j++)
	{
	    var seed = new THREE.Vector3(50,j,i);
	    start_points.push(seed);
	    p_geometry.vertices.push(seed);
	}
    }
    
    line_set.add(new THREE.Points(p_geometry, p_material));
    
    var cmap = [];
    for ( var i = 0; i < 256; i++ )
    {
        var S = i / 255.0;
	var R = Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 );
        var G = Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
        var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var color = new THREE.Color( R, G, B );
	cmap.push(color);
    }

    var ep = 0.01;
    
    start_points.forEach(function(st){	
	var geometry = new THREE.Geometry();
	geometry.computeVertexNormals();
	var material = new THREE.LineBasicMaterial();
	material.linewidth = 2;
	material.vertexColors = THREE.VertexColors;

	var va = st;
	var vb = st;
	for(var i = 0; i < 15000; i++)
	{
	    var delta = tange(va);
	    vb = new THREE.Vector3(va.x + delta.x, va.y + delta.y, va.z + delta.z);
	    if(vb.x < ep || vb.y < ep || vb.z < ep
	       || vb.x > volume.dimx - ep || vb.x > volume.dimx - ep || vb.x > volume.dimx - ep)
		break;
	    var leng = (new THREE.Vector3(va.x-vb.x,va.y-vb.y,va.z-vb.z)).length();
	    geometry.colors.push(cmap[mapIndex(leng)]); geometry.colors.push(cmap[mapIndex(leng)]);
	    geometry.vertices.push( va ); geometry.vertices.push( vb );
	    va = new THREE.Vector3(vb.x,vb.y,vb.z);
	}
	line_set.add(new THREE.Line( geometry, material, THREE.LineSegments ));
    });
    
    return line_set;

    function seedPoint()
    {
	/*var x = Math.floor((Math.random() * 110) + 8);
	var y = Math.floor((Math.random() * 110) + 8);
	var z = Math.floor((Math.random() * 110) + 8);*/
	var x = 100;
	var y = Math.floor((Math.random() * 30) + 60);
	var z = Math.floor((Math.random() * 30) + 60);
	return new THREE.Vector3(x,y,z);
    }
    
    function tange(v)
    {
	var ix = Math.round(v.x);
	var iy = Math.round(v.y);
	var iz = Math.round(v.z);
	var dx = (values(ix + 1, iy, iz) - values(ix - 1, iy, iz)) / 2.0;
	var dy = (values(ix, iy + 1, iz) - values(ix, iy - 1, iz)) / 2.0;
	var dz = (values(ix, iy, iz + 1) - values(ix, iy, iz - 1)) / 2.0;
	return new THREE.Vector3(dx, dy, dz);
    }
    
    function values(x,y,z)
    {
	var lines = volume.dimx;
	var slices = volume.dimx * volume.dimy;
	return volume.value[x + y*lines + z*slices];
    }
    
    function interpolated_vertex(v0, v1)
    {
	var pv0 = v0.x*p[0] + v0.y*p[1] + v0.z*p[2] + p[3];
	var pv1 = v1.x*p[0] + v1.y*p[1] + v1.z*p[2] + p[3];
	var ratio = Math.abs(pv0 / (pv1 - pv0));
	var vx = v0.x * (1.0 - ratio) + v1.x * ratio;
	var vy = v0.y * (1.0 - ratio) + v1.y * ratio;
	var vz = v0.z * (1.0 - ratio) + v1.z * ratio;
	return new THREE.Vector3(vx, vy, vz);	
    }
    
    function interpolate_color(val0, val1)
    {
	var c0 = cmap[val0];
	var c1 = cmap[val1];
	var R_p = (c0.r + c1.r) / 2;
	var G_p = (c0.g + c1.g) / 2;
	var B_p = (c0.b + c1.b) / 2;
	return new THREE.Color(R_p, G_p, B_p);
    }
    
    function mapIndex(alpha)
    {
	if ( alpha <= smin ) {
	    alpha = smin;
	} else if ( alpha >= smax ) {
	    alpha = smax;
	}
	alpha = ( alpha - smin ) / ( smax - smin );
	var colorPosition = Math.round ( alpha * 256 );
	colorPosition == 256 ? colorPosition -= 1 : colorPosition;
	return colorPosition;
    }

}