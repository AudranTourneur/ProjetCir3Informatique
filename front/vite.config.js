import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

const config = {
	resolve: {
		alias: {
			$lib: path.resolve("src/lib/"),
			$style: path.resolve("src/style/"),
		}
	},
	plugins: [sveltekit()],
};

export default config;
