const EventEmitter = require("node:events");

const emitter = new EventEmitter();

function notify(type, title, message) {
	emitter.emit(type, title, message);
}

module.exports = { emitter, notify };
