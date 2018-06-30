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
    var icon = new Icon(feature);
    // is HS?
    var lab = getCatLabel(icon.cat);
    isHS = (/hs|hs_adv/.exec(lab));
    isCM = (lab === 'community');

    if (isHS) {
	isMagnet = (icon.magnet == 1 ? 'Yes' : 'No')
	isCharter = (icon.charter == 1 ? 'Yes' : 'No')
	htmlstr = "<div class='pu-header'><h2>" + icon.name + "</h2></div>";
	htmlstr += "<table>";
	htmlstr += "<tr><td>School enrollment</td>"
	    + "<td class = 'num'>" + icon.enroll + "</td></tr>";
	htmlstr += "<tr><td>FRPL (%)</td>"
	    + "<td class = 'num'>" + icon.frpl + "</td></tr>";
	htmlstr += "<tr><td>Magnet</td>"
	    + "<td class = 'num'>" + isMagnet + "</td></tr>";
	htmlstr += "<tr><td>Charter</td>"
	    + "<td class = 'num'>" + isCharter + "</td></tr>";
	if (icon.csr_flag == 1) {
	    var csr = '-';
	} else {
	    var csr = icon.csr;
	}
	htmlstr += "<tr><td>Students per counselor</td>"
	    + "<td class = 'num'>" + csr + "</td></tr>";
	htmlstr += "</table>";
	if (icon.advorgs !== '-') {
	    htmlstr += "<h3>Advising organizations</h3>";
	    for (i = 0; i < icon.advorgs.length; i++) {
		if (icon.advorgs[i] !== '' && i > 0) {
		    htmlstr += "<hr>";
		}
		if (icon.advorgs[i] !== '') {
		    htmlstr += "<b>Name:</b> " + icon.advorgs[i] + "</br>";
		}
		if (icon.advdiv[i] !== '') {
		    htmlstr += "<b>Division:</b> " + icon.advdiv[i] + "</br>";
		}
		if (icon.web[i] !== '') {
		    htmlstr += "<b>URL:</b> " + icon.web[i] + "</br>";
		}
	    }
	}
    } else if (isCM) {
	htmlstr = "<div class='pu-header'><h2> Zip code: "
	    + icon.zip + "</h2></div>";
	htmlstr += "<h3>Advising organizations</h3>";
	    for (i = 0; i < icon.advorgs.length; i++) {
		if (icon.advorgs[i] !== '' && i > 0) {
		    htmlstr += "<hr>";
		}
		if (icon.advorgs[i] !== '') {
		    htmlstr += "<b>Name:</b> " + icon.advorgs[i] + "</br>";
		}
		if (icon.advdiv[i] !== '') {
		    htmlstr += "<b>Division:</b> " + icon.advdiv[i] + "</br>";
		}
		if (icon.web[i] !== '') {
		    htmlstr += "<b>URL:</b> " + icon.web[i] + "</br>";
		}
	    }
    } else {
	htmlstr = "<div class='pu-header'><h2>" + icon.name + "</h2></div>";
	htmlstr += "<b>Sector: </b>" + sector[icon.cat];
    }
    return htmlstr;
}
