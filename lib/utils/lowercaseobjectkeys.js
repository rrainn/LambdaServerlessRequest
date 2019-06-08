module.exports = (obj) => {
	return Object.keys(obj).reduce((accumulator, key) => {
		accumulator[key.toLowerCase()] = obj[key];
		return accumulator;
	}, {});
};
