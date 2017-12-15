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

// GENERAL FUNCTIONS -----------------------------------------------------------

// color function
function getColor(color) {
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}

// adds .remove() function if using old browser 
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

// trim and lower string
function normalize(string) {
    return string.trim().toLowerCase();
}

// check input text
function checkInput(text) {
    return (text === '' ? false : true);
}

