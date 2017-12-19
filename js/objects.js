---
---

// reference
// school information: s (array)
//
// a := category
// b := name
// c := fips
// d := enrollment (hs)
// e := frpl pct (hs)
// f := stu/cou ratio (hs)
// g := hs advising orgs

function School(feature) {
    this.cat = s[feature.id].a || '-';
    this.name = s[feature.id].b || '-';
    this.fips = s[feature.id].c || '-';
    this.enroll = s[feature.id].d || '-';
    this.frpl = s[feature.id].e || '-';
    this.csr = s[feature.id].f || '-';
    this.advorgs = function() {
	if (s[feature.id].g != undefined) {
	    var advstr = s[feature.id].g;
	    return advstr.split("|");
	}
    };
}

// function District(feature) {
//     this.name = s[feature.id].g || '-';
//     this.enroll = s[feature.id].h || '-';
//     this.frpl = s[feature.id].i || '-';
//     this.csr = s[feature.id].j || '-';
//     this.fafsa = s[feature.id].k || '-';
// }
