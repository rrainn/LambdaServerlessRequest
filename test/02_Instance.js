const {expect} = require("chai");
const Instance = require("../lib/Instance");
const nock = require("nock");
const AWS = require("aws-sdk");

describe("Instance", () => {
	it("Should be a function", () => {
		expect(Instance).to.be.a("function");
	});

	it("Should should not fail if nothing passed in", () => {
		expect(() => Instance()).to.not.throw();
	});

	describe("Actions", () => {
		const methods = [
			{"name": "", "method": "get", "paramCount": 1},
			{"name": "request", "method": "get", "paramCount": 1},
			{"name": "get", "method": "get", "paramCount": 2},
			{"name": "post", "method": "post", "paramCount": 3},
			{"name": "put", "method": "put", "paramCount": 3},
			{"name": "patch", "method": "patch", "paramCount": 3},
			{"name": "delete", "method": "delete", "paramCount": 2},
			{"name": "options", "method": "options", "paramCount": 2},
			{"name": "head", "method": "head", "paramCount": 2}
		];

		methods.forEach((method) => {
			describe(method.name || "()", () => {
				function main(obj) {
					let action, instance;

					beforeEach(() => {
						instance = obj ? Instance(obj) : Instance();
						action = method.name ? instance[method.name] : instance;
					});
					it("Should be a function", () => {
						expect(action).to.be.a("function");
					});

					it("Should call Lambda function", async () => {
						let called = false;
						let nockBody = {"path":"/api/books","httpMethod":method.method.toUpperCase(),"headers":{"User-Agent":"lambdaserverlessrequest/1.0.1"}};
						if (method.paramCount === 3) {
							nockBody.body = {};
						}
						nock("https://lambda.us-west-2.amazonaws.com:443", {"encodedQueryParams":true})
							.persist()
							.post(`/2015-03-31/functions/${((obj || {}).functionName || "MyFunction1")}/invocations`, nockBody)
							.reply(() => {
								called = true;
								return [200, JSON.stringify({"statusCode": 200, "headers": {}, "body": "Hello World"})];
							});

						const requestObject = {
							"method": method.method,
							"url": "/api/books",
							"lambda": new AWS.Lambda({"region": "us-west-2"})
						};
						requestObject.functionName = obj ? obj.functionName : "MyFunction1";
						if (method.paramCount === 1) {
							await action(requestObject);
						} else if (method.paramCount === 2) {
							let url = requestObject.url;
							delete requestObject.url;
							await action(url, requestObject);
						}  else if (method.paramCount === 3) {
							let url = requestObject.url;
							delete requestObject.url;
							await action(url, {}, requestObject);
						}
						expect(called).to.be.true;
					});
				}

				main();
				describe("Create Instance", () => {
					main({"functionName": "MyFunction2"});
				});
			});
		});
	});
});
