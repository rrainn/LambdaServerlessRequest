const {expect} = require("chai");
const utils = require("../../lib/utils");

describe("utils", () => {
	it("Should be an object", () => {
		expect(utils).to.be.an("object");
	});
});
