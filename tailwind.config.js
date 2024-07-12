/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,html}"],
	theme: {
		extend: {},
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities({ ".title-drag": { "-webkit-app-region": "drag" } });
			addUtilities({ ".title-drag-none": { "-webkit-app-region": "no-drag" } });
			addUtilities({
				".scrollbar-none": {
					"&::-webkit-scrollbar": { display: "none" },
					"-ms-overflow-style": "none",
					"scrollbar-width": "none",
				},
			});
		},
		require("@tailwindcss/typography"),
		require("daisyui"),
	],
	daisyui: { themes: false },
};
