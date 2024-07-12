import React, { useRef } from "react";
import { Background, DeviceSection, Dropzone, FileSection, RequestList, Setting } from "./components";

export const App = () => {
	const settingModalRef = useRef(null);

	return (
		<>
			<Background />

			<div className="flex h-dvh w-dvw flex-col overflow-hidden">
				<Dropzone className="flex flex-1 flex-col overflow-hidden">
					<div className="flex-1 overflow-hidden">
						<FileSection />
					</div>
					<div className="basis-64 overflow-hidden">
						<DeviceSection settingModalRef={settingModalRef} />
					</div>
				</Dropzone>
			</div>

			<RequestList />
			<Setting settingModalRef={settingModalRef} />
		</>
	);
};
