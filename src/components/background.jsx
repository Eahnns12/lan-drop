import React, { useEffect, useRef, useState } from "react";

export const Background = () => {
	const [spheres] = useState([1, 2, 3, 4, 5, 6, 7]);
	const spheresRef = useRef([]);

	const viewBox = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	};

	useEffect(() => {
		for (const current of spheresRef.current) {
			current.animate(
				[
					{ transform: "rotate(0deg)", transformOrigin: `${viewBox.x / 2}px ${viewBox.y / 2}px` },
					{ transform: "rotate(360deg)", transformOrigin: `${viewBox.x / 2}px ${viewBox.y / 2}px` },
				],
				{ duration: Math.floor(Math.random() * 20000 + 10000), iterations: Infinity }
			);
		}
	}, [spheresRef]);

	return (
		<svg className="fixed -z-10" viewBox={`0 0 ${viewBox.x} ${viewBox.y}`} shapeRendering="geometricPrecision">
			{spheres.map((value, index) => {
				return (
					<circle
						key={index}
						className="fill-none stroke-base-200/80 stroke-[0.5]"
						cx={viewBox.x / 2}
						cy={viewBox.y / 2}
						r={value * 30}
					/>
				);
			})}

			{spheres.map((_, index) => {
				return (
					<circle
						key={index}
						ref={(element) => (spheresRef.current[index] = element)}
						className="fill-neutral/80"
						cx={viewBox.x / 2}
						cy={viewBox.y / 2 + 30 + index * 30}
						r="1"
					></circle>
				);
			})}
		</svg>
	);
};
