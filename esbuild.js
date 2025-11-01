const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'silent',
    plugins: [
      {
        name: 'build-logger',
        setup(build) {
          build.onStart(() => {
            console.log('[watch] build started');
          });
          
          build.onEnd(result => {
            result.errors.forEach(error => {
              console.error(`ERROR: ${error.text}`);
              if (error.location) {
                console.error(`  ${error.location.file}:${error.location.line}:${error.location.column}`);
              }
            });
            
            result.warnings.forEach(warning => {
              console.warn(`WARNING: ${warning.text}`);
            });
            
            if (result.errors.length === 0) {
              console.log('[watch] build finished');
            }
          });
        }
      }
    ]
  });

  if (watch) {
    console.log('[watch] build started (initial)');
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
