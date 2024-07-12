import React, { createContext, useEffect, useState } from "react";

export const TransferContext = createContext();

export const TransferProvider = ({ children }) => {
	const [files, setFiles] = useState([]);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [compress, setCompress] = useState(false);
	const [isCompressable, setIsCompressable] = useState(true);

	useEffect(() => {
		const maxCompressSize = 25 * 1024 * 1024;
		const totalSelectedFilesSize = selectedFiles.reduce((acc, curr) => (acc += curr.size), 0);

		if (totalSelectedFilesSize >= maxCompressSize) {
			setIsCompressable(false);
			setCompress(false);
		} else {
			setIsCompressable(true);
		}
	}, [selectedFiles]);

	return (
		<TransferContext.Provider
			value={{ files, setFiles, selectedFiles, setSelectedFiles, compress, setCompress, isCompressable }}
		>
			{children}
		</TransferContext.Provider>
	);
};
