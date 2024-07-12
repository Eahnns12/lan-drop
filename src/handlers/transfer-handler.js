const transfer = require("../services/transfer-service");
const { getLocalIPAddress } = require("../utils");

class Transfer {
	constructor(core) {
		this.core = core;
		this.init();
	}

	init() {
		transfer.emitter.on("listening", () => {
			this.core.log.info("transfer-handler: Transfer server is now listening.");
		});

		transfer.emitter.on("connection", (socket) => {
			this.core.receiver.receive(socket);
			this.core.log.info("transfer-handler: New transfer connection established.");
		});

		transfer.emitter.on("close", () => {
			this.core.log.info("transfer-handler: Transfer server closed.");
		});

		transfer.emitter.on("error", (error) => {
			this.core.log.warn("transfer-handler: Transfer server error: ", error.message);
		});
	}

	async start() {
		try {
			const address = getLocalIPAddress();
			await transfer.startServer(address);
		} catch (error) {
			this.core.log.error("transfer-handler: start: ", error);
		}
	}

	async stop() {
		try {
			await transfer.closeServer();
		} catch (error) {
			this.core.log.error("transfer-handler: stop: ", error);
		}
	}

	async info() {
		try {
			const info = await transfer.getServerInfo();
			return info;
		} catch (error) {
			this.core.log.error("transfer-handler: info: ", error);
		}
	}
}

module.exports = Transfer;
