/*jslint white: true */
/*global module, require, console */
var config = require('../config/config').config;
var whitelist = config.formalize.whitelist;
var commonFields = config.formalize.commonFields;
var fieldsToRadioButtons = {
	'disabled' : ['enable', 'disable'],
	'disabledMarkup' : ['enable markup', 'disable markup'],
	'speech': ['male', 'female']
};

var HTML = '<html><body>';

for (var i in whitelist) {
	var deviceKey = whitelist[i];
	var fields = commonFields;
	if (typeof deviceKey === 'object') {
		for (var firstKey in deviceKey) break;
		fields = commonFields.concat(deviceKey[firstKey]);
		deviceKey = firstKey;
	}

	for (var field in fields) {
		var fieldValue = typeof config[deviceKey][fields[field]] !== 'undefined' ?
				config[deviceKey][fields[field]] :
				null;

		if(fieldValue !== null) {

			if(fields[field] === 'title') {
				var typeClass = config[deviceKey].typeClass;
				HTML += '<h2>' + fieldValue + '</h2>\n';
			} else if (fields[field] === 'deviceNotes') {
				if (fieldValue instanceof Array) {
					fieldValue = fieldValue.join('\n');
				}
				HTML += '<div>' + fieldValue + '</div><br />\n';
			} else {
				if(typeof fieldsToRadioButtons[fields[field]] !== 'undefined') {
					HTML += '<label for="' + typeClass + '-enable">' + fieldsToRadioButtons[fields[field]][0] + ':</label>\n';
					HTML += '<input id="' + typeClass + '-enable" type="radio" name="' + typeClass + '" value="' + fieldValue + '"><br />\n';
					HTML += '<label for="' + typeClass + '-disable">' + fieldsToRadioButtons[fields[field]][1] + ':</label>\n';
					HTML += '<input id="' + typeClass + '-disable" type="radio" name="' + typeClass + '" value="' + fieldValue + '"><br />\n';
				} else {
					HTML += '<label for="' + typeClass + '-' + fields[field] + '">' + fields[field] + ':</label>\n';
					HTML += '<input id="' + typeClass + '-' + fields[field] + '" type="text" name="' + typeClass + '"><br />\n';
				}
			}
		}
	}
}

HTML += '</body></html>';

console.log(HTML);