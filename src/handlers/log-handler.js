class Log {
	constructor(core) {
		this.core = core;
	}

	info(...message) {
		if (this.core.dev) {
			console.log(`[INFO][${new Date().toISOString()}] ${message.join(" ")}`);
		}
	}

	warn(...message) {
		if (this.core.dev) {
			console.log(`[WARN][${new Date().toISOString()}] ${message.join(" ")}`);
		}
	}

	error(...message) {
		if (this.core.dev) {
			console.log(`[ERROR][${new Date().toISOString()}] ${message.join(" ")}`);
		}
	}
}

module.exports = Log;
