// -----------------------------------------------------------------------------
// OBJECTS
// -----------------------------------------------------------------------------

function Icon(feature) {
    this.cat = s[feature.id][_cat] || '-';
    this.name = s[feature.id][_name] || '-';
    this.fips = s[feature.id][_fips] || '-';
    this.enroll = s[feature.id][_enrl] || '-';
    this.frpl = s[feature.id][_frpl] || '-';
    this.csr = s[feature.id][_csr] || '-';
    var advorgs = s[feature.id][_advo];
    this.advorgs = (advorgs != undefined ? advorgs.split('|') : '-');
    this.csr_flag = s[feature.id][_csrf] || '-';
    this.zip = s[feature.id][_zip] || '-';
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
