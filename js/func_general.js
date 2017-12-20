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

// filter to high schools (needed to flatten arrays)
function filterToHS(hsarray) {
    var filterArray = [['in','a'], hsarray];
    return [].concat.apply([], filterArray);
}

