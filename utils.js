/** Returns timestamp in second, including fractional part. */
currentTime = function() {
  return new Date().getTime() / 1000;
};

/** Parse URL to get values and overwrites the defaults. */
getUrlArgs = function(default_vars) {
  var vars = default_vars, hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    if (hash.length == 2) {
      vars[hash[0]] = decodeURIComponent(hash[1]);
    }
  }
  return vars;
};

/** Random integer from the given range (min, max both inclusive). */
randInt = function(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

pad = function(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
};
