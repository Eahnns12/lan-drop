const multicast = require("../services/multicast-service");

class Multicast {
	constructor(core) {
		this.core = core;
		this.pulseInterval = 30000;
		this.pulseIntervalID = null;
		this.init();
	}

	init() {
		multicast.emitter.on("listening", () => {
			this.core.log.info("multicast-handler: Multicast service is now listening.");
		});

		multicast.emitter.on("close", () => {
			this.core.log.info("multicast-handler: Multicast service closed.");
		});

		multicast.emitter.on("error", (error) => {
			this.core.log.warn("multicast-handler: Multicast service error:", error.message);
		});
	}

	onsend(callback) {
		multicast.emitter.on("send", (message, remoteInfo) => {
			callback(JSON.parse(message), remoteInfo);
			this.core.log.info("multicast-handler: Sent multicast message to:", remoteInfo.address, remoteInfo.port);
		});
	}

	onreceive(callback) {
		multicast.emitter.on("receive", (message, remoteInfo) => {
			callback(JSON.parse(message), remoteInfo);
			this.core.log.info("multicast-handler: Received multicast message from:", remoteInfo.address, remoteInfo.port);
		});
	}

	async start() {
		try {
			const address = this.core.preference.get("multicast-address");
			const port = this.core.preference.get("multicast-port");

			await multicast.bindSocket(address, port);
		} catch (error) {
			this.core.log.error("multicast-handler: start: ", error);
		}
	}

	async stop() {
		try {
			await multicast.closeSocket();
		} catch (error) {
			this.core.log.error("multicast-handler: stop: ", error);
		}
	}

	async send(message, address, port) {
		try {
			const defaultAddress = this.core.preference.get("multicast-address");
			const defaultPort = this.core.preference.get("multicast-port");

			await multicast.sendMessage(address || defaultAddress, port || defaultPort, message);
		} catch (error) {
			this.core.log.error("multicast-handler: send: ", error);
		}
	}

	async join() {
		try {
			const message = this.core.template.multicast.discover.join();
			await this.send(JSON.stringify(message));
		} catch (error) {
			this.core.log.error("multicast-handler: join: ", error);
		}
	}

	async leave() {
		try {
			const message = this.core.template.multicast.discover.leave();
			await this.send(JSON.stringify(message));
		} catch (error) {
			this.core.log.error("multicast-handler: leave: ", error);
		}
	}

	async ping() {
		try {
			const message = this.core.template.multicast.discover.broadcast();
			await this.send(JSON.stringify(message));
		} catch (error) {
			this.core.log.error("multicast-handler: ping: ", error);
		}
	}

	async pulse() {
		try {
			if (this.pulseIntervalID !== null) {
				clearInterval(this.pulseIntervalID);
			}

			this.pulseIntervalID = setInterval(async () => {
				await this.ping();
			}, this.pulseInterval);
		} catch (error) {
			this.core.log.error("multicast-handler: pulse: ", error);
		}
	}

	async request(address, port, payload) {
		try {
			const message = this.core.template.multicast.transfer.request(payload);
			await this.send(JSON.stringify(message), address, port);
		} catch (error) {
			this.core.log.error("multicast-handler: request: ", error);
		}
	}

	async response(address, port, id, action, payload) {
		try {
			const message = this.core.template.multicast.transfer.response(id, action, payload);
			await this.send(JSON.stringify(message), address, port);
		} catch (error) {
			this.core.log.error("multicast-handler: response: ", error);
		}
	}
}

module.exports = Multicast;
