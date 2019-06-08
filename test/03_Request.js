const {expect} = require("chai");
const Request = require("../lib/Request");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const nock = require("nock");

describe("Request", () => {
	it("Should be a function", () => {
		expect(Request).to.be.a("function");
	});

	describe("Headers", () => {
		describe("User-Agent", () => {
			it("Should add User-Agent if doesn't already exist", () => {
				const packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json")));
				const request = new Request({});
				expect(request.config.headers).to.eql(request.headers);
				expect(request.headers).to.eql({
					"User-Agent": `LambdaServerlessRequest/${packageJSON.version}`
				});
			});
			it("Should keep existing headers when adding User-Agent", () => {
				const request = new Request({
					"headers": {"Hello": "World"}
				});
				expect(request.config.headers).to.eql(request.headers);
				expect(request.headers.Hello).to.eql("World");
			});
			it("Should keep existing User-Agent header if exists", () => {
				const userAgent = "Hello World";
				const request = new Request({
					"headers": {"User-Agent": userAgent}
				});
				expect(request.config.headers).to.eql(request.headers);
				expect(request.headers).to.eql({
					"User-Agent": userAgent
				});
			});
		});
	});

	describe("Lambda Instance", () => {
		it("Should keep existing Lambda Instance if exists", () => {
			const obj = {"Hello": "World"};
			const request = new Request({
				"lambda": obj
			});
			expect(request.lambda).to.eql(obj);
		});
		it("Should use default Lambda Instance if not passed in", () => {
			const request = new Request({});
			expect(request.lambda).to.be.a("object");
			expect(request.lambda.config).to.eql(new AWS.Lambda().config);
		});
	});

	describe("Request.prototype.send", () => {
		it("Should be a function", () => {
			expect(Request.prototype.send).to.be.a("function");
		});

		it("Should call Lambda function", async () => {
			let called = false;
			nock("https://lambda.us-west-2.amazonaws.com:443", {"encodedQueryParams":true})
				.persist()
				.post("/2015-03-31/functions/MyFunction1/invocations", {"path":"/api/books","httpMethod":"GET","headers":{"User-Agent":"LambdaServerlessRequest/1.0.0"}})
				.reply(() => {
					called = true;
					return [200, JSON.stringify({"statusCode": 200, "headers": {}, "body": "Hello World"})];
				});


			const request = new Request({
				"method": "get",
				"functionName": "MyFunction1",
				"url": "/api/books",
				"lambda": new AWS.Lambda({"region": "us-west-2"})
			});
			await request.send();
			expect(called).to.be.true;
		});

		it("Should throw error for Lambda error", async () => {
			nock("https://lambda.us-west-2.amazonaws.com:443", {"encodedQueryParams":true})
				.persist()
				.post("/2015-03-31/functions/MyFunction1/invocations", {"path":"/api/books","httpMethod":"GET","headers":{"User-Agent":"LambdaServerlessRequest/1.0.0"}})
				.reply(404, {"Message":"Function not found: arn:aws:lambda:us-west-2:123456789012:function:MyFunction1","Type":"User"});

			const request = new Request({
				"method": "get",
				"functionName": "MyFunction1",
				"url": "/api/books",
				"lambda": new AWS.Lambda({"region": "us-west-2"})
			});
			let result, error;
			try {
				result = await request.send();
			} catch (e) {
				error = e;
			}
			expect(result).to.not.exist;
			expect(error).to.exist;
			expect(error).to.be.an("error");
			expect(error.code).to.eql("UnknownError");
			expect(error.statusCode).to.eql(404);
			expect(error.message).to.eql("Function not found: arn:aws:lambda:us-west-2:123456789012:function:MyFunction1");
		});
	});
});
