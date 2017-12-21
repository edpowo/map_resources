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
var swToggleCollege = false;
var swToggleHS = false;

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

    for (i=0;i<iconlist.length;i++) {
	(function(j) {	// NB: wrap in new function b/c .loadImage is async
    	    var file = '{{ site.baseurl }}{{ site.images }}/' + iconlist[j].file;
    	    var name = iconlist[j].name;
    	    map.loadImage(file, function(error, link) {
    		if (error) throw error;
    		map.addImage(name, link);
    	    });
	})(i);
    }

    // LAYERS --------------------------------------------------------
   
    map.addLayer({
	'id': 'schools',
	'type': 'symbol',
	'source': 'schools',
	'minzoom': 7,
	'layout': {
	    'visibility': 'visible',
	    'icon-image': ['match',
			   ['get', 'a', ['at', ['get', 'z'], ['literal', s]]],
			   1, 'schoolad',
			   2, 'schoolna',
			   3, 'schooladnoc',
			   4, 'schoolnanoc',
			   5, 'college4',
			   6, 'college4',
			   7, 'college2',
			   8, 'college2',
			   'transparent'],
	    'icon-allow-overlap': true,
	    'icon-keep-upright': true,
	    'icon-size': [
		'interpolate', ['linear'], ['zoom'],
		7, 0.1,
		22, 1
	    ]
	}
    });
    
    // SIDEBAR -------------------------------------------------------

    // add to visible variable on these events, which triggers sidebar
    map.on('zoomend', addToVisible);
    map.on('move', addToVisible);

    // POPUPS --------------------------------------------------------

    map.on('mousemove', 'schools', function(e) {
	if (!(getCatLabel(s[e.features[0].id].a) === 'hs'
	      && swToggleCollege)) {
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

    elToggle.appendChild(createToggle('college'));
    elToggle.appendChild(createToggle('adjustcsr'));
    
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

    
