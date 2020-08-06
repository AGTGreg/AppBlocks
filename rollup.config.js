import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import babel from '@rollup/plugin-babel';
import filesize from 'rollup-plugin-filesize';


export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		output: {
			name: 'AppBlock',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve(),
			commonjs(),
			cleanup(),
			babel({
				exclude: 'node_modules/**'
			})
		]
  },

  // Minified version
  {
    input: 'src/index.js',
    output: {
      name: 'AppBlock',
      file: pkg.minified,
      format: 'iife',
    },
		plugins: [
			resolve(),
			terser(),
			babel({
				exclude: 'node_modules/**'
			}),
			filesize()
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	{
		input: 'src/index.js',
		output: [
			{ file: pkg.main, format: 'cjs', exports: 'default' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			resolve(),
			commonjs(),
			cleanup(),
			babel({
				exclude: 'node_modules/**'
			})
		]
	}
];