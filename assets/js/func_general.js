// -----------------------------------------------------------------------------
// GENERAL FUNCTIONS
// -----------------------------------------------------------------------------

// color function
function getColor(color) {
    return 'rgba(' + color.r + ','
	+ color.g + ','
	+ color.b + ','
	+ color.a + ')';
}

// trim and lower string
function normalize(string) {
    return string.trim().toLowerCase();
}

// return label based on category
function getCatLabel(value) {
    return cats[value];
}

// ids that are not colleges
function filterIcons(iconarray, droptype) {
    outArray = [];
    for(i=1;i<iconarray.length;i++) {// NB: start at 1 b/c s is one-index
	if (getCatLabel[iconarray[i][_cat]] !== droptype) {
	    outArray.push(i);
	}
    }
    return outArray;
}

// function to switch between transparent and valued icon
function opacityToggle(toggle, output) {
    return (toggle ? 'transparent' : output);
}

function opacityToggle_(toggle) {
    return (toggle ? 0 : 1);
}

// function to return percentile value
function findPercentile(array, p) {
    array.sort(function(a,b) {return a-b});
    var i = array.length * p;
    var fi = Math.floor(i);
    var v = (fi == i) ? (array[i-1] + array[i])/2 : array[fi];
    return v;
}

