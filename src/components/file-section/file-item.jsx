import React, { useContext } from "react";
import { TransferContext } from "../../contexts";

export const FileItem = ({ children, file }) => {
	const { selectedFiles, setSelectedFiles } = useContext(TransferContext);
	const isFileExist = selectedFiles.some((curr) => curr.path === file.path);

	function handleFileSelect({ name, path, size, type, lastModified }) {
		setSelectedFiles((prev) => {
			if (prev.some((curr) => curr.path === path)) {
				return prev.filter((curr) => curr.path !== path);
			} else {
				const file = Object.assign({}, { name, path, size, type, lastModified });
				return [...prev, file];
			}
		});
	}

	return (
		<div className="flex w-full flex-col items-center gap-1 justify-self-center">
			<button
				className={`btn btn-square btn-ghost btn-lg ${isFileExist && "btn-active"}`}
				onClick={() => handleFileSelect(file)}
			>
				{children}
			</button>
			<span className="w-full truncate text-center text-xs">{file.name}</span>
		</div>
	);
};
