const EventEmitter = require("node:events");
const fs = require("node:fs");
const os = require("node:os");
const path = require("path");

const emitter = new EventEmitter();

function createReceiver(socket, dir) {
	const headerLength = 8;

	let buffer = Buffer.alloc(0);
	let stream = null;
	let fileSize = 0;
	let remainingBytes = 0;

	socket.setTimeout(30000);

	socket.on("timeout", () => {
		emitter.emit("timeout");
		socket.destroy();
	});

	socket.on("data", (data) => {
		if (stream) {
			stream.write(data);

			if (!remainingBytes) {
				stream.end();
				stream = null;
				fileSize = null;
				remainingBytes = 0;
			}
		} else {
			buffer = Buffer.concat([buffer, data]);

			if (buffer.length >= headerLength) {
				fileSize = buffer.readUint32BE(0);
				const fileNameLength = buffer.readUint32BE(4);

				if (buffer.length >= headerLength + fileNameLength) {
					const fileNameBuffer = buffer.subarray(8, 8 + fileNameLength);
					const fileContentBuffer = buffer.subarray(8 + fileNameLength);

					let fileName = fileNameBuffer.toString("utf-8");
					let filePath = path.join(os.homedir(), dir, fileName);

					remainingBytes = fileSize - fileContentBuffer.length;

					buffer = Buffer.alloc(0);

					if (fs.existsSync(filePath)) {
						const [name, ext] = fileName.split(".");
						const time = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];

						fileName = `${name}_${time}.${ext}`;
						filePath = path.join(os.homedir(), dir, fileName);
					}

					stream = fs.createWriteStream(filePath);

					stream.on("error", (error) => {
						emitter.emit("fail", error);
						stream.destroy();
						socket.destroy();
					});

					stream.write(fileContentBuffer);
				}
			}
		}
	});

	socket.on("error", (error) => emitter.emit("error", error));

	socket.on("end", () => emitter.emit("end"));

	socket.on("close", () => emitter.emit("close"));
}

module.exports = { emitter, createReceiver };
