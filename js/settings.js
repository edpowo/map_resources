// categories
var cats = [];
cats[0] = undefined;
cats[1] = 'hs';
cats[2] = 'hs';
cats[3] = 'hs';
cats[4] = 'hs';
cats[5] = 'college';
cats[6] = 'college';
cats[7] = 'college';
cats[8] = 'college';

// hs categories
var hsCats = [];
var idx = cats.indexOf('hs');
while (idx != -1) {
    hsCats.push(idx);
    idx = cats.indexOf('hs', idx + 1);
}

// colors
var jeffblue = {r:'35',g:'45',b:'75',a:'1'};
var rtorange = {r:'229',g:'114',b:'0',a:'1'};
var advgreen = {r:'101',g:'152',b:'35',a:'1'};
var commgold = {r:'191',g:'166',b:'22',a:'1'};
var zeroalph = {r:'255',g:'255',b:'255',a:'0'};

// listing bullet types and colors
var bullets = {'hs': {'color': getColor(rtorange),
		      'shape': '&#x25CF;',
		      'class':'bullet'},
	       'college': {'color': getColor(jeffblue),
			   'shape': '&#x25A0;',
			   'class':'square'},
	       'community': {'color': getColor(commgold),
			     'shape': '&#x25B2;',
			     'class':'bullet'}}

// icons
var iconlist = [{'name': 'college4', 'file': 'college-4-bg.png'},
		{'name': 'college2', 'file': 'college-2-bg.png'},
		{'name': 'schoolna', 'file': 'school-bg.png'},
		{'name': 'schoolad', 'file': 'school-advising-bg.png'},
		{'name': 'schoolnanoc', 'file': 'school-noc-bg.png'},
		{'name': 'schooladnoc', 'file': 'school-advising-noc-bg.png'},
		{'name': 'community', 'file': 'community-bg.png'},
		{'name': 'transparent', 'file': 'transparent.png'}];

// sector concordance
var sector = {'5':'Public four-year',
	      '6':'Private, not-for-profit four-year',
	      '7':'Public two-year',
	      '8':'Private, not-for-profit two-year'};

// messages
var messages = ['Zoom or drag the map to populate results',
		'Check spelling or drag the map to re-populate results'];




