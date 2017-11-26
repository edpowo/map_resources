---
---

// reference
// school information: s (array)
//
// a := name
// b := fips
// c := sector (college)
// d := enrollment (hs)
// e := frpl pct (hs)
// f := stu/cou ratio (hs)
// g := district name
// h := district enrollment g12
// i := district frpl pct
// j := district stu/cou ratio
// k := district fafsa pct
// l := hs advising orgs
// m := is college

// INIT MAP ----------------------------------------------------------

// public token
mapboxgl.accessToken = 'pk.eyJ1IjoiYnRza2lubmVyIiwiYSI6ImNqOTRhbzk1M'
    + 'TFhajIzNXFiMTdndnVsazEifQ.SHgqzAKZ52DTOCjGVMJgPw';

// init map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/{{ site.mapstyle }}?optimize=true',
    center: [-96, 37.8],
    zoom: 4
});

// fit bounds based on screen view
var bbox = [[-126.01318, 30.12227],
	    [-65.91797, 48.00164]];
map.fitBounds(bbox);

// POPUP & TEXT ------------------------------------------------------

// init popup 
var popup = new mapboxgl.Popup({
    closeButton: false
});

function popupText(hs, schname, sect, schenroltot, schfrpl, schcsr,
		   distname, distenrol, distfrpl, distcsr, distfafsa, advorgs) {

    // init popup format string
    var htmlstr;

    // convert undefined values into hyphens (skipping first)
    for (i = 1; i < arguments.length - 1; i++) {
	arguments[i] = (typeof arguments[i] == 'undefined' ? '-' : arguments[i]);
    }

    if (hs) {
	htmlstr = "<h2>" + schname + "</h2>";
	htmlstr += "<h3>District: " + distname + "</h3>";
	htmlstr += "<table>";
	htmlstr += "<tr><th></th><th>District</th><th>School</th></tr>";
	htmlstr += "<tr><td>12th grade enrollment</td>"
	    + "<td class = 'num'>" + distenrol + "</td>"
	    + "<td class = 'num'>" + schenroltot + "</td></tr>";
	htmlstr += "<tr><td>FRPL (%)</td>"
	    + "<td class = 'num'>" + distfrpl + "</td>"
	    + "<td class = 'num'>" + schfrpl + "</td></tr>";
	htmlstr += "<tr><td>Students per counselor</td>"
	    + "<td class = 'num'>" + distcsr + "</td>"
	    + "<td class = 'num'>" + schcsr + "</td></tr>";
	htmlstr += "</table>";

	// get advising orgs, splitting on pipe (|)
	htmlstr += "<h2>Advising organizations</h2>";
	if (advorgs != undefined) {
	    var orgs = advorgs.split("|");
	    for (i = 0; i < orgs.length; i++) {
		htmlstr += orgs[i] + "</br>";
	    }
	} else {
	    htmlstr += "None"
	}
	
    } else {
	htmlstr = "<h2>" + schname + "</h2>";
	htmlstr += "<b>Sector: </b>" + sector[sect];
    }
    return htmlstr;
}

// VARIABLES ---------------------------------------------------------

// init structure to hold visible points
var visible = [];

// init message variable
var messages = ['Zoom or drag the map to populate results',
		'Check spelling or drag the map to re-populate results'];

// get HTML elements for listing, filter bar, and instructions
var filterEl = document.getElementById('feature-filter');
var listingEl = document.getElementById('feature-listing');
var instructionsEl = document.getElementById('instructions');

// init filter to be hidden
filterEl.parentNode.style.display = 'none';

