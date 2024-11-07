module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"rules": {
	},
	"globals": {
		"_": "readonly",
		"$": "readonly",
		"config": "writable",
		"defaults": "writable",
		"application": "writable",
		"template": "readonly",
		"require": "readonly",
		"Backbone": "readonly",
		"Marionette": "readonly",
		"Split": "readonly",
		"Chart": "readonly",
		"dateFormat": "readonly"
	}
}