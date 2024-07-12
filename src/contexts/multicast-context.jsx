import React, { createContext } from "react";
import { useMulticast } from "../hooks";

export const MulticastContext = createContext();

export const MulticastProvider = ({ children }) => {
	const { sends, receives } = useMulticast();
	const devices = receives.filter(({ type }) => type === "DISCOVER");
	const requsets = sends.filter(({ type, status }) => type === "TRANSFER" && status === "REQUEST");
	const reponses = receives.filter(({ type, status }) => type === "TRANSFER" && status === "RESPONSE");
	const pendings = receives.filter(({ type, status }) => type === "TRANSFER" && status === "REQUEST");

	return (
		<MulticastContext.Provider value={{ devices, requsets, reponses, pendings }}>{children}</MulticastContext.Provider>
	);
};
