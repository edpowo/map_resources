// reference
// school information: s (array)
//
// a := school name
// b := state fips
// c := sector (college)
// d := enrollment (hs)
// e := frpl pct (hs)
// f := student / counselor ratio (hs)

// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

// public token
mapboxgl.accessToken = 'pk.eyJ1IjoiYnRza2lubmVyIiwiYSI6ImNqOTRhbzk1MTFhajIzNXFiMTdndnVsazEifQ.SHgqzAKZ52DTOCjGVMJgPw';

// init map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-96, 37.8],
    zoom: 4
});

// load map
map.on('load', function () {

    // CONTROLS ------------------------------------------------------
    
    // add geolocate control to the map.
    map.addControl(new mapboxgl.GeolocateControl({
    	positionOptions: {
            enableHighAccuracy: true
    	},
    	fitBoundsOptions: {
    	    maxZoom: 12
    	},
    	trackUserLocation: false
    }));

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // DATA ----------------------------------------------------------

    var data = (function() {
	var data = null;
	$.ajax({
	    'async': false,
	    'url': '/map_resources/data/schools.geojson',
	    'dataType': 'json',
	    'success':  function(data) {
		json = data;
	    }
	});
	return json;
    })();
    
    // add schools data
    map.addSource('schools', {
    	type: 'geojson',
    	data: data
    });

    // LAYER ---------------------------------------------------------
     
    // add schools layer
    map.addLayer({
    	'id': 'schools',
    	'type': 'circle',
    	'source': 'schools',
    	'minzoom': 7,
    	'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'circle-radius': 6,
            'circle-color': {
		property: 'l',
		type: 'categorical',
		stops: [
		    [0, getColor(rtorange)],
		    [1, getColor(jeffblue)]
		]
	    }
        }
    });

    // SIDEBAR -------------------------------------------------------

    buildSchoolInfoList(data);

    var visible = [];

    // POPUPS --------------------------------------------------------

    // Add an event listener for when a user clicks on the map
    map.on('click', function(e) {
	// Query all the rendered points in the view
	var features = map.queryRenderedFeatures(e.point, { layers: ['schools'] });
	if (features.length) {
	    var clickedPoint = features[0];
	    // 1. fly to the point
	    flyToSchool(clickedPoint);
	    // 2. close all other popups and display popup for clicked school
	    createPopUp(clickedPoint);
	    // 3. highlight listing in sidebar (and remove highlight for all other listings)
	    var activeItem = document.getElementsByClassName('active');
	    if (activeItem[0]) {
		activeItem[0].classList.remove('active');
	    }
	    // Find the index of the school that corresponds to the clickedPoint
	    // that fired the event listener
	    var selectedFeature = clickedPoint.id;
	    
	    for (var i = 0; i < data.features.length; i++) {
		if (data.features[i].id === selectedFeature) {
		    selectedFeatureIndex = i;
		}
	    }
	    // Select the correct list item using the found index and add the active class
	    var listing = document.getElementById('info-' + selectedFeatureIndex);
	    listing.classList.add('active');
	}
    });

    
    
    // // create popup
    // var popup = new mapboxgl.Popup({
    //     closeButton: false,
    //     closeOnClick: false
    // });

    // // when hovering...
    // map.on('mouseenter', 'schools', function(e) {
    //     // change cursor to pointer
    //     map.getCanvas().style.cursor = 'pointer';

    //     // add popup with name
    //     popup.setLngLat(e.features[0].geometry.coordinates)
    //         .setHTML(s[e.features[0].id].a)
    //         .addTo(map);
    // });

    // // ...when leaving
    // map.on('mouseleave', 'schools', function() {
    // 	// return cursor to normal
    //     map.getCanvas().style.cursor = '';
    // 	// remove popup
    //     popup.remove();
    // });
  
});

    
