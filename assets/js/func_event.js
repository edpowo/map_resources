---
---

// -----------------------------------------------------------------------------
// EVENT FUNCTIONS
// -----------------------------------------------------------------------------

// fly to point when clicking sidebar
function eventFlyTo(feature, popup) {
    popup.remove();
    var lon = feature.geometry.coordinates[0];
    var lat = feature.geometry.coordinates[1] + .012; // lower than center
    map.flyTo({
	center: [lon, lat],
	zoom: flyToZoom
    });
    popup.create(feature);
}

// function to change marker color for colleges
function setHSMarker(swToggleHS, colPct, comPct, scr_min, scr_max) {
    if (swToggleHS) {
	map.setLayoutProperty('icons',
			      'icon-size',
			      ['interpolate', ['linear'], ['zoom'],
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
	    			   40],
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
	    			   200]
			      ]);
    } else {
	map.setLayoutProperty('icons',
			      'icon-size',
			      ['interpolate', ['linear'], ['zoom'],
	    		       minIconZoom, .1,
	    		       maxIconZoom, 1
			      ]);
    }
}

// function to change marker color for colleges
function setCollegeMarker(swToggleCollege) {
    map.setLayoutProperty('icons',
			  'icon-image',
			  ['match',
			   ['get', _cat, ['at', ['get', _id], ['literal', s]]],
			   1, 'schoolad',
			   2, 'schoolna',
			   3, 'schooladnoc',
			   4, 'schoolnanoc',
			   5, opacityToggle(swToggleCollege, 'college4'),
			   6, opacityToggle(swToggleCollege, 'college4'),
			   7, opacityToggle(swToggleCollege, 'college2'),
			   8, opacityToggle(swToggleCollege, 'college2'),
			   9, 'community',
			   'transparent']
			 );
}

// toggle for colleges
function createToggle(type, colPct, comPct, scr_min, scr_max) {
    // init toggle to be active
    var toggle = document.createElement('a');
    toggle.href = '#';
    toggle.className = 'active';
    var textContent = (type == 'college' ?
		       ['Hide colleges', 'Show colleges'] :
		       ['Resize HS icons by SCR',
			'Standard HS icon size']);

    toggle.textContent = textContent[0];
    // listener: on click
    toggle.onclick = function (e) {
	e.preventDefault();
        e.stopPropagation();
    	if (this.className === '') {
    	    this.className = 'active';
    	    this.textContent = textContent[0]
	    if (type == 'college') {
		swToggleCollege = false;
		setCollegeMarker(swToggleCollege);
	    } else {
		swToggleHS = false;
		setHSMarker(swToggleHS, colPct, comPct, scr_min, scr_max);
	    }
	    addToVisible();
    	} else {
    	    this.className = '';
    	    this.textContent = textContent[1]
	    if (type == 'college') {
		swToggleCollege = true;
		setCollegeMarker(swToggleCollege);
	    } else {
		swToggleHS = true;
		setHSMarker(swToggleHS, colPct, comPct, scr_min, scr_max);
	    }
	    addToVisible();
	}
    };
    return toggle;
}
