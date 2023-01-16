import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

const config = {
	resolve: {
		alias: {
			$style: path.resolve("src/style/")
		}
	},
	plugins: [sveltekit()],
};

export default config;
