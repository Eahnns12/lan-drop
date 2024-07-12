import React, { useContext } from "react";
import { DeviceItem } from ".";
import { AppContext, MulticastContext } from "../../contexts";

export const DeviceList = ({ settingModalRef }) => {
	const { address } = useContext(AppContext);
	const { devices, requsets, reponses } = useContext(MulticastContext);

	const owner = devices.filter((device) => device.address === address);
	const users = devices.filter((device) => device.address !== address);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{devices.length ? (
				<div className="relative flex-1 overflow-hidden">
					<div className="grid h-full w-full grid-cols-4 gap-1 gap-y-2 overflow-hidden overflow-y-scroll scroll-smooth pb-12 pt-3 scrollbar-none">
						{owner.map((device) => {
							return <DeviceItem key={device.id} device={device} isOwner={true} settingModalRef={settingModalRef} />;
						})}
						{users.map((device) => {
							const isRequesting = requsets.some((curr) => curr.address === device.address);
							const hasAccepted = reponses.some((curr) => curr.address === device.address && curr.action === "ACCEPT");
							const hasRejected = reponses.some((curr) => curr.address === device.address && curr.action === "REJECT");

							return (
								<DeviceItem
									key={device.id}
									device={device}
									isRequesting={isRequesting}
									hasAccepted={hasAccepted}
									hasRejected={hasRejected}
								/>
							);
						})}
					</div>
					<div className="pointer-events-none absolute top-0 flex h-3 w-full bg-base-100 [mask-image:linear-gradient(#000000,transparent)]"></div>
					<div className="pointer-events-none absolute bottom-0 flex h-10 w-full bg-base-100 [mask-image:linear-gradient(transparent,#000000)]"></div>
				</div>
			) : (
				<div className="flex h-full w-full flex-col items-center justify-center">
					<span className="loading loading-dots loading-md"></span>
				</div>
			)}
		</div>
	);
};
