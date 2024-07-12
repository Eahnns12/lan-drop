import React, { useContext } from "react";
import { TransferContext } from "../../contexts";

export const DeviceItem = ({
	device,
	isOwner,
	isRequesting = false,
	hasRejected = false,
	hasAccepted = false,
	settingModalRef,
}) => {
	const { selectedFiles, compress } = useContext(TransferContext);

	async function handleRequest(address, port) {
		try {
			if (isOwner || isRequesting || hasRejected || hasAccepted || !selectedFiles.length) {
				return;
			}

			await window.multicast.request(address, port, { files: selectedFiles, compress });
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="flex flex-col items-center justify-center gap-3">
			<button
				data-tip="You"
				className={`btn btn-circle ${isOwner && "tooltip tooltip-right"} ${(isOwner || isRequesting || hasRejected || hasAccepted) && "no-animation"}`}
				onClick={() => (isOwner ? settingModalRef.current.showModal() : handleRequest(device.address, device.port))}
			>
				<div className="avatar placeholder">
					<div
						className={`w-12 rounded-full ring-offset-1 ring-offset-base-100 ${isRequesting && "ring-2 ring-primary"} ${hasRejected && "ring-2 ring-error"} ${hasAccepted && "ring-2 ring-success"}`}
					>
						<span>{device.hostname.at(0)}</span>
					</div>
				</div>
			</button>

			<div className="flex w-16 flex-col">
				<span className="truncate text-center text-xs">{device.hostname}</span>
				{isRequesting ? (
					<span className="text-center text-[10px] text-base-content/50">Waiting</span>
				) : hasAccepted ? (
					<span className="text-center text-[10px] text-success">Accepted</span>
				) : hasRejected ? (
					<span className="text-center text-[10px] text-error">Rejected</span>
				) : (
					<span className="text-center text-[10px]">&nbsp;</span>
				)}
			</div>
		</div>
	);
};
