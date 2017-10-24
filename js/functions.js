// color function
function getColor(color) {
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}

function flyToSchool(currentFeature) {
    map.flyTo({
	center: currentFeature.geometry.coordinates,
	zoom: 12
    });
}

function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    // check if there is already a popup on the map and if so, remove it
    if (popUps[0]) popUps[0].remove();
    
    var popup = new mapboxgl.Popup({ closeOnClick: false })
	.setLngLat(currentFeature.geometry.coordinates)
	.setHTML('<h4>' + s[currentFeature.id].a + '</h4>')
	.addTo(map);
}

// add school to information bar
function buildSchoolInfoList(data) {
  
    // iterate through the list of schools
    for (i = 0; i < data.features.length; i++) {
	var currentFeature = data.features[i];
	// shorten to prop
	var id = currentFeature.id;
	
	// select the info container in the HTML and append a div
	// with the class 'item' for each school
	var listings = document.getElementById('info');
	var listing = listings.appendChild(document.createElement('div'));
	listing.className = 'item';
	listing.id = 'info-' + i;
	
	// create a new link with the class 'title' for each school
	// and fill it with the school name
	var link = listing.appendChild(document.createElement('a'));
	link.href = '#';
	link.className = 'title';
	link.dataPosition = i;
	link.innerHTML = s[id].a;

	// Add an event listener for the links in the sidebar listing
	link.addEventListener('click', function(e) {
	    // Update the currentFeature to the store associated with the clicked link
	    var clickedListing = data.features[this.dataPosition];
	    // 1. fly to the point associated with the clicked link
	    flyToSchool(clickedListing);
	    // 2. close all other popups and display popup for clicked school
	    createPopUp(clickedListing);
	    // 3. highlight listing in sidebar (and remove highlight for all other listings)
	    var activeItem = document.getElementsByClassName('active');
	    if (activeItem[0]) {
		activeItem[0].classList.remove('active');
	    }
	    this.parentNode.classList.add('active');
	});

    }
}

