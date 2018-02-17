// -----------------------------------------------------------------------------
// OBJECTS
// -----------------------------------------------------------------------------

function Icon(feature) {
    this.cat = s[feature.properties[_id]][_cat] || '-';
    this.name = s[feature.properties[_id]][_name] || '-';
    this.fips = s[feature.properties[_id]][_fips] || '-';
    this.enroll = s[feature.properties[_id]][_enrl] || '-';
    this.frpl = s[feature.properties[_id]][_frpl] || '-';
    this.csr = s[feature.properties[_id]][_csr] || '-';
    var advorgs = s[feature.properties[_id]][_advo];
    this.advorgs = (advorgs != undefined ? advorgs.split('|') : '-');
    this.csr_flag = s[feature.properties[_id]][_csrf] || '-';
    this.zip = s[feature.properties[_id]][_zip] || '-';
}

// -----------------------------------------------------------------------------
// ARRAYS
// -----------------------------------------------------------------------------

// HS categories
var hsCats = [];
var idx = cats.indexOf('hs');
while (idx != -1) {
    hsCats.push(idx);
    idx = cats.indexOf('hs', idx + 1);
}
var idx = cats.indexOf('hs_adv');
while (idx != -1) {
    hsCats.push(idx);
    idx = cats.indexOf('hs_adv', idx + 1);
}

// non-college categories
var nonCollegeCats = hsCats;
var idx = cats.indexOf('community');
while (idx != -1) {
    nonCollegeCats.push(idx);
    idx = cats.indexOf('community', idx + 1);
}


