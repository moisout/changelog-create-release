import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import fs from 'node:fs';

const { devDependencies } = JSON.parse(
  fs.readFileSync(new URL('package.json', import.meta.url), {
    encoding: 'utf-8',
  })
);
const pkgs = <T>(el: T) => Object.keys(el);

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    globals: { crypto: 'crypto' },
  },
  plugins: [
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    json(),
    esbuild(),
  ],
  external: [...pkgs(devDependencies), 'crypto'],
};
