import React from "react";
import { DeviceList } from ".";

export const DeviceSection = ({ settingModalRef }) => {
	return (
		<div className="flex h-full w-full flex-col gap-4 p-4">
			<div className="flex items-center justify-between">
				<div>
					<h5 className="text-base tracking-wide">Devices</h5>
					<p className="text-xs font-light text-base-content/60">Devices currently connected</p>
				</div>
			</div>

			<DeviceList settingModalRef={settingModalRef} />
		</div>
	);
};
