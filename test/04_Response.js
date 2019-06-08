const {expect} = require("chai");
const Response = require("../lib/Response");

describe("Response", () => {
	it("Should be a function", () => {
		expect(Response).to.be.a("function");
	});

	it("Should should not fail if nothing passed in", () => {
		expect(() => new Response()).to.not.throw();
	});

	describe("Response.prototype.value", () => {
		it("Should be a function", () => {
			expect(Response.prototype.value).to.be.a("function");
		});
	});
});
