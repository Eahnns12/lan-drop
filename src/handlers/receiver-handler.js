const receiver = require("../services/receiver-service");

class Receiver {
	constructor(core) {
		this.core = core;
		this.init();
	}

	init() {
		receiver.emitter.on("received", () => {
			this.core.log.info("receiver-handler: File received successfully: ", file);
		});

		receiver.emitter.on("end", () => {
			this.core.log.info("receiver-handler: Receiver connection ended.");
		});

		receiver.emitter.on("close", () => {
			this.core.log.info("receiver-handler: Receiver connection closed.");
		});

		receiver.emitter.on("fail", (error) => {
			this.core.log.warn("receiver-handler: File receive failed: ", error.message);
		});

		receiver.emitter.on("error", (error) => {
			this.core.log.warn("receiver-handler: Receiver error: ", error.message);
		});
	}

	receive(socket) {
		try {
			receiver.createReceiver(socket, this.core.preference.get("directory"));
		} catch (error) {
			this.core.log.error("receiver-handler: receive: ", error);
		}
	}
}

module.exports = Receiver;
