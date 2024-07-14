import React, { useContext } from "react";
import { FileList } from ".";
import { TransferContext } from "../../contexts";
import { PlusIcon, CubeIcon } from "../../icons";

export const FileSection = () => {
	const { files, setFiles, compress, setCompress, isCompressable } = useContext(TransferContext);

	function handleFileInput(event) {
		const files = event.target.files;

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
	}

	function handlehandleFilesCompress(event) {
		const checked = event.target.checked;
		setCompress(checked);
	}

	return (
		<div className="flex h-full w-full flex-col gap-4 p-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h5 className="text-base tracking-wide">Files</h5>
					<p className="text-xs font-light text-base-content/60">Choose files to share</p>
				</div>
				<div>
					<label className="btn btn-square btn-neutral btn-sm">
						<PlusIcon />
						<input
							type="file"
							multiple
							className="hidden"
							onChange={handleFileInput}
							onClick={(event) => (event.target.value = null)}
						/>
					</label>
				</div>
			</div>
			{/* Header */}

			{/* FileList */}
			<div className="flex-1 overflow-hidden">
				<div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-base-300 bg-base-200/80">
					{files.length ? (
						<FileList />
					) : (
						<div className="m-auto flex flex-col items-center gap-3">
							<CubeIcon size={12} />
							<div className="space-y-1">
								<p className="w-52 text-center text-sm font-light">
									Drag and <span className="font-bold text-primary">Drop</span> your files here
								</p>
								<p className="text-center text-xs font-light">Max 500 files are allowed</p>
							</div>
						</div>
					)}
				</div>
			</div>
			{/* FileList */}

			{/* Setting */}
			<label className="flex flex-col gap-2 rounded-lg border border-base-300 bg-base-100/80 p-4 py-3">
				<div className="flex items-center justify-between">
					<div>
						<h6 className="text-sm tracking-wide">Compress files</h6>
						<p className="text-xs font-light text-base-content/60">Recommended for small size files (25 MB)</p>
					</div>
					<input
						type="checkbox"
						className="toggle toggle-sm"
						disabled={!isCompressable}
						checked={compress}
						onChange={handlehandleFilesCompress}
					/>
				</div>
			</label>
			{/* Setting */}
		</div>
	);
};
