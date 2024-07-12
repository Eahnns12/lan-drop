const os = require("node:os");
const { app, ipcMain, BrowserWindow } = require("electron");
const Core = require("./core");
const { getLocalIPAddress } = require("./utils");

const core = new Core({ dev: false });

if (require("electron-squirrel-startup")) {
	app.quit();
}

app.on("ready", async () => {
	await core.multicast.start();
	await core.multicast.pulse();
	await core.transfer.start();
});

app.on("browser-window-created", async () => {
	setTimeout(() => {
		core.multicast.join();
	}, 3000);
});

app.on("window-all-closed", async () => {
	app.quit();
});

app.on("will-quit", async () => {
	await core.multicast.leave();
	await core.multicast.stop();
	await core.transfer.stop();
});

app.whenReady().then(async () => {
	const window = new BrowserWindow({
		width: 380,
		height: 630,
		resizable: false,
		title: "LanDrop",
		autoHideMenuBar: true,
		webPreferences: { preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY },
	});

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	if (core.dev) {
		window.webContents.openDevTools();
	}

	core.preference.onchange((...arg) => !window.isDestroyed() && window.send("preference-onchange", ...arg));

	core.notification.oninfo((...arg) => !window.isDestroyed() && window.send("notification-oninfo", ...arg));
	core.notification.onsuccess((...arg) => !window.isDestroyed() && window.send("notification-onsuccess", ...arg));
	core.notification.onwarning((...arg) => !window.isDestroyed() && window.send("notification-onwarning", ...arg));
	core.notification.onerror((...arg) => !window.isDestroyed() && window.send("notification-onerror", ...arg));

	core.multicast.onsend((...arg) => !window.isDestroyed() && window.send("multicast-onsend", ...arg));
	core.multicast.onreceive((...arg) => !window.isDestroyed() && window.send("multicast-onreceive", ...arg));

	ipcMain.handle("app-address", () => getLocalIPAddress());
	ipcMain.handle("app-homedir", () => os.homedir());

	ipcMain.handle("preference-init", (_, ...arg) => core.preference.init(...arg));
	ipcMain.handle("preference-get", () => core.preference.get());
	ipcMain.handle("preference-set", (_, ...arg) => core.preference.set(...arg));

	ipcMain.handle("multicast-ping", () => core.multicast.ping());
	ipcMain.handle("multicast-request", (_, ...arg) => core.multicast.request(...arg));
	ipcMain.handle("multicast-response", (_, ...arg) => core.multicast.response(...arg));

	ipcMain.handle("transfer-info", () => core.transfer.info());

	ipcMain.handle("sender-send", (_, ...arg) => core.sender.send(...arg));
	ipcMain.handle("sender-ship", (_, ...arg) => core.sender.ship(...arg));
});
