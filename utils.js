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

// Sample n random values from a collection using the modern version of the
// [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
randomSample = function(obj, n) {
  var sample = obj.slice(0);
  var length = sample.length;
  n = Math.max(Math.min(n, length), 0);
  var last = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = randInt(index, last);
    var temp = sample[index];
    sample[index] = sample[rand];
    sample[rand] = temp;
  }
  return sample.slice(0, n);
};


stratifiedSample = function(x, n) {
  var ax = new Array(x);
  for (var j = 0; j < x; ++j) {
    ax[j] = j;
  }
  var sx = sample(ax, x % n);
  sx.sort().reverse();
  for (var j in sx) {
    ax.splice(sx[j], 1);
  }
  var d = Math.floor(ax.length / n);
  var s = new Array(n);
  for (var j = 0; j < n; ++j) {
    var i = d * j + Math.floor(Math.random() * d);
    s[j] = ax[i];
  }
  return s;
};

multiStratifiedSample = function(x, y, n) {
	var p = Math.floor(Math.sqrt(n)) + 1;
  var pairs = [];
  for (var i = 0; i < p; ++i) {
		var s = stratifiedSample(x, p);
	  for (var j = 0; j < p; ++j) {
      var t = stratifiedSample(y, p);
      pairs.push([s[j], t[i]]);
    }
  }
  return sample(pairs, n);
};
