const axios = require("axios");
const utils = require("./utils");

class Response {
	constructor(error, data, config) {
		this.error = error;
		this.data = data;
		this.config = config;

		if (this.data && this.data.Payload) {
			this.parsedPayload = JSON.parse(this.data.Payload);
		}

		if (this.parsedPayload && typeof this.parsedPayload === "string") {
			this.parsedPayload = {
				"statusCode": 200,
				"headers": {},
				"body": this.parsedPayload
			};
		}
	}
}

Response.prototype.value = function () {
	let returnObject = {};

	if (this.parsedPayload && (this.parsedPayload.statusCode === 301 || this.parsedPayload.statusCode === 302)) {
		return axios(this.parsedPayload.headers.location);
	}

	if (this.error) {
		throw this.error;
	} else {
		returnObject.status = this.parsedPayload.statusCode;
		returnObject.headers = utils.lowercaseobjectkeys(this.parsedPayload.headers || {});
		if (this.parsedPayload.isBase64Encoded) {
			this.parsedPayload.body = Buffer.from(this.parsedPayload.body, "base64").toString();
		}
		try {
			returnObject.data = JSON.parse(this.parsedPayload.body);
		} catch (e) {
			returnObject.data = this.parsedPayload.body;
		}
	}

	const validateStatus = this.config.validateStatus || ((status) => status >= 200 && status < 300);
	const validateStatusResult = validateStatus(this.parsedPayload.statusCode);
	if (validateStatusResult) {
		return returnObject;
	} else {
		throw returnObject;
	}
};

module.exports = Response;
