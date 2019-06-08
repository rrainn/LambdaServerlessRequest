const {expect} = require("chai");
const LambdaServerlessRequest = require("../lib");

describe("index", () => {
	it("Should be a function", () => {
		expect(LambdaServerlessRequest).to.be.a("function");
	});

	describe(".create", () => {
		it("Should be a function", () => {
			expect(LambdaServerlessRequest.create).to.be.a("function");
		});
	});
});
