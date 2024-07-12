import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [address, setAddress] = useState(null);
	const [homedir, setHomedir] = useState(null);

	async function handleGetAddress() {
		try {
			const address = await window.app.address();
			setAddress(address);
			const homedir = await window.app.homedir();
			setHomedir(homedir);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		handleGetAddress();
	}, []);

	return <AppContext.Provider value={{ address, homedir }}>{children}</AppContext.Provider>;
};
