import React, { useContext, useEffect, useRef } from "react";
import { MulticastContext } from "../contexts";

export const RequestList = () => {
	const { pendings } = useContext(MulticastContext);
	const dialogRef = useRef(null);

	useEffect(() => {
		if (pendings.length) {
			dialogRef.current.showModal();
		} else {
			dialogRef.current.close();
		}
	}, [pendings]);

	return (
		<dialog ref={dialogRef} className="modal">
			<div className="toast toast-center toast-top top-10">
				<div className="stack">
					{pendings.map((pending) => {
						return <Dialog key={pending.id} pending={pending} />;
					})}
				</div>
			</div>
		</dialog>
	);
};

const Dialog = ({ pending }) => {
	const { id, address, port, hostname, timeout, payload } = pending;
	const { files } = payload;

	async function handleTransferAccept() {
		try {
			const receiverInfo = await window.transfer.info();

			await window.multicast.response(address, port, id, "ACCEPT", { ...payload, receiverInfo });
		} catch (error) {
			console.error(error);
		}
	}

	async function handleTransferReject() {
		try {
			await window.multicast.response(address, port, id, "REJECT", null);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="prose card w-80 bg-base-100 shadow-xl">
			<div className="card-body items-center text-center">
				<h5 className="card-title">Request</h5>

				<p className="text-wrap text-start text-sm">
					<span className="font-semibold">{hostname}</span> would like to share {files.length} files.
				</p>

				<div className="card-actions justify-end">
					<button className="btn btn-primary btn-sm" onClick={handleTransferAccept}>
						Accept
					</button>
					<button className="btn btn-ghost btn-sm" onClick={handleTransferReject}>
						Deny
					</button>
				</div>
			</div>
		</div>
	);
};
