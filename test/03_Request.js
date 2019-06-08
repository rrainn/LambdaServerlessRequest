const {expect} = require("chai");
const Request = require("../lib/Request");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

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
	});
});
