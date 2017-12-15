---
---

// reference
// school information: s (array)
//
// a := name
// b := fips
// c := sector (college)
// d := enrollment (hs)
// e := frpl pct (hs)
// f := stu/cou ratio (hs)
// g := district name
// h := district enrollment g12
// i := district frpl pct
// j := district stu/cou ratio
// k := district fafsa pct
// l := hs advising orgs
// m := is college

function School(feature) {
    this.name = s[feature.id].a || '-';
    this.sector = sector[s[feature.id].c] || '-';
    this.enroll = s[feature.id].d || '-';
    this.frpl = s[feature.id].e || '-';
    this.csr = s[feature.id].f || '-';
    this.iscollege = (s[feature.id].m == 1 ? true : false);
    this.advorgs = function() {
	if (s[feature.id].l != undefined) {
	    return s[feature.id].l.split("|");
	}
    };
}

function District(feature) {
    this.name = s[feature.id].g || '-';
    this.enroll = s[feature.id].h || '-';
    this.frpl = s[feature.id].i || '-';
    this.csr = s[feature.id].j || '-';
    this.fafsa = s[feature.id].k || '-';
}
