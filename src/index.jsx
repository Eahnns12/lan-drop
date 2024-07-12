import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app.jsx";
import { AppProvider, MulticastProvider, TransferProvider } from "./contexts";

const root = createRoot(document.getElementById("app"));

root.render(
	<AppProvider>
		<MulticastProvider>
			<TransferProvider>
				<App />
			</TransferProvider>
		</MulticastProvider>
	</AppProvider>
);
