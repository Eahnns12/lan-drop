const preference = require("../services/preference-service");

class Preference {
	constructor(core) {
		this.core = core;
	}

	onchange(callback) {
		preference.emitter.on("change", (key, value) => {
			this.core.log.info("preference-handler: Preference changed:", key, value);
			callback(key, value);
		});
	}

	init(localStorage) {
		try {
			if (!localStorage) return;

			const entries = Object.entries(localStorage);

			for (const [key, value] of entries) {
				if (Reflect.has(preference.proxy, key)) {
					preference.proxy[key] = value;
				}
			}

			return Object.assign({}, preference.proxy);
		} catch (error) {
			this.core.log.error("preference-handler: init: ", error);
		}
	}

	get(key) {
		return preference.proxy[key];
	}

	set(key, value) {
		preference.proxy[key] = value;
	}
}

module.exports = Preference;
