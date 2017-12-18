---
---

// INITS -----------------------------------------------------------------------

// public token
mapboxgl.accessToken = 'pk.eyJ1IjoiYnRza2lubmVyIiwiYSI6ImNqOTRhbzk1M'
    + 'TFhajIzNXFiMTdndnVsazEifQ.SHgqzAKZ52DTOCjGVMJgPw';

// bounding box
var bbox = [[-126.01318, 30.12227],
	    [-65.91797, 48.00164]];

// init map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/{{ site.mapstyle }}?optimize=true',
    center: [-96, 37.8],
    zoom: 4
}).fitBounds(bbox);

// init popup 
var popup = new mapboxgl.Popup({
    closeButton: false
});

// init structure to hold visible points
var visible = [];

// get HTML elements for listing, filter bar, instructions, and toggle
var elFilter = document.getElementById('feature-filter');
var elListing = document.getElementById('feature-listing');
var elInstructions = document.getElementById('instructions');
var elToggle = document.getElementById('toggle');

// init filter to be hidden
elFilter.parentNode.style.display = 'none';

// SWITCHES --------------------------------------------------------------------

var swFilter = false;
var swNoFilterMatch = false;
var swToggle = false;

// DATA ------------------------------------------------------------------------

var data = (function() {
    var data = null;
    $.ajax({
	'async': false,
	'url': '{{ site.baseurl }}/data/schools.geojson',
	'dataType': 'json',
	'success':  function(data) {
	    json = data;
	}
    });
    return json;
})();

// LOAD MAP --------------------------------------------------------------------
map.on('load', function () {

    // DATA ----------------------------------------------------------
  
    map.addSource('schools', {
    	type: 'geojson',
    	data: data
    });

    // ICONS ---------------------------------------------------------

    // for (var icon in icons) {
    // 	map.loadImage(icons[icon], function(error, link) {
    // 	    if (error) throw error;
    // 	    map.addImage(icon, link);
    // 	});
    // }

    map.loadImage('{{ site.baseurl }}{{ site.images }}/college-4.png',
		  function(error, image) {
    		      if (error) throw error;
    		      map.addImage('college4', image);
		  });
    map.loadImage('{{ site.baseurl }}{{ site.images }}/college-2.png',
		  function(error, image) {
    		      if (error) throw error;
    		      map.addImage('college2', image);
		  });
    map.loadImage('{{ site.baseurl }}{{ site.images }}/school.png',
		  function(error, image) {
    		      if (error) throw error;
    		      map.addImage('schoolna', image);
		  });
    map.loadImage('{{ site.baseurl }}{{ site.images }}/school-advising.png',
		  function(error, image) {
    		      if (error) throw error;
    		      map.addImage('schoolad', image);
		  });
    
    // LAYERS --------------------------------------------------------

    // map.addLayer({
    // 	'id': 'schools',
    // 	'type': 'circle',
    // 	'source': 'schools',
    // 	'minzoom': 7,
    // 	'layout': {
    // 	    'visibility': 'visible'
    // 	},
    // 	'paint': {
    // 	    'circle-radius': 6,
    // 	    'circle-color': {
    // 		property: 'm',
    // 		type: 'categorical',
    // 		stops: [
    // 		    [0, getColor(rtorange)],
    // 		    [1, getColor(jeffblue)]
    // 		]
    // 	    }
    // 	}
    // });

    map.addLayer({
	'id': 'schools',
	'type': 'symbol',
	'source': 'schools',
	'minzoom': 7,
	'layout': {
	    'visibility': 'visible',
	    'icon-image': {
		'property': 'a',
		'type': 'categorical',
		'stops': [
		    [0, 'schoolna'],
		    [1, 'schoolad'],
		    [2, 'college4'],
		    [3, 'college4'],
		    [4, 'college2'],
		    [5, 'college2']
		]
	    },
	    'icon-allow-overlap': true,
	    'icon-keep-upright': true,
	    'icon-size': 0.05
	},
	'paint': {
	    'icon-opacity': {
		'property': 'a',
		'type': 'categorical',
		'stops': [
		    [0, 1],
		    [1, 1],
		    [2, 1],
		    [3, 1],
		    [4, 1],
		    [5, 1]
		]
	    }
	}
    });
    
    // SIDEBAR -------------------------------------------------------

    // add to visible variable on these events, which triggers sidebar
    map.on('zoomend', addToVisible);
    map.on('move', addToVisible);

    // POPUPS --------------------------------------------------------

    map.on('mousemove', 'schools', function(e) {
	if (!(s[e.features[0].id].a < 2 && swToggle)) {
	    map.getCanvas().style.cursor = 'pointer';
	    popup.create(e.features[0]);
	}
    });

    map.on('mouseleave', 'schools', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    // INPUT BOX -----------------------------------------------------

    elFilter.addEventListener('keyup', function(e) {
	textFilter(e, visible);
    });

    // COLLEGE TOGGLE BUTTON -----------------------------------------

    elToggle.appendChild(createToggle());
    
    // CONTROLS ------------------------------------------------------

    // add geocoder
    map.addControl(new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	country: 'US'
    }));
    
    // add geolocate control to the map
    map.addControl(new mapboxgl.GeolocateControl({
    	positionOptions: {
            enableHighAccuracy: true
    	},
    	fitBoundsOptions: {
    	    maxZoom: 12
    	},
    	trackUserLocation: false
    }));

    // add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // INIT EMPTY LISTINGS -------------------------------------------
    
    renderListings([]);
 
});

    
