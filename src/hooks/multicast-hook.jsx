import React, { useEffect, useState } from "react";

export const useMulticast = () => {
	const [sends, setSends] = useState([]);
	const [receives, setReceives] = useState([]);

	function matchesCompositeKey(a, b) {
		return a.address === b.address && a.type === b.type;
	}

	function handleOnSend(message, remoteInfo) {
		try {
			const data = { ...message, ...remoteInfo };

			switch (data.type) {
				case "DISCOVER":
					if (data.status === "BROADCAST") {
						return setSends((prev) =>
							prev.some((curr) => curr.address === data.address && curr.type === data.type)
								? prev.map((curr) => (curr.address === data.address && curr.type === data.type ? data : curr))
								: [...prev, data]
						);
					}

					if (data.status === "LEAVE") {
						return setSends((prev) => prev.filter((curr) => curr.address !== data.address && curr.type !== data.type));
					}
				case "TRANSFER":
					if (data.status === "REQUEST") {
						return setSends((prev) =>
							prev.some((curr) => curr.address === data.address && curr.type === data.type)
								? prev.map((curr) => (curr.address === data.address && curr.type === data.type ? data : curr))
								: [...prev, data]
						);
					}

					if (data.status === "RESPONSE") {
						setReceives((prev) => prev.filter((curr) => curr.id !== data.id));
					}

				default:
					break;
			}
		} catch (error) {
			console.error(error);
		}
	}

	function handleOnReceive(message, remoteInfo) {
		try {
			const data = { ...message, ...remoteInfo };

			switch (data.type) {
				case "DISCOVER":
					if (data.status === "JOIN") {
						window.multicast.ping();
					}

					if (data.status === "BROADCAST") {
						return setReceives((prev) =>
							prev.some((curr) => matchesCompositeKey(curr, data))
								? prev.map((curr) => (matchesCompositeKey(curr, data) ? data : curr))
								: [...prev, data]
						);
					}

					if (data.status === "LEAVE") {
						return setReceives((prev) => prev.filter((curr) => !matchesCompositeKey(curr, data)));
					}
				case "TRANSFER":
					if (data.status === "REQUEST") {
						return setReceives((prev) =>
							prev.some((curr) => curr.address === data.address && curr.type === data.type)
								? prev.map((curr) => (curr.address === data.address && curr.type === data.type ? data : curr))
								: [...prev, data]
						);
					}

					if (data.status === "RESPONSE") {
						setSends((prev) => prev.filter((curr) => curr.id !== data.id));

						setReceives((prev) =>
							prev.some((curr) => curr.address === data.address && curr.type === data.type)
								? prev.map((curr) => (curr.address === data.address && curr.type === data.type ? data : curr))
								: [...prev, data]
						);

						if (data.action === "ACCEPT") {
							const { files, compress, receiverInfo } = data.payload;

							if (compress) {
								window.sender.send(
									receiverInfo.address,
									receiverInfo.port,
									files.map(({ path }) => path)
								);
							} else {
								window.sender.ship(
									receiverInfo.address,
									receiverInfo.port,
									files.map(({ path }) => path)
								);
							}
						}
					}

				default:
					break;
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		window.multicast.onsend(handleOnSend);
		window.multicast.onreceive(handleOnReceive);

		return () => {
			window.multicast.onsend(null);
			window.multicast.onreceive(null);
		};
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			[setSends, setReceives].forEach((setter) => {
				setter((prev) => prev.filter((curr) => Date.now() - curr.timestamp < curr.timeout));
			});
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return { sends, receives };
};
