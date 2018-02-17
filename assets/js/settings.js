// -----------------------------------------------------------------------------
// SCALE OF ICONS ON HS RESIZE (1 - VALUE [0-1])
// -----------------------------------------------------------------------------

var scale_hs_min = 1 - .90;	// values > 90th xtile clipped down
var scale_hs_max = 1 - .10;	// values < 10th xtile scaled up

var scale_colPct = 1 - .75;	// college icons 75th xtile of HS csr
var scale_comPct = 1 - .90;	// community icons 90th xtile of HS csr
scale_colPct += .3;		// ...b/c not on same interpolated scale

// -----------------------------------------------------------------------------
// MIN / MAX ZOOM FOR ICONS VISIBILITY / SCALING (0 - 24) 
// -----------------------------------------------------------------------------

var minIconZoom = 6;
var maxIconZoom = 22;
var minIconZoomScale = 15;
var maxIconZoomScale = 140;
var smallMobileMinAdj = 1;
var smallMobileMaxAdj = .25;
var smallTabletMinAdj = 1;
var smallTabletMaxAdj = .4;

// -----------------------------------------------------------------------------
// FLYTO ZOOM (0 - 24)
// -----------------------------------------------------------------------------

var flyToZoom = 11;

// -----------------------------------------------------------------------------
// SCALE CONTROL WIDTH (px)
// -----------------------------------------------------------------------------

var scaleControlWidth = 250;

// -----------------------------------------------------------------------------
// SCHOOL ARRAY MAPPING (array `s`)
// -----------------------------------------------------------------------------

// (confirm with scripts/make_data.R)

var _cat  = 'a';		// a := category
var _name = 'b';		// b := name
var _fips = 'c';		// c := fips
var _enrl = 'd';		// d := enrollment (hs)
var _frpl = 'e';		// e := frpl pct (hs)
var _csr  = 'f';		// f := stu/cou ratio (hs)
var _advo = 'g';		// g := hs advising orgs
var _csrf = 'h';		// h := hs missing csr
var _zip  = 'i';		// i := zip code

// -----------------------------------------------------------------------------
// GEO DATA ID 
// -----------------------------------------------------------------------------

// (confirm with scripts/make_data.R)

var _id = 'z';

// -----------------------------------------------------------------------------
// ICON CATEGORIES (HIGH SCHOOL / COLLEGE / COMMUNITY)
// -----------------------------------------------------------------------------

// (confirm with scripts/make_data.R)

var cats = [];
cats[0] = undefined;
cats[1] = 'hs_adv';
cats[2] = 'hs';
cats[3] = 'hs_adv';
cats[4] = 'hs';
cats[5] = 'college';
cats[6] = 'college';
cats[7] = 'college';
cats[8] = 'college';
cats[9] = 'community';

// -----------------------------------------------------------------------------
// MAPPING COLORS (red, green, blue, alpha)
// -----------------------------------------------------------------------------

var jeffblue = {r:'035',g:'045',b:'075',a:'1'};
var rtorange = {r:'229',g:'114',b:'000',a:'1'};
var advgreen = {r:'101',g:'152',b:'035',a:'1'};
var commgold = {r:'191',g:'166',b:'022',a:'1'};
var zeroalph = {r:'255',g:'255',b:'255',a:'0'};

// -----------------------------------------------------------------------------
// LISTING BULLETS (color, shape, and type)
// -----------------------------------------------------------------------------

// listing bullet types and colors
var bullets = {'hs': {'color': getColor(rtorange),
		      'shape': '&#x25CF;',
		      'class':'bullet'},
	       'hs_adv': {'color': getColor(advgreen),
		      'shape': '&#x25CF;',
		      'class':'bullet'},
	       'college': {'color': getColor(jeffblue),
			   'shape': '&#x25A0;',
			   'class':'square'},
	       'community': {'color': getColor(commgold),
			     'shape': '&#x25B2;',
			     'class':'triangle'}};

// -----------------------------------------------------------------------------
// ICONS (name, file)
// -----------------------------------------------------------------------------

var iconlist = [{'name': 'college4', 'file': 'college-4-512.png'},
		{'name': 'college2', 'file': 'college-2-512.png'},
		{'name': 'schoolna', 'file': 'school-512.png'},
		{'name': 'schoolad', 'file': 'school-adv-512.png'},
		// {'name': 'schoolnanoc', 'file': 'school-noc-bg.png'},
		// {'name': 'schooladnoc', 'file': 'school-advising-noc-bg.png'},
		{'name': 'community', 'file': 'community-512.png'},
		{'name': 'transparent', 'file': 'transparent.png'}];

// -----------------------------------------------------------------------------
// COLLEGE SECTOR MAPPING FOR POPUP
// -----------------------------------------------------------------------------

var sector = {'5':'Public four-year',
	      '6':'Private, not-for-profit four-year',
	      '7':'Public two-year',
	      '8':'Private, not-for-profit two-year'};

// -----------------------------------------------------------------------------
// MESSAGES FOR TEXT ENTRY
// -----------------------------------------------------------------------------

var messages = ['Zoom or drag the map to populate results',
		'Check spelling or drag the map to re-populate results'];




