/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			screens: {
				xs: { max: "330px" },
				sm: { min: "450px" },
				"3xl": { min: "3000px" },
			},
		},
	},
	plugins: [],
};
