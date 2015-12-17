/*jslint white: true */
/*global module, require, console */
var config = require('../config/config').config;
var whitelist = config.formalize.whitelist;
var commonFields = config.formalize.commonFields;
var fieldsToRadioButtonsDisplayText = {
	'disabled' : ['enable', 'disable'],
	'disabledMarkup' : ['enable markup', 'disable markup'],
	'speech': ['male', 'female']
};

var HTML = '<html><body><div id="config">';

for (var i in whitelist) {
	var deviceKey = whitelist[i];
	var editableFields = commonFields;
	if (typeof deviceKey === 'object') {
		for (var firstKey in deviceKey) break;
		editableFields = commonFields.concat(deviceKey[firstKey]);
		deviceKey = firstKey;
	}

	for (var field in editableFields) {
		var fieldValue = typeof config[deviceKey][editableFields[field]] !== 'undefined' ?
				config[deviceKey][editableFields[field]] :
				null;

		if (fieldValue !== null) {
			if (editableFields[field] === 'typeClass') {
				continue;
			}
			if (editableFields[field] === 'title') {
				var typeClass = config[deviceKey].typeClass;
				HTML += '<h2>' + fieldValue + '</h2>\n';
			} else if (editableFields[field] === 'deviceNotes') {
				if (fieldValue instanceof Array) {
					fieldValue = fieldValue.join('\n');
				}
				HTML += '<div>' + fieldValue + '</div><br />\n';
			} else {
				var jsonSnippet = 'data-jsonSnippet="{\'' + deviceKey + '\':{\'' + editableFields[field] + '\':{value}}}" ';

				if (typeof fieldsToRadioButtonsDisplayText[editableFields[field]] !== 'undefined') {
					HTML += '<label for="' + typeClass + '-enable">' + fieldsToRadioButtonsDisplayText[editableFields[field]][0] + ':</label>\n';
					HTML += '<input ' + jsonSnippet + 'id="' + typeClass + '-enable" type="radio" name="' + typeClass + '" value="false"><br />\n';
					HTML += '<label for="' + typeClass + '-disable">' + fieldsToRadioButtonsDisplayText[editableFields[field]][1] + ':</label>\n';
					HTML += '<input ' + jsonSnippet + 'id="' + typeClass + '-disable" type="radio" name="' + typeClass + '" value="true"><br />\n';
				} else {
					HTML += '<label for="' + typeClass + '-' + editableFields[field] + '">' + editableFields[field] + ':</label>\n';
					HTML += '<input ' + jsonSnippet + 'id="' + typeClass + '-' + editableFields[field] + '" type="text" name="' + typeClass + '"><br />\n';
				}
			}
		}
	}
}

HTML += '<button>Save</button><br /></div><script>var config = ' + JSON.stringify(config) + ';</script><script src="updateConfig.js"></script></body></html>';

console.log(HTML);