/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		fontFamily: {
			sans: ['Ibm Plex Sans', 'sans-serif']
		},
		extend: {
			colors: {
				// Primary indigo
				primary: {
					50: '#9596CC',
					100: '#898AC6',
					200: '#7D7EC0',
					300: '#7173BB',
					400: '#7173BB',
					500: '#6667B5',
					600: '#5A5CB0',
					700: '#5051A6',
					800: '#4A4B99',
					900: '#44458D'
				},
				// Secondary pink
				red: {
					50: '#E99CAB',
					100: '#E691A2',
					200: '#E48699',
					300: '#E17B90',
					400: '#DF7086',
					500: '#DC667D',
					600: '#D8536D',
					700: '#D4405D',
					800: '#CE2F4F',
					900: '#BB2A47'
				},
				blue: {
					50: '#A5D3F7',
					100: '#9ACEF6',
					200: '#90CAF5',
					300: '#86C5F5',
					400: '#7CC0F4',
					500: '#71BAF3',
					600: '#5BB0F1',
					700: '#43A4EF',
					800: '#2C99ED',
					900: '#148EEB'
				}
			}
		}
	}
};
