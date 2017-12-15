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

