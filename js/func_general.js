---
---

// GENERAL FUNCTIONS -----------------------------------------------------------

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
function filterIcons(schoolarray, droptype) {
    outArray = [];
    for(i=1;i<schoolarray.length;i++) {// NB: start at 1 b/c s is one-index
	if (getCatLabel[schoolarray[i].a] !== droptype) {
	    outArray.push(i);
	}
    }
    return outArray;
}

// filter to high schools (needed to flatten arrays)
function iconFilterColleges() {
    var filterArray = [['in','z'], filterIcons(s, 'college')];
    return [].concat.apply([], filterArray);
}

// function to switch between transparent and valued icon
function opacityToggle(toggle, output) {
    return (toggle ? 'transparent' : output);
}

