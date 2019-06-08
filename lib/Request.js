const {URL} = require("url");
const AWS = require("aws-sdk");
const Response = require("./Response");
const fs = require("fs");
const path = require("path");

class Request {
	constructor(config) {
		if (!config.headers || !config.headers["User-Agent"]) {
			config.headers = config.headers || {};
			const packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"))) || {};
			config.headers["User-Agent"] = [packageJSON.name, packageJSON.version].join("/");
		}

		this.config = config;

		this.url = config.url;
		this.method = config.method;
		this.headers = config.headers;
		this.params = config.params;
		this.data = config.data;
		this.lambda = config.lambda || new AWS.Lambda();
		this.functionName = config.functionName;
	}
}

Request.prototype.send = async function () {
	let error, data;
	try {
		data = await this.lambda.invoke({
			"FunctionName": this.functionName,
			"InvocationType": "RequestResponse",
			"Payload": JSON.stringify({
				"body": this.data,
				"path": this.url,
				"httpMethod": this.method.toUpperCase(),
				"queryStringParameters": this.params,
				"headers": this.headers
			})
		}).promise();
	} catch (e) {
		error = e;
	}

	return (new Response(error, data, this.config)).value();
};

module.exports = Request;
