import React, { useState, useContext } from "react";
import { TransferContext } from "../contexts";

export const Dropzone = ({ children, className }) => {
	const { setFiles } = useContext(TransferContext);
	const [isDraging, setIsDraging] = useState(false);

	function handleDragOver(event) {
		event.preventDefault();
		event.stopPropagation();
	}

	function handleDragIn(event) {
		event.preventDefault();
		event.stopPropagation();

		if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
			setIsDraging(true);
		}
	}

	function handleDragOut(event) {
		event.preventDefault();
		event.stopPropagation();
		setIsDraging(false);
	}

	function handleDrop(event) {
		event.preventDefault();
		event.stopPropagation();
		setIsDraging(false);

		if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			const files = Array.from(event.dataTransfer.files).filter((file) => file.type !== "");

			if (!files.length) {
				return;
			}

			setFiles((prev) => {
				if (prev.length + files.length >= 500) {
					return prev;
				}

				return [...prev, ...files].reduce((acc, curr) => {
					return acc.some(({ path }) => path === curr.path) ? acc : [...acc, curr];
				}, []);
			});

			event.dataTransfer.clearData();
		}
	}

	return (
		<div className={className} onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDragOver}>
			{isDraging ? (
				<div className="flex-1 p-2">
					<div className="h-full w-full rounded-box border-2 border-dashed border-base-300" onDrop={handleDrop}></div>
				</div>
			) : (
				children
			)}
		</div>
	);
};

export default Dropzone;
