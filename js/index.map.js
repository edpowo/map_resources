---
---

// reference
// school information: s (array)
//
// a := school name
// b := state fips
// c := sector (college)
// d := enrollment (hs)
// e := frpl pct (hs)
// f := student / counselor ratio (hs)

// INIT MAP ----------------------------------------------------------

// public token
mapboxgl.accessToken = 'pk.eyJ1IjoiYnRza2lubmVyIiwiYSI6ImNqOTRhbzk1M'
    + 'TFhajIzNXFiMTdndnVsazEifQ.SHgqzAKZ52DTOCjGVMJgPw';

// init map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/{{ site.mapstyle }}',
    center: [-96, 37.8],
    zoom: 4
});

// VARIABLES ---------------------------------------------------------

// init popup 
var popup = new mapboxgl.Popup({
    closeButton: false
});

// init structure to hold visible points
var visible = [];

// init message variable
var messages = ['Zoom or drag the map to populate results',
		'Check spelling or drag the map to re-populate results'];

// get HTML elements for listing and filter bar
var filterEl = document.getElementById('feature-filter');
var listingEl = document.getElementById('feature-listing');

// init filter to be hidden
filterEl.parentNode.style.display = 'none';

// init filtering switch
var filterSwitch = false;

// GENERAL FUNCTIONS -------------------------------------------------

// adds .remove() function if using old browser 
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

// trim and lower string
function normalize(string) {
    return string.trim().toLowerCase();
}

// MAPPING FUNCTIONS -------------------------------------------------

// primary function to populate listings 
function renderListings(features) {

    // clear any existing listings
    listingEl.innerHTML = '';

    // if there are items visible on the map...
    if (features.length) {

	// return filter text to black
	filterEl.style.color = '#000';

	// sort so that they are listed alphabetically in list
	features.sort(function(x,y) {
	    
	    if(s[x.id].a < s[y.id].a) return -1;
	    if(s[x.id].a > s[y.id].a) return 1;
	    return 0; 

	});
	
        features.forEach(function(feature) {

	    // var schname = getProperty(s, a, id);
	    var schname = s[feature.id].a;
            var item = document.createElement('p');

            item.textContent = schname;
            item.addEventListener('mouseover', function() {
                // add popup when mousing over
                popup.setLngLat(feature.geometry.coordinates)
                    .setText(schname)
                    .addTo(map);
            });
	    item.addEventListener('mouseleave', function() {
                // remove popup on mouseleave
                popup.remove();
            });
	    
            listingEl.appendChild(item);
        });

        // show the filter input
        filterEl.parentNode.style.display = 'block';

	// ...otherwise
    } else {

	var empty = document.createElement('p');
        
        // hide the filter input
	if (filterSwitch) {
	    // change color of input text
	    filterEl.style.color = getColor(rtorange);
	    message = messages[1];
	    listingEl.appendChild(empty);
	} else {
	    filterEl.parentNode.style.display = 'none';
	    message = messages[0]
	}

	empty.textContent = message;
	
        // remove features filter
        map.setFilter('schools', ['has', '$id']);
    }
}

// only want unique items in the list
function getUniqueFeatures(array, comparatorProperty) {

    // init dictionary that will associate IDs with T/F
    var existingFeatureKeys = {};

    var uniqueFeatures = array.filter(function(el) {
        if (existingFeatureKeys[el.properties[comparatorProperty]]) {
            return false;
        } else {
            existingFeatureKeys[el.properties[comparatorProperty]] = true;
            return true;
        }
    });

    return uniqueFeatures;
}

// only want unique items in the list (by ID)
function getUniqueFeaturesByID(array) {

    // init dictionary that will associate IDs with T/F
    var existingFeatureKeys = {};

    var uniqueFeatures = array.filter(function(el) {
        if (existingFeatureKeys[el.id]) {
            return false;
        } else {
            existingFeatureKeys[el.id] = true;
            return true;
        }
    });

    return uniqueFeatures;
}

function addToVisible() {

    filterSwitch = false;
    map.setFilter('schools', ['has', '$id']);
    
    var features = map.queryRenderedFeatures({layers:['schools']});
    
    if (features) {
        var uniqueFeatures = getUniqueFeaturesByID(features, 'id');
        // Populate features for the listing overlay.
	renderListings(uniqueFeatures);
	
        // Clear the input container
        filterEl.value = '';
	
        // Store the current features in school variable to
        // later use for filtering on `keyup`.
	visible = uniqueFeatures;
    }
}

// load map
map.on('load', function () {

    // DATA ----------------------------------------------------------

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

    // add to visible variable on these events, which triggers sidebar
    map.on('zoomstart', function() {
	map.setFilter('schools', ['has', '$id']);
    });
    map.on('movestart', function() {
	map.setFilter('schools', ['has', '$id']);
    });
    map.on('zoomend', addToVisible);
    map.on('moveend', addToVisible);

    // POPUPS --------------------------------------------------------

    map.on('mousemove', 'schools', function(e) {
        // change the cursor style to pointer finger
        map.getCanvas().style.cursor = 'pointer';

        // populate the popup and set its coordinates based on the feature
        var feature = e.features[0];
        popup.setLngLat(feature.geometry.coordinates)
	    .setText(s[feature.id].a)
            .addTo(map);
    });

    map.on('mouseleave', 'schools', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    // Call this function on initialization
    // passing an empty array to render an empty state
    renderListings(visible);
    
    // CONTROLS ------------------------------------------------------

    // filter box
    filterEl.addEventListener('keyup', function(e) {

	filterSwitch = true;
	
        var value = normalize(e.target.value);

        // remove visible features that don't match the input value.
        var filtered = visible.filter(function(feature) {
            var name = normalize(s[feature.id].a);
            // return name.indexOf(value) > -1 || code.indexOf(value) > -1;
	    return name.indexOf(value) > -1
        });

        // populate the sidebar with filtered results
        renderListings(filtered);

        // set the filter to populate features into the layer
        map.setFilter('schools', ['in', '$id'].concat(filtered.map(function(feature) {
            return feature.id;
        })));
	popup.remove();

    });
    
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

 
});

    
