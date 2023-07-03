import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import packageJson from './package.json' assert { type: 'json' };
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const { devDependencies } = packageJson;
const pkgs = <T>(el: T) => Object.keys(el);

export default {
  input: 'src/index.ts',
  output: {
    file: 'index.cjs',
    format: 'cjs',
    globals: { crypto: 'crypto' },
  },
  plugins: [
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    json(),
    esbuild({
      minify: process.env.NODE_ENV === 'production',
    }),
  ],
  external: [...pkgs(devDependencies), 'crypto'],
};
