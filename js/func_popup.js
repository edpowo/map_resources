---
---

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
    // is HS?
    var isHS = (getCatLabel(school.cat) === 'hs');

    if (isHS) {
	htmlstr = "<h2>" + school.name + "</h2>";
	htmlstr += "<table>";
	htmlstr += "<tr><td>12th grade enrollment</td>"
	    + "<td class = 'num'>" + school.enroll + "</td></tr>";
	htmlstr += "<tr><td>FRPL (%)</td>"
	    + "<td class = 'num'>" + school.frpl + "</td></tr>";
	htmlstr += "<tr><td>Students per counselor</td>"
	    + "<td class = 'num'>" + school.csr + "</td></tr>";
	htmlstr += "</table>";
	if (school.advorgs !== '-') {
	    htmlstr += "<h2>Advising organizations</h2>";
	    for (i = 0; i < school.advorgs.length; i++) {
		htmlstr += school.advorgs[i] + "</br>";
	    }
	}
    } else {
	htmlstr = "<h2>" + school.name + "</h2>";
	htmlstr += "<b>Sector: </b>" + sector[school.cat];
    }
    return htmlstr;
}
