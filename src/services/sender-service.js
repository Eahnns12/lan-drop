const EventEmitter = require("node:events");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");
const { app } = require("electron");
const _ = require("../modules/wasm/go/wasm_exec");

const emitter = new EventEmitter();

const go = new Go();

const wasmBuffer = fs.readFileSync(
	app.isPackaged ? path.join(process.resourcesPath, "main.wasm") : "src/modules/wasm/go/zip/main.wasm"
);

let compress;

WebAssembly.instantiate(wasmBuffer, go.importObject).then((result) => {
	go.run(result.instance);

	compress = global.compress;

	delete global.compress;
});

function connectSocket(host, port) {
	return new Promise((resolve, reject) => {
		try {
			const socket = net.createConnection({ host, port }, () => {
				resolve(socket);
			});

			socket.setTimeout(30000);

			socket.on("timeout", () => emitter.emit("timeout"));

			socket.on("end", () => {
				emitter.emit("end");

				if (socket && !socket.destroyed) {
					socket.destroy();
				}
			});

			socket.on("close", () => emitter.emit("close"));

			socket.on("error", (error) => emitter.emit("error", error));
		} catch (error) {
			reject(error);
		}
	});
}

function sendFileToReceiver(socket, filePath) {
	if (!fs.statSync(filePath).isFile()) {
		throw new Error("Not a valid file");
	}

	const fileSizeBuffer = Buffer.alloc(4);
	const fileNameLengthBuffer = Buffer.alloc(4);
	const fileNameBuffer = Buffer.from(path.basename(filePath));

	fileSizeBuffer.writeUInt32BE(fs.statSync(filePath).size);
	fileNameLengthBuffer.writeUInt32BE(fileNameBuffer.length);

	const header = Buffer.concat([fileSizeBuffer, fileNameLengthBuffer, fileNameBuffer]);

	socket.write(header, (error) => {
		if (error) {
			return emitter.emit("error", error);
		}

		const stream = fs.createReadStream(filePath);

		stream.on("end", () => {
			emitter.emit("sent", path.basename(filePath));
		});

		stream.on("error", (error) => emitter.emit("fail", error));

		stream.pipe(socket);
	});
}

function sendZipToReceiver(socket, filePaths) {
	let totalSize = 0;

	for (const filePath of filePaths) {
		const stat = fs.statSync(filePath);

		if (!stat.isFile()) {
			continue;
		}

		totalSize += stat.size;
	}

	if (totalSize > 50 * 1024 * 1024) {
		throw new Error("Files size too large");
	}

	const files = filePaths.reduce((acc, curr) => {
		acc[path.basename(curr)] = fs.readFileSync(curr);
		return acc;
	}, {});

	const zip = Buffer.from(compress(files));

	const fileSizeBuffer = Buffer.alloc(4);
	const fileNameLengthBuffer = Buffer.alloc(4);
	const fileNameBuffer = Buffer.from("landrop.zip");

	fileSizeBuffer.writeUInt32BE(zip.length);
	fileNameLengthBuffer.writeUInt32BE(fileNameBuffer.length);

	const header = Buffer.concat([fileSizeBuffer, fileNameLengthBuffer, fileNameBuffer]);

	socket.write(header, (error) => {
		if (error) {
			return emitter.emit("error", error);
		}
		socket.write(zip, (error) => {
			if (error) {
				return emitter.emit("error", error);
			}

			emitter.emit("sent", fileNameBuffer.toString("utf-8"));
		});
	});
}

module.exports = { emitter, connectSocket, sendFileToReceiver, sendZipToReceiver };
