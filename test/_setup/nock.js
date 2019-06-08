const nock = require("nock");

beforeEach(() => {
	if (!nock.isActive()) {
		nock.activate();
	}
});
afterEach(() => {
	nock.cleanAll();
	nock.restore();
});
