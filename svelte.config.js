import adapter from '@sveltejs/adapter-node';
import preprocess from "svelte-preprocess";


/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: { enabled: false },

  },
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};

export default config;
