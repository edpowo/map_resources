// EVENT FUNCTIONS -------------------------------------------------------------

// fly to point when clicking sidebar
function eventFlyTo(feature, popup) {
    popup.remove();		
    map.flyTo({
	center: feature.geometry.coordinates,
	zoom: 12
    });
    popup.create(feature);
}

// function to change marker color for colleges
function setHSMarker(swToggleHS) {
    if (swToggleHS) {
	map.setLayoutProperty('schools',
			      'icon-size',
			      ['interpolate', ['linear'], ['zoom'],
	    		       7, [
	    			   '*',
	    			   ['/', 1, ['to-number',
	    				     ['get', 'f', ['at', ['get', 'z'], ['literal', s]]],
	    				     1000]
	    			   ],
	    			   10],
	    		       22, [
	    			   '*',
	    			   ['/', 1, ['to-number',
	    				     ['get', 'f', ['at', ['get', 'z'], ['literal', s]]],
	    				     1000]
	    			   ],
	    			   100]
			      ]);
    } else {
	map.setLayoutProperty('schools',
			      'icon-size',
			      ['interpolate', ['linear'], ['zoom'],
	    		       7, .1,
	    		       22, 1
			      ]);
    }
}

// function to change marker color for colleges
function setCollegeMarker(swToggleCollege) {
    map.setLayoutProperty('schools',
			  'icon-image',
			  ['match',
			   ['get', 'a', ['at', ['get', 'z'], ['literal', s]]],
			   1, 'schoolad',
			   2, 'schoolna',
			   3, 'schooladnoc',
			   4, 'schoolnanoc',
			   5, opacityToggle(swToggleCollege, 'college4'),
			   6, opacityToggle(swToggleCollege, 'college4'),
			   7, opacityToggle(swToggleCollege, 'college2'),
			   8, opacityToggle(swToggleCollege, 'college2'),
			   'transparent']
			 );
}

// toggle for colleges
function createToggle(type) {
    // init toggle to be active
    var toggle = document.createElement('a');
    toggle.href = '#';
    toggle.className = 'active';
    var textContent = (type == 'college' ?
		       ['hide colleges', 'show college'] :
		       ['HS size by student/counselor', 'HS size standard']);

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
		setHSMarker(swToggleHS);
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
		setHSMarker(swToggleHS);
	    }
	    addToVisible();
	}
    };
    return toggle;
}
