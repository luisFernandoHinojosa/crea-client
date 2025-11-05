import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		alias: {
			'$lib': 'src/lib',
		},
		adapter: adapter({
			fallback: 'index.html'
		})
	}
};

export default config;
