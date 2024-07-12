import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../contexts";

export const Setting = ({ settingModalRef }) => {
	const { homedir } = useContext(AppContext);
	const [hostname, setHostname] = useState("");
	const [directory, setDirectory] = useState("");

	async function handleInitPreference() {
		try {
			const result = await window.preference.init(localStorage);
			setHostname(result.hostname);
			setDirectory(result.directory);
		} catch (error) {
			console.error(error);
		}
	}

	function handleHostnameChange(event) {
		const value = event.target.value;
		setHostname(value);
	}

	function handleDirectoryChange(event) {
		const value = event.target.value;
		setDirectory(value);
	}

	function handleChangeConfirm() {
		try {
			window.preference.set("hostname", hostname);
			window.preference.set("directory", directory);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		handleInitPreference();

		window.preference.onchange((key, value) => {
			settingModalRef.current.close();
			localStorage.setItem(key, value);
		});
	}, []);

	return (
		<dialog ref={settingModalRef} className="modal modal-bottom">
			<div className="modal-box">
				<h3 className="select-none text-lg font-bold">Setting</h3>

				<div className="space-y-2 py-4">
					<div className="form-control">
						<div className="label">
							<span className="label-text">Display name</span>
						</div>
						<label className="input input-bordered flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="h-4 w-4 opacity-70"
							>
								<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
							</svg>
							<input type="text" className="grow" value={hostname} onChange={handleHostnameChange} />
						</label>
						<div className="label">
							<span className="label-text-alt text-xs text-base-content/50">at most 60 sec to activate the change</span>
						</div>
					</div>

					<div className="form-control">
						<div className="label">
							<span className="label-text">Default directory</span>
						</div>
						<select className="select select-bordered" value={directory} onChange={handleDirectoryChange}>
							<option value="Downloads">Downloads</option>
							<option value="Desktop">Desktop</option>
							<option value="Documents">Documents</option>
						</select>
						<div className="label">
							<span className="label-text-alt text-xs text-base-content/50">
								{`${homedir}${homedir?.includes("C:") ? "\\" : "/"}${directory}`}
							</span>
						</div>
					</div>

					<button className="btn btn-block" onClick={handleChangeConfirm}>
						Confirm
					</button>
				</div>
			</div>

			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
};