// init filtering switch
var filterSwitch = false;
var noFilterMatch = false;

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

	// remove instructions
	instructionsEl.style.visibility = 'hidden';
	
	// return filter text to black
	filterEl.style.color = '#000';

	// sort so that they are listed alphabetically in list
	features.sort(function(x,y) {
	    
	    if(s[x.id].a < s[y.id].a) return -1;
	    if(s[x.id].a > s[y.id].a) return 1;
	    return 0; 

	});
	
        features.forEach(function(feature) {

	    // is high school?
	    var hs = (s[feature.id].m == 0 ? true : false);

	    // get values
	    var schname = s[feature.id].a;

	    // if high school
	    if (hs) {
		var schenrl = s[feature.id].d;
		var schfrpl = s[feature.id].e;
		var schcsr = s[feature.id].f;
		var distname = s[feature.id].g;
		var distenrl = s[feature.id].h;
		var distfrpl = s[feature.id].i;
		var distcsr = s[feature.id].j;
		var distfafsa = s[feature.id].k;
		var advorgs = s[feature.id].l;
	    } else {
		var colsect = s[feature.id].c;
	    }

            var item = document.createElement('a');
	    
	    // change bullet color based on whether HS or College
	    var bulletcolor = (hs ? '#E57200' : '#232D4B');

	    item.href = '#';
	    item.innerHTML = "<span class='bullet' style='color:" + bulletcolor
		+ ";'>&bull;</span>" + schname;

	    // fly to and make active if clicked
	    item.addEventListener('click', function() {

		popup.remove();		

		map.flyTo({
		    center: feature.geometry.coordinates,
		    zoom: 12
		});

		popup.setLngLat(feature.geometry.coordinates)
		    .setHTML(popupText(hs, schname = schname,
				       sect = colsect,
				       schenroltot = schenrl,
				       schfrpl = schfrpl,
				       schcsr = schcsr,
				       distname = distname,
				       distenrl = distenrl,
				       distfrpl = distfrpl,
				       distcsr = distcsr,
				       distfafsa = distfafsa,
				       advorgs = advorgs))    
		    .addTo(map);
				
	    });

	    // add popup when mousing over (if not active)
            item.addEventListener('mouseover', function() {
                popup.setLngLat(feature.geometry.coordinates)
		    .setHTML(popupText(hs, schname = schname,
				       sect = colsect,
				       schenroltot = schenrl,
				       schfrpl = schfrpl,
				       schcsr = schcsr,
				       distname = distname,
				       distenrl = distenrl,
				       distfrpl = distfrpl,
				       distcsr = distcsr,
				       distfafsa = distfafsa,
				       advorgs = advorgs))
		    .addTo(map);
            });
	    
	    // remove popup when mouse leaves (if not active)
	    item.addEventListener('mouseleave', function() {
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
	    noFilterMatch = true;
	} else {
	    filterEl.parentNode.style.display = 'none';
	    instructionsEl.style.visibility = 'visible';
	    message = messages[0]
	}

	empty.textContent = message;
	
        // remove features filter
        map.setFilter('schools', ['has', '$id']);
    }
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

    // reset if bad input in filter
    if (noFilterMatch) {
	noFilterMatch = false;
	filterSwitch = false;
	map.setFilter('schools', ['has', '$id']);
    }
    
    var features = map.queryRenderedFeatures({layers:['schools']});   
    
    if (features) {
        var uniqueFeatures = getUniqueFeaturesByID(features, 'id');
        // populate features for the listing overlay.
	renderListings(uniqueFeatures);
	// clear the input container only if !filterSwitch and reset visible
	if (!filterSwitch) {
	    filterEl.value = '';
	    visible = uniqueFeatures;
	}		
    }
}

// load data into memory
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

// load map
map.on('load', function () {

    // DATA ----------------------------------------------------------
  
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
		property: 'm',
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
    map.on('zoom', function() {
	addToVisible();
    });
    map.on('move', function() {
	addToVisible();
    });

    // POPUPS --------------------------------------------------------

    map.on('mousemove', 'schools', function(e) {
        // change the cursor style to pointer finger
        map.getCanvas().style.cursor = 'pointer';

        // populate the popup and set its coordinates based on the feature
        var feature = e.features[0];

	// is high school?
	var hs = (s[feature.id].m == 0 ? true : false);
	
	// get values
	var schname = s[feature.id].a;
	
	// if high school
	if (hs) {
	    var schenrl = s[feature.id].d;
	    var schfrpl = s[feature.id].e;
	    var schcsr = s[feature.id].f;
	    var distname = s[feature.id].g;
	    var distenrl = s[feature.id].h;
	    var distfrpl = s[feature.id].i;
	    var distcsr = s[feature.id].j;
	    var distfafsa = s[feature.id].k;
	    var advorgs = s[feature.id].l;
	} else {
	    var colsect = s[feature.id].c;
	}
	
        popup.setLngLat(feature.geometry.coordinates)
	    .setHTML(popupText(hs, schname = schname,
			       sect = colsect,
			       schenroltot = schenrl,
			       schfrpl = schfrpl,
			       schcsr = schcsr,
			       distname = distname,
			       distenrl = distenrl,
			       distfrpl = distfrpl,
			       distcsr = distcsr,
			       distfafsa = distfafsa,
			       advorgs = advorgs))    
	    .addTo(map);
    });

    map.on('mouseleave', 'schools', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    // Call this function on initialization
    // passing an empty array to render an empty state
    renderListings([]);
    
    // CONTROLS ------------------------------------------------------

    // filter box
    filterEl.addEventListener('keyup', function(e) {

	filterSwitch = true;
	
        var value = normalize(e.target.value);
	
        // remove visible features that don't match the input value.
        var filtered = visible.filter(function(feature) {
            var name = normalize(s[feature.id].a);
            return name.indexOf(value) > -1;
        });
	
        // populate the sidebar with filtered results
        renderListings(filtered);
	
        // set the filter to populate features into the layer
        map.setFilter('schools', ['in', '$id'].concat(filtered.map(function(feature) {
            return feature.id;
        })));
	popup.remove();
	
    });

    // add geocoder
    map.addControl(new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	country: 'US'
    }));
    
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

    // add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
 
});

    
