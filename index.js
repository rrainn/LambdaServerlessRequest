/* eslint-disable */

const serverlessRequest = require("./lib");
const axios = require("axios");
const AWS = require("aws-sdk");

const request = serverlessRequest.create({
	"lambda": new AWS.Lambda({"region": "us-west-2"})
});

// (async () => {
// 	console.log(await request({
// 		"method": "get",
// 		"functionName": "rrainnAccount1"
// 	}));
//
// 	console.log(await axios({
// 		"method": "get",
// 		"baseURL": "https://rrainnaccount.com"
// 	}));
// })();


(async () => {
	try {
		console.log(await request({
			"method": "get",
			"functionName": "PhoneNumberGetter1",
			"url": "/303862267"
		}));
	} catch (e) {
		console.error(e);
	}

	try {
		console.log(await axios({
			"method": "get",
			"baseURL": "https://phonenumber.rrainn.space",
			"url": "/303862267"
		}));
	} catch (e) {
		console.error(e);
	}
})();

/*eslint-enable*/
