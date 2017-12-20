---
---

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
function setCollegeMarker(swToggle) {
    var opacity4 = (swToggle ? 'transparent' : 'college4');
    var opacity2 = (swToggle ? 'transparent' : 'college2');
    map.setLayoutProperty('schools', 'icon-image', {
		'property': 'a',
		'type': 'categorical',
		'stops': [
		    [1, 'schoolad'],
		    [2, 'schoolna'],
		    [3, 'schooladnoc'],
		    [4, 'schoolnanoc'],
		    [5, opacity4],
		    [6, opacity4],
		    [7, opacity2],
		    [8, opacity2]
		]
    });
}

// toggle for colleges
function createToggle() {
    // init toggle to be active
    var toggle = document.createElement('a');
    toggle.href = '#';
    toggle.className = 'active';
    toggle.textContent = 'hide colleges';
    // listener: on click
    toggle.onclick = function (e) {
	e.preventDefault();
        e.stopPropagation();
    	if (this.className === '') {
    	    this.className = 'active';
    	    this.textContent = 'hide colleges';
	    swToggle = false;
	    setCollegeMarker(swToggle);
	    addToVisible();
    	} else {
    	    this.className = '';
    	    this.textContent = 'show colleges';
	    swToggle = true;
	    setCollegeMarker(swToggle);
	    addToVisible();
	}
    };
    return toggle;
}
