const notification = require("../services/notification-service");

class Notification {
	constructor(core) {
		this.core = core;
	}

	oninfo(callback) {
		notification.emitter.on("info", (title, message) => {
			callback(title, message);
		});
	}

	onsuccess(callback) {
		notification.emitter.on("success", (title, message) => {
			callback(title, message);
		});
	}

	onwarning(callback) {
		notification.emitter.on("warning", (title, message) => {
			callback(title, message);
		});
	}

	onerror(callback) {
		notification.emitter.on("error", (title, message) => {
			callback(title, message);
		});
	}

	info(title, message) {
		return notification.notify("info", title, message);
	}

	success(title, message) {
		return notification.notify("success", title, message);
	}

	warning(title, message) {
		return notification.notify("warning", title, message);
	}

	error(title, message) {
		return notification.notify("error", title, message);
	}
}

module.exports = Notification;
