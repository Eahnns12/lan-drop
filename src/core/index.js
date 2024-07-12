const Preference = require("../handlers/preference-handler");
const Multicast = require("../handlers/multicast-handler");
const Template = require("../handlers/template-handler");
const Receiver = require("../handlers/receiver-handler");
const Transfer = require("../handlers/transfer-handler");
const Sender = require("../handlers/sender-handler");
const Log = require("../handlers/log-handler");
const Notification = require("../handlers/notification-handler");

class Core {
	constructor({ dev = false }) {
		this.dev = dev;
		this.preference = new Preference(this);
		this.preference = new Preference(this);
		this.template = new Template(this);
		this.notification = new Notification(this);
		this.multicast = new Multicast(this);
		this.transfer = new Transfer(this);
		this.receiver = new Receiver(this);
		this.sender = new Sender(this);
		this.log = new Log(this);
	}
}

module.exports = Core;
