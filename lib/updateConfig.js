
var getFirstChild = function (obj) {
  for (var firstChild in obj) break;
  return [firstChild, obj[firstChild]];
};

/** RECURSIVE **/
// a: the config object
// b: the new configuration of a first child object...
// ... E.g. {a:{d:1}} will work for d:1, but not {a:{b:1,d:1}} for d:1, you'll reconfigure b:1 instead
var softMerge = function(a, b) {
  var firstChild = getFirstChild(b);
  var firstChildKey = firstChild[0];
  var firstChildValue = firstChild[1];
  if (typeof a[firstChildKey] === 'object') {
    a = a[firstChildKey];
  }
  if (typeof firstChildValue === 'object') {
    softMerge(a, firstChildValue);
  } else {
    a[firstChildKey] = firstChildValue;
  }
};

var updateConfig = function(event) {
	var target = event.target;

	var res = target.getAttribute('data-jsonSnippet').replace(/'/g, '"');
	res = res.replace(/\{value\}/g, '"' + target.value + '"');
	res = JSON.parse(res);
	softMerge(config, res);
	console.log(config);
};

var el = document.getElementById('config');
el.addEventListener('change', updateConfig);