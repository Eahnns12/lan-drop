const EventEmitter = require("node:events");
const net = require("node:net");

const emitter = new EventEmitter();
const server = net.createServer();

server.on("listening", () => emitter.emit("listening"));

server.on("connection", (socket) => emitter.emit("connection", socket));

server.on("close", () => emitter.emit("close"));

server.on("error", (error) => emitter.emit("error", error));

server.maxConnections = 3000;

function startServer(address) {
	return new Promise((resolve, reject) => {
		try {
			if (!address) {
				throw new Error("Address is required");
			}

			server.listen(0, address, resolve);
		} catch (error) {
			reject(error);
		}
	});
}

function closeServer() {
	return new Promise((resolve, reject) => {
		try {
			if (server.listening) {
				server.close((error) => {
					if (error) {
						return reject(error);
					}

					resolve();
				});
			}
		} catch (error) {
			reject(error);
		}
	});
}

function getServerInfo() {
	return Promise.resolve(server.address());
}

module.exports = { emitter, startServer, closeServer, getServerInfo };
