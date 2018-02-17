// MAPPING FUNCTIONS -----------------------------------------------------------

// subset existing features into unique values (id)
function getUniqueFeaturesByID(array) {
    var existingFeatureKeys = {};
    var uniqueFeatures = array.filter(function(el) {
        if (existingFeatureKeys[el.properties[_id]]) {
            return false;
        } else {
            existingFeatureKeys[el.properties[_id]] = true;
            return true;
        }
    });
    return uniqueFeatures;
}

// primary function to populate listings 
function renderListings(features) {
    // clear any existing listings
    elListing.innerHTML = '';
    // if there are items visible on the map...
    if (features.length) {
	// remove instructions
	elInstructions.style.visibility = 'hidden';
	// return filter text to black
	elFilter.style.color = '#000';
	// sort so that they are listed alphabetically in list
	features.sort(function(x,y) {
	    if(s[x.properties[_id]][_name] < s[y.properties[_id]][_name]) return -1;
	    if(s[x.properties[_id]][_name] > s[y.properties[_id]][_name]) return 1;
	    return 0; 
	});
	// filter if colleges are toggled off
	if (swToggleCollege) {
	    features = features.filter(function(feature) {
		var cat = s[feature.properties[_id]][_cat];
		return nonCollegeCats.indexOf(cat) > -1;
	    });
	}
	// for each visible feature...
        features.forEach(function(feature) {
	    // school object
	    var icon = new Icon(feature);
	    // icon type
	    var icon_cat = getCatLabel(icon.cat);
	    // create item for list
	    var item = document.createElement('a');
	    item.href = '#';
	    item.innerHTML = "<span class=" + bullets[icon_cat].class
		+ " style='color:"
		+ bullets[icon_cat].color + "'>"
		+ bullets[icon_cat].shape + "</span>";
	    if (icon_cat === 'community') {
		item.innerHTML +=  "Zip code: " + icon.zip;
	    } else {
		item.innerHTML += icon.name;
	    }
	    // listener: fly to and make active if clicked
	    item.addEventListener('click', function() {
		eventFlyTo(feature, popup);
	    });
	    // listener: add popup when mousing over (if not active)
            item.addEventListener('mouseover', function() {
		popup.create(feature);
	    });
	    // listener: remove popup when mouse leaves (if not active)
	    item.addEventListener('mouseleave', function() {
                popup.remove();
            });
	    elListing.appendChild(item);
        });
        // show the filter input
        elFilter.parentNode.style.display = 'block';
    } else {
	// make empty area 
	var empty = document.createElement('p');
        // if the input filter is being used and doesn't return options...
	if (swFilter) {
	    // ...change color of input text and give message
	    elFilter.style.color = getColor(rtorange);
	    message = messages[1];
	    elListing.appendChild(empty);
	    swNoFilterMatch = true;
	} else {
	    // ...else show inital instructions
	    elFilter.parentNode.style.display = 'none';
	    elInstructions.style.visibility = 'visible';
	    message = messages[0]
	}
	empty.textContent = message;
	// remove features filter
        map.setFilter('schools', ['has', '$id']);
	if (!swToggleCollege) {
	    map.setFilter('colleges', ['has', '$id']);
	}
    }
}

function addToVisible() {
    // reset if bad input in filter
    if (swNoFilterMatch) {
	swNoFilterMatch = swFilter = false;
	map.setFilter('schools', ['has', '$id']);
	if (!swToggleCollege) {
	    map.setFilter('colleges', ['has', '$id']);
	}
    }
    var filter = (swToggleCollege ? ['!in', 'colleges'] : false);
    var features = map.queryRenderedFeatures({ 
    	layers :['schools','colleges'],
	filter: filter
    });
    
    if (features) {
	// limit to unique features
        var uniqueFeatures = getUniqueFeaturesByID(features, 'id');
        // populate features for the listing overlay
	renderListings(uniqueFeatures);
	// clear the input container only if !swFilter and reset visible
	if (!swFilter) {
	    elFilter.value = '';
	    visible = uniqueFeatures;
	}		
    }
}

// function to filter icons with text input
function textFilter(e, visible) {
    // set switch
    swFilter = true;
    // get input text
    var inputText = normalize(e.target.value);
    // remove visible features that don't match the input value.
    var filtered = visible.filter(function(feature) {
        var name = normalize(s[feature.properties[_id]][_name]);
        return name.indexOf(inputText) > -1;
    });
    // populate the sidebar with filtered results
    renderListings(filtered);
    // set the filter to populate features into the layer
    map.setFilter('schools', ['in', '$id'].concat(filtered.map(function(feature) {
        return feature.id;
    })));
    if (!swToggleCollege) {
	map.setFilter('colleges', ['in', '$id'].concat(filtered.map(function(feature) {
            return feature.id;
	})));
    }
    popup.remove();  
}
    
