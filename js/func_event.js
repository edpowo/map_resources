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
    var opacity = (swToggle ? 0 : 1);
    map.setPaintProperty('schools', 'icon-opacity', {
	'property': 'a',
	'type': 'categorical',
	'stops': [
	    [0, 1],
	    [1, 1],
	    [2, opacity],
	    [3, opacity],
	    [4, opacity],
	    [5, opacity]
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
