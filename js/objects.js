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
    var advorgs = s[feature.id].g;
    this.advorgs = (advorgs != undefined ? advorgs.split('|') : '-');
}
