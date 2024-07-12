const { generateHexId } = require("../utils");

class Template {
	constructor(core) {
		this.core = core;
	}

	multicast = {
		discover: {
			join: () => ({
				id: generateHexId(8),
				type: "DISCOVER",
				status: "JOIN",
				hostname: this.core.preference.get("hostname"),
				timestamp: Date.now(),
				timeout: 5000,
				payload: null,
			}),
			broadcast: () => ({
				id: generateHexId(8),
				type: "DISCOVER",
				status: "BROADCAST",
				hostname: this.core.preference.get("hostname"),
				timestamp: Date.now(),
				timeout: 40000,
				payload: null,
			}),
			leave: () => ({
				id: generateHexId(8),
				type: "DISCOVER",
				status: "LEAVE",
				hostname: this.core.preference.get("hostname"),
				timestamp: Date.now(),
				timeout: 5000,
				payload: null,
			}),
		},
		transfer: {
			request: (payload) => ({
				id: generateHexId(8),
				type: "TRANSFER",
				status: "REQUEST",
				hostname: this.core.preference.get("hostname"),
				timestamp: Date.now(),
				timeout: 30000,
				payload,
			}),
			response: (id, action, payload) => ({
				id,
				type: "TRANSFER",
				status: "RESPONSE",
				action,
				hostname: this.core.preference.get("hostname"),
				timestamp: Date.now(),
				timeout: 5000,
				payload,
			}),
		},
	};
}

module.exports = Template;
