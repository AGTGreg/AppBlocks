import pkg from './package.json';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import babel from '@rollup/plugin-babel';


export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		output: {
			name: 'AppBlock',
			file: pkg.browser,
			format: 'umd',
			sourcemap: true
		},
		plugins: [
			commonjs(),
			resolve({browser: true}),
			cleanup(),
			babel({
				exclude: 'node_modules/**',
				babelHelpers: "bundled"
			})
		]
  },

  // Minified version
  {
    input: 'src/index.js',
    output: {
		name: 'AppBlock',
		file: pkg.minified,
		format: 'umd',
		sourcemap: true
    },
		plugins: [
			commonjs(),
			resolve({browser: true}),
			cleanup(),
			babel({
				exclude: 'node_modules/**',
				babelHelpers: "bundled"
			}),
			terser(),
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
				exclude: 'node_modules/**',
				babelHelpers: "bundled"
			})
		]
	}
];