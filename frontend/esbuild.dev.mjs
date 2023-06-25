import * as esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

const PORT = process.env.PORT ?? 8081;

(async () => {
  const ctx = await esbuild.context({
    entryPoints: ['./src/main.tsx'],
    bundle: true,
    minify: true,
    format: 'cjs',
    sourcemap: true,
    outfile: './dist/main.js',
    plugins: [
      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: 'cwd',
        assets: {
          from: ['./src/static/**/*'],
          to: ['./dist'],
        },
        watch: true,
      }),
    ],
  })

  ctx.serve({
    servedir: './dist',
    port: PORT,
  })

  console.log(`Serving on port ${PORT} and watching for file changes to rebuild.`);

  await ctx.watch()
})();
