import React, { useState, useContext } from "react";
import { FileItem, FileIcon } from ".";
import { TransferContext } from "../../contexts";
import { SquaresIcon, ListIcon } from "../../icons";

export const FileList = () => {
	const { files, setFiles, selectedFiles, setSelectedFiles } = useContext(TransferContext);
	const [displayStyle, setDisplayStyle] = useState("SQUARE");

	function handleFileAllSelect(event) {
		const checked = event.target.checked;

		if (checked) {
			setSelectedFiles(() => {
				return files.map(({ name, path, size, type, lastModified }) =>
					Object.assign({}, { name, path, size, type, lastModified })
				);
			});
		} else {
			setSelectedFiles([]);
		}
	}

	function handleRemoveSelectedFile() {
		setSelectedFiles((selectedFiles) => {
			setFiles((files) => {
				return files
					.map((file) => {
						if (!selectedFiles.some((selectedFile) => selectedFile.path === file.path)) {
							return file;
						}
					})
					.filter(Boolean);
			});

			return [];
		});
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<nav className="flex items-center justify-between border-b border-base-300 px-2 py-1 dark:border-base-100">
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						className="checkbox"
						checked={files.length === selectedFiles.length}
						onChange={handleFileAllSelect}
					/>
					{selectedFiles.length ? (
						<p className="text-xs">
							{selectedFiles.length} selected
							<button className="btn btn-link btn-error btn-xs no-underline" onClick={handleRemoveSelectedFile}>
								Remove
							</button>
						</p>
					) : (
						""
					)}
				</div>

				<div className="grid grid-cols-2 gap-1">
					<button
						className={`btn btn-square btn-ghost btn-sm ${displayStyle === "SQUARE" && "btn-active"}`}
						onClick={() => setDisplayStyle("SQUARE")}
					>
						<SquaresIcon size={6} />
					</button>

					<button
						className={`btn btn-square btn-ghost btn-sm ${displayStyle === "LIST" && "btn-active"}`}
						disabled
						onClick={() => setDisplayStyle("LIST")}
					>
						<ListIcon size={6} />
					</button>
				</div>
			</nav>

			<div className="grid flex-1 grid-cols-4 gap-6 overflow-hidden overflow-y-scroll scroll-smooth p-3 pt-4 scrollbar-none">
				{files.map((file, index) => (
					<FileItem key={index} file={file}>
						<FileIcon file={file} />
					</FileItem>
				))}
			</div>
		</div>
	);
};
