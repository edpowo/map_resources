// POPUPS ----------------------------------------------------------------------

// add .create() method
mapboxgl.Popup.prototype.create = function(feature) {
    this.setLngLat(feature.geometry.coordinates)
	.setHTML(this.text(feature))    
	.addTo(map);
}

// adds .text() method
mapboxgl.Popup.prototype.text = function(feature) {

    // init popup format string
    var htmlstr;

    // get information
    var school = new School(feature);
    var district = new District(feature);

    if (!school.iscollege) {
	htmlstr = "<h2>" + school.name + "</h2>";
	htmlstr += "<h3>District: " + district.name + "</h3>";
	htmlstr += "<table>";
	htmlstr += "<tr><th></th><th>District</th><th>School</th></tr>";
	htmlstr += "<tr><td>12th grade enrollment</td>"
	    + "<td class = 'num'>" + district.enroll + "</td>"
	    + "<td class = 'num'>" + school.enroll + "</td></tr>";
	htmlstr += "<tr><td>FRPL (%)</td>"
	    + "<td class = 'num'>" + district.frpl + "</td>"
	    + "<td class = 'num'>" + school.frpl + "</td></tr>";
	htmlstr += "<tr><td>Students per counselor</td>"
	    + "<td class = 'num'>" + district.csr + "</td>"
	    + "<td class = 'num'>" + school.csr + "</td></tr>";
	htmlstr += "</table>";

	// get advising orgs, splitting on pipe (|)
	htmlstr += "<h2>Advising organizations</h2>";
	if (school.advorgs != undefined) {
	    for (i = 0; i < school.advorgs.length; i++) {
		htmlstr += school.advorgs[i] + "</br>";
	    }
	} else {
	    htmlstr += "None"
	}
    } else {
	htmlstr = "<h2>" + school.name + "</h2>";
	htmlstr += "<b>Sector: </b>" + school.sector;
    }
    return htmlstr;
}
