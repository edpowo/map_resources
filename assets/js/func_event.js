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

function setCollegeMarker(swToggleCollege) {
    map.setPaintProperty('colleges',
			 'icon-opacity',
			 (swToggleCollege ? 0 : 1)
			);
}

// toggle for colleges
function createToggle() {
    // init toggle to be active
    var toggle = document.createElement('a');
    toggle.href = '#';
    toggle.className = 'active';
    var textContent = ['Hide colleges', 'Show colleges'];
    toggle.textContent = textContent[0];
    // listener: on click
    toggle.onclick = function (e) {
	e.preventDefault();
        e.stopPropagation();
    	if (this.className === '') {
    	    this.className = 'active';
    	    this.textContent = textContent[0]
	    swToggleCollege = false;
	    setCollegeMarker(swToggleCollege);
	    addToVisible();
    	} else {
    	    this.className = '';
    	    this.textContent = textContent[1]
	    swToggleCollege = true;
	    setCollegeMarker(swToggleCollege);
	    addToVisible();
	}
    };
    return toggle;
}
