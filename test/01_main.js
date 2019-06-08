const {expect} = require("chai");
const lambdaserverlessrequest = require("../lib");

describe("index", () => {
	it("Should be a function", () => {
		expect(lambdaserverlessrequest).to.be.a("function");
	});

	describe(".create", () => {
		it("Should be a function", () => {
			expect(lambdaserverlessrequest.create).to.be.a("function");
		});
	});
});
