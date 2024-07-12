const EventEmitter = require("node:events");
const dgram = require("node:dgram");

const emitter = new EventEmitter();
const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

socket.on("listening", () => emitter.emit("listening"));

socket.on("connection", () => emitter.emit("connection"));

socket.on("message", (message, remoteInfo) => emitter.emit("receive", message, remoteInfo));

socket.on("close", () => emitter.emit("close"));

socket.on("error", (error) => emitter.emit("error", error));

function bindSocket(address, port) {
	return new Promise((resolve, reject) => {
		try {
			socket.bind({ port, exclusive: false }, () => {
				casting(address);
				resolve();
			});
		} catch (error) {
			reject(error);
		}
	});
}

function closeSocket() {
	return new Promise((resolve, reject) => {
		try {
			if (!socket) {
				throw new Error("Multicast service is not running");
			}

			socket.close(() => {
				resolve();
			});
		} catch (error) {
			reject(error);
		}
	});
}

function sendMessage(address, port, message) {
	return new Promise((resolve, reject) => {
		try {
			if (!socket) {
				throw new Error("Multicast service is not running");
			}

			if (typeof message !== "string") {
				throw new TypeError("Message must be a string");
			}

			const buffer = Buffer.from(message);

			socket.send(buffer, 0, buffer.length, port, address, (error) => {
				if (error) {
					reject(error);
				} else {
					emitter.emit("send", buffer, { address, port });
					resolve();
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}

function casting(address) {
	socket.addMembership(address);
	socket.setMulticastTTL(128);
}

module.exports = { emitter, bindSocket, sendMessage, closeSocket };
