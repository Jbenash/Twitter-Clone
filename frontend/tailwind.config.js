import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui],

	daisyui: {
		themes: [
			"light",
			{
				black: {
					...daisyUIThemes["black"],
					primary: "#1d9bf0", // X Blue
					secondary: "#2f3336", // X Dark Gray / Border
					accent: "#1d9bf0",
					neutral: "#15181c",
					"base-100": "#000000", // Background
				},
			},
		],
	},
};
