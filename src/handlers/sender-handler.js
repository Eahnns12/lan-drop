const sender = require("../services/sender-service");

class Sender {
	constructor(core) {
		this.core = core;
		this.init();
	}

	init() {
		sender.emitter.on("timeout", () => {
			this.core.log.warn("sender-handler: Sender connection timed out.");
		});

		sender.emitter.on("end", () => {
			this.core.log.info("sender-handler: Sender connection ended.");
		});

		sender.emitter.on("close", () => {
			this.core.log.info("sender-handler: Sender connection closed.");
		});

		sender.emitter.on("sent", (file) => {
			this.core.log.info("sender-handler: File sent successfully: ", file);
		});

		sender.emitter.on("fail", (error) => {
			this.core.log.warn("sender-handler: File send failed: ", error.message);
		});

		sender.emitter.on("error", (error) => {
			this.core.log.warn("sender-handler: Sender error: ", error.message);
		});
	}

	async send(address, port, paths) {
		try {
			const socket = await sender.connectSocket(address, port);
			sender.sendZipToReceiver(socket, paths);
			socket.end();
		} catch (error) {
			this.core.log.error("sender-handler: send: ", error);
		}
	}

	async ship(address, port, paths) {
		await Promise.allSettled(
			paths.map(async (path) => {
				try {
					const socket = await sender.connectSocket(address, port);
					sender.sendFileToReceiver(socket, path);
					socket.end();
				} catch (error) {
					this.core.log.error("sender-handler: ship: ", error);
				}
			})
		);
	}
}

module.exports = Sender;
