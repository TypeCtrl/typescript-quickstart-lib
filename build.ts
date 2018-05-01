import { join } from 'path';

import { copySync } from 'fs-extra';
import { rollup, OutputOptions, RollupFileOptions } from 'rollup';
const sourceMaps = require('rollup-plugin-sourcemaps');

const moduleInputOptions: RollupFileOptions = {
  input: `dist/esm5/public_api.js`,
  plugins: [sourceMaps()],
};
const moduleOutputOptions: OutputOptions = {
  file: './dist/package-dist/bundles/--libraryname--.es2015.js',
  format: 'es',
  sourcemap: true,
};

async function build() {
  // create bundle
  const mod = await rollup(moduleInputOptions);
  await mod.write(moduleOutputOptions);

  // copy git folder to dist folder for semantic-release
  copySync('.git', join(process.cwd(), 'dist/package-dist/.git'));
  // copy files to distribution folder
  copySync('package.json', join(process.cwd(), 'dist/package-dist/package.json'));
  copySync('README.md', join(process.cwd(), 'dist/package-dist/README.md'));
  copySync('LICENSE', join(process.cwd(), 'dist/package-dist/LICENSE'));
}

build()
  .then(() => console.log('build success'))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
