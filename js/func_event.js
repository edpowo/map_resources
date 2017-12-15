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
    var cmColor = (swToggle ? zeroalph : jeffblue);
    map.setPaintProperty('schools', 'circle-color', {
	'property': 'm',
	'type': 'categorical',
	'stops': [
	    [0, getColor(rtorange)],
    	    [1, getColor(cmColor)]
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
