const Request = require("./Request");
const utils = require("./utils");
const _ = require("lodash");

class Instance {
	constructor(instanceConfig) {
		this.instanceConfig = instanceConfig;
	}
	handler(config) {
		const request = new Request({...config, ...this.instanceConfig});
		return request.send();
	}
}
const methods = [
	{"name": "request", "method": "get", "paramCount": 1},
	{"name": "get", "method": "get", "paramCount": 2},
	{"name": "delete", "method": "delete", "paramCount": 2},
	{"name": "head", "method": "head", "paramCount": 2},
	{"name": "options", "method": "options", "paramCount": 2},
	{"name": "post", "method": "post", "paramCount": 3},
	{"name": "put", "method": "put", "paramCount": 3},
	{"name": "patch", "method": "patch", "paramCount": 3}
];
methods.forEach((method) => {
	let getConfig;
	if (method.paramCount === 1) {
		getConfig = (config) => ({...config, "method": method.method});
	} else if (method.paramCount === 2) {
		getConfig = (url, config) => ({...config, url, "method": method.method});
	} else {
		getConfig = (url, data, config) => ({...config, url, data, "method": method.method});
	}

	Instance.prototype[method.name] = function (...args) {
		return this.handler(getConfig(...args));
	};
});

module.exports = (instanceConfig = {}) => {
	const context = new Instance(instanceConfig);
	const instance = _.bind(Instance.prototype.request, context);

	// Copy prototype to instance
	utils.extend(instance, Instance.prototype, context);

	// Copy context to instance
	utils.extend(instance, context);

	return instance;
};
