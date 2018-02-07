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
    var icon = new Icon(feature);
    // is HS?
    var lab = getCatLabel(icon.cat);
    isHS = (/hs|hs_adv/.exec(lab));
    isCM = (lab === 'community');

    if (isHS) {
	htmlstr = "<h2>" + icon.name + "</h2>";
	htmlstr += "<table>";
	htmlstr += "<tr><td>School enrollment</td>"
	    + "<td class = 'num'>" + icon.enroll + "</td></tr>";
	htmlstr += "<tr><td>FRPL (%)</td>"
	    + "<td class = 'num'>" + icon.frpl + "</td></tr>";
	if (icon.csr_flag == 1) {
	    var csr = '-';
	} else {
	    var csr = icon.csr;
	}
	htmlstr += "<tr><td>Students per counselor</td>"
	    + "<td class = 'num'>" + csr + "</td></tr>";
	htmlstr += "</table>";
	if (icon.advorgs !== '-') {
	    htmlstr += "<h2>Advising organizations</h2>";
	    for (i = 0; i < icon.advorgs.length; i++) {
		htmlstr += icon.advorgs[i] + "</br>";
	    }
	}
    } else if (isCM) {
	htmlstr = "<h2> Zip code: " + icon.zip + "</h2>";
	htmlstr += "<h2>Advising organizations</h2>";
	    for (i = 0; i < icon.advorgs.length; i++) {
		htmlstr += icon.advorgs[i] + "</br>";
	    }
    } else {
	htmlstr = "<h2>" + icon.name + "</h2>";
	htmlstr += "<b>Sector: </b>" + sector[icon.cat];
    }
    return htmlstr;
}
