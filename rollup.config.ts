import esbuild from 'rollup-plugin-esbuild';
import packageJson from './package.json' assert { type: 'json' };

const { dependencies, devDependencies } = packageJson;
const pkgs = <T>(el: T) => Object.keys(el);

export default {
  input: 'src/index.ts',
  output: {
    file: 'index.js',
    format: 'cjs',
  },
  plugins: [
    esbuild({
      minify: process.env.NODE_ENV === 'production',
    }),
  ],
  external: [...pkgs(dependencies), ...pkgs(devDependencies)],
};
