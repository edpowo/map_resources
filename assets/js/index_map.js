// RESCALE IF SMALL MOBILE -----------------------------------------------------

$( document ).ready(function() {      
    var smallMobile = window.matchMedia('(max-width: 600px)');
    if (smallMobile.matches) {
        minIconZoomScale = Math.floor(minIconZoomScale * smallScreenMinAdj);
	maxIconZoomScale = Math.floor(maxIconZoomScale * smallScreenMaxAdj);
    }
});

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
    style: 'mapbox://styles/mapbox/light-v9?optimize=true',
    center: [-96, 37.8],
    zoom: 2
}).fitBounds(bbox);

// init popup 
var popup = new mapboxgl.Popup({
    closeButton: false,
    anchor: 'bottom'
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
var swToggleHS = true;		// default: scale size by csr

// DATA ------------------------------------------------------------------------

var data = (function() {
    var data = null;
    $.ajax({
	'async': false,
	'url': '/map_resources/assets/data/icons.geojson',
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
  
    map.addSource('icons', {
    	type: 'geojson',
    	data: data
    });

    // XITLES --------------------------------------------------------

    var scr = [];
    for (i=0;i<s.length;i++) {
	if (typeof s[i][_csr] !== 'undefined' && s[i][_csr] !== null) {
	    scr.push(s[i][_csr]);
	}
    }
    var colPct = findPercentile(scr, scale_colPct);
    var comPct = findPercentile(scr, scale_comPct);
    var scr_min = findPercentile(scr, scale_hs_min);
    var scr_max = findPercentile(scr, scale_hs_max);

    // ICONS ---------------------------------------------------------

    for (i=0;i<iconlist.length;i++) {
	(function(j) {	// NB: wrap in new function b/c .loadImage is async
    	    var file = '/map_resources/assets/images/' + iconlist[j].file;
    	    var name = iconlist[j].name;
    	    map.loadImage(file, function(error, link) {
    		if (error) throw error;
    		map.addImage(name, link);
    	    });
	})(i);
    }

    // LAYERS --------------------------------------------------------
   
    map.addLayer({
	'id': 'icons',
	'type': 'symbol',
	'source': 'icons',
	'minzoom': minIconZoom,
	'layout': {
	    'visibility': 'visible',
	    'icon-image': ['match',
			   ['get', _cat, ['at', ['get', _id], ['literal', s]]],
			   1, 'schoolad',
			   2, 'schoolna',
			   3, 'schooladnoc',
			   4, 'schoolnanoc',
			   5, 'college4',
			   6, 'college4',
			   7, 'college2',
			   8, 'college2',
			   9, 'community',
			   'transparent'],
	    'icon-allow-overlap': true,
	    'icon-keep-upright': true,
	    'icon-size': [
		'interpolate', ['linear'], ['zoom'],
		minIconZoom, [
	    	    '*',
	    	    ['/', 1, ['min',
			      ['max',
			       ['to-number',
				['get', _csr, ['at', ['get', _id], ['literal', s]]],
				(['to-number',
				  ['get', _cat, ['at', ['get', _id], ['literal', s]]]
				 ] == 9) ? comPct : colPct
			       ],
			       scr_min],
			      scr_max]
		    ],
	    	    minIconZoomScale],
		maxIconZoom, [
	    	    '*',
	    	    ['/', 1, ['min',
			      ['max',
			       ['to-number',
				['get', _csr, ['at', ['get', _id], ['literal', s]]],
				(['to-number',
				  ['get', _cat, ['at', ['get', _id], ['literal', s]]]
				 ] == 9) ? comPct : colPct
			       ],
			       scr_min],
			      scr_max]
		    ],
	    	    maxIconZoomScale]
	    ]
	}
    });
    
    // SIDEBAR -------------------------------------------------------

    // add to visible variable on these events, which triggers sidebar
    map.on('zoomend', addToVisible);
    map.on('move', addToVisible);

    // POPUPS --------------------------------------------------------

    map.on('mousemove', 'icons', function(e) {
	if (!(swToggleCollege && getCatLabel(s[e.features[0].id][_cat]) === 'college')) {
	    map.getCanvas().style.cursor = 'pointer';
	    popup.create(e.features[0]);
	}
    });

    map.on('mouseleave', 'icons', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    // INPUT BOX -----------------------------------------------------

    elFilter.addEventListener('keyup', function(e) {
	textFilter(e, visible);
    });

    // COLLEGE TOGGLE BUTTON -----------------------------------------

    elToggle.appendChild(createToggle('college', colPct, comPct, scr_min, scr_max));
    // elToggle.appendChild(createToggle('adjustcsr', colPct, comPct, scr_min, scr_max));
    
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
    	    maxZoom: flyToZoom
    	},
    	trackUserLocation: false
    }));

    // add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // add scale control
    map.addControl(new mapboxgl.ScaleControl({
	maxWidth: scaleControlWidth,
	unit: 'imperial'
    }));

    // INIT EMPTY LISTINGS -------------------------------------------
    
    renderListings([]);
 
});

    
