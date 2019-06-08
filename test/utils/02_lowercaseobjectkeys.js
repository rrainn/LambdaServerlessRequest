const {expect} = require("chai");
const utils = require("../../lib/utils");

describe("utils.lowercaseobjectkeys", () => {
	it("Should be a function", () => {
		expect(utils.lowercaseobjectkeys).to.be.a("function");
	});

	const tests = [
		{"input": {"hello": "world"}, "output": {"hello": "world"}},
		{"input": {"Hello": "world"}, "output": {"hello": "world"}},
		{"input": {"HELLO": "world"}, "output": {"hello": "world"}}
	];
	tests.forEach((test) => {
		it(`Should have an output of ${JSON.stringify(test.output)} for ${JSON.stringify(test.input)}`, () => {
			expect(utils.lowercaseobjectkeys(test.input)).to.eql(test.output);
		});
	});
});
