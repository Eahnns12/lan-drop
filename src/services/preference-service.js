const EventEmitter = require("node:events");
const os = require("node:os");

const emitter = new EventEmitter();

const ALLOW_CHANGE_PREFERENCE = ["hostname", "directory"];

const preferences = {
	"multicast-address": "239.0.0.1",
	"multicast-port": 51234,
	hostname: os.hostname(),
	directory: "Downloads",
};

const proxy = new Proxy(preferences, {
	get: getHandler,
	set: setHandler,
});

function getHandler(target, prop, receiver) {
	return Reflect.get(target, prop, receiver);
}

function setHandler(target, key, value) {
	if (ALLOW_CHANGE_PREFERENCE.includes(key)) {
		target[key] = value;

		emitter.emit("change", key, value);
	}

	return true;
}

module.exports = { emitter, proxy };
