const _ = require("lodash");

module.exports = (a, b, thisArg) => {
	_.forEach(b, (val, key) => {
		a[key] = thisArg && typeof val === "function" ? _.bind(val, thisArg) : val;
	});
	return a;
};
