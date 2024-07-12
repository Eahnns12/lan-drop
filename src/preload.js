const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("app", {
	address: () => ipcRenderer.invoke("app-address"),
	homedir: () => ipcRenderer.invoke("app-homedir"),
});

contextBridge.exposeInMainWorld("preference", {
	onchange: (callback) => ipcRenderer.on("preference-onchange", (_, ...args) => callback(...args)),
	init: (...args) => ipcRenderer.invoke("preference-init", ...args),
	get: () => ipcRenderer.invoke("preference-get"),
	set: (...args) => ipcRenderer.invoke("preference-set", ...args),
});

contextBridge.exposeInMainWorld("notification", {
	oninfo: (callback) => ipcRenderer.on("notification-oninfo", (_, ...args) => callback(...args)),
	onsuccess: (callback) => ipcRenderer.on("notification-onsuccess", (_, ...args) => callback(...args)),
	onwarning: (callback) => ipcRenderer.on("notification-onwarning", (_, ...args) => callback(...args)),
	onerror: (callback) => ipcRenderer.on("notification-onerror", (_, ...args) => callback(...args)),
});

contextBridge.exposeInMainWorld("multicast", {
	onsend: (callback) => ipcRenderer.on("multicast-onsend", (_, ...args) => callback(...args)),
	onreceive: (callback) => ipcRenderer.on("multicast-onreceive", (_, ...args) => callback(...args)),
	ping: () => ipcRenderer.invoke("multicast-ping"),
	request: (...args) => ipcRenderer.invoke("multicast-request", ...args),
	response: (...args) => ipcRenderer.invoke("multicast-response", ...args),
});

contextBridge.exposeInMainWorld("transfer", {
	info: () => ipcRenderer.invoke("transfer-info"),
});

contextBridge.exposeInMainWorld("sender", {
	send: (...args) => ipcRenderer.invoke("sender-send", ...args),
	ship: (...args) => ipcRenderer.invoke("sender-ship", ...args),
});
