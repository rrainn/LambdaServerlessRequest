const Request = require("./Request");

module.exports = (instanceConfig = {}) => {
	function handler(config) {
		const request = new Request({...config, ...instanceConfig});
		return request.send();
	}

	const configHandler = (method) => (config) => handler({...config, method});
	const configURLHandler = (method) => (url, config) => handler({...config, url, method});
	const configURLDataHandler = (method) => (url, data, config) => handler({...config, url, data, method});

	const returnObject = configHandler("get");

	const methods = [
		{"name": "request", "function": configHandler("get")},
		{"name": "get", "function": configURLHandler("get")},
		{"name": "delete", "function": configURLHandler("delete")},
		{"name": "head", "function": configURLHandler("head")},
		{"name": "options", "function": configURLHandler("options")},
		{"name": "post", "function": configURLDataHandler("post")},
		{"name": "put", "function": configURLDataHandler("put")},
		{"name": "patch", "function": configURLDataHandler("patch")}
	];

	methods.forEach((method) => {
		returnObject[method.name] = method.function;
	});

	return returnObject;
};
