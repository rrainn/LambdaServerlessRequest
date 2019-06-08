const {expect} = require("chai");
const Instance = require("../lib/Instance");

describe("Instance", () => {
	it("Should be a function", () => {
		expect(Instance).to.be.a("function");
	});

	it("Should should not fail if nothing passed in", () => {
		expect(() => Instance()).to.not.throw();
	});
});
