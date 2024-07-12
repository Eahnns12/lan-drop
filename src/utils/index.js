const os = require("node:os");
const crypto = require("crypto");

function getLocalIPAddress(family = "IPv4") {
	return Object.values(os.networkInterfaces())
		.flat(Infinity)
		.filter((net) => net.family === family)
		.map(({ address }) => address)
		.filter((address) => address !== "127.0.0.1")[0];
}

function generateHexId(length) {
	return crypto.randomBytes(length).toString("hex");
}

module.exports = { getLocalIPAddress, generateHexId };
