/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			screens: {
				sm: { max: "320px" },
				"3xl": { min: "3000px" },
			},
		},
	},
	plugins: [],
};
