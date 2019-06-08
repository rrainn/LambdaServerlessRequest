const {expect} = require("chai");
const Response = require("../lib/Response");
const express = require("express");

describe("Response", () => {
	it("Should be a function", () => {
		expect(Response).to.be.a("function");
	});

	it("Should should not fail if nothing passed in", () => {
		expect(() => new Response()).to.not.throw();
	});

	it("Should parse data payload if exists", () => {
		const obj = {"Hello": "World"};
		expect(new Response(null, {
			"Payload": JSON.stringify(obj)
		}).parsedPayload).eql(obj);
	});

	describe("Response.prototype.value", () => {
		it("Should be a function", () => {
			expect(Response.prototype.value).to.be.a("function");
		});

		it("Should throw error if error is thrown from Lambda", () => {
			const error = new Error("Error");
			expect(() => new Response(error).value()).to.throw(error);
		});

		const redirectCodes = [301, 302];
		describe("Redirects", () => {
			const responseText = "Hello World";
			let server;

			beforeEach((done) => {
				const app = express();
				app.get("/", (req, res) => res.send(responseText));
				server = app.listen(3050, () => {
					done();
				});
			});
			redirectCodes.forEach((code) => {
				it(`Should redirect with ${code} status code`, async () => {
					const result = await new Response(null, {"Payload": JSON.stringify({"statusCode": code, "headers": {"location": "http://localhost:3050"}, "body": ""})}).value();
					expect(result.data).to.eql(responseText);
					expect(result.status).to.eql(200);
				});
			});
			afterEach((done) => {
				server.close(() => {
					done();
				});
			});
		});

		const tests = [
			{
				"name": "Should parse JSON correctly",
				"input": {"statusCode": 200, "headers": {}, "body": JSON.stringify({"Hello": "World"})},
				"output": {"status": 200, "headers": {}, "data": {"Hello": "World"}}
			},
			{
				"name": "Should parse text correctly",
				"input": {"statusCode": 200, "headers": {}, "body": "Hello World!"},
				"output": {"status": 200, "headers": {}, "data": "Hello World!"}
			},
			{
				"name": "Should parse stringified text correctly",
				"input": {"statusCode": 200, "body": JSON.stringify("Hello from Lambda!")},
				"output": {"status": 200, "headers": {}, "data": "Hello from Lambda!"}
			},
			{
				"name": "Should work with plain text without object",
				"input": "Hello World!",
				"output": {"status": 200, "headers": {}, "data": "Hello World!"}
			},
			{
				"name": "Should pass through all headers",
				"input": {"statusCode": 200, "headers": {"x-test": "helloworld"}, "body": "Hello World!"},
				"output": {"status": 200, "headers": {"x-test": "helloworld"}, "data": "Hello World!"}
			},
			{
				"name": "Should lowercase all headers keys",
				"input": {"statusCode": 200, "headers": {"x-TEST": "HELLOworld"}, "body": "Hello World!"},
				"output": {"status": 200, "headers": {"x-test": "HELLOworld"}, "data": "Hello World!"}
			},
			{
				"name": "Should decode if isBase64Encoded is true",
				"input": {"statusCode": 200, "isBase64Encoded": true, "body": "SGVsbG8gV29ybGQ="},
				"output": {"status": 200, "headers": {}, "data": "Hello World"}
			},
			{
				"name": "Should throw error for 500 status code",
				"error": true,
				"input": {"statusCode": 500, "headers": {}, "body": "Error!"},
				"output": {"status": 500, "headers": {}, "data": "Error!"}
			}
		];
		tests.forEach((test) => {
			it(test.name, () => {
				if (test.error) {
					let result, error;
					try {
						result = new Response(null, {"Payload": JSON.stringify(test.input)}, {}).value();
					} catch (e) {
						error = e;
					}
					expect(result).to.not.exist;
					expect(error).to.eql(test.output);
				} else {
					expect(new Response(null, {"Payload": JSON.stringify(test.input)}, {}).value()).to.eql(test.output);
				}
			});
		});
	});
});
