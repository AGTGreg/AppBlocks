module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'build-cjs/**/*.js',
    '!build-cjs/**/*.test.js',
    '!build-cjs/**/__mocks__/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/scripts/'
  ],
  moduleFileExtensions: ['js'],
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
  // Transform JS and MJS files with babel-jest so we can consume ESM code and
  // transpile it to CommonJS for the Jest/node runtime.
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest'
  },

  // By default Jest ignores all node_modules from transform. Some dependencies
  // (for example `idiomorph` in this project) ship ESM sources that import
  // `core-js` and other modules. Allow babel-jest to transform `idiomorph`
  // so those ESM imports are transpiled before execution.
  transformIgnorePatterns: [
    '/node_modules/(?!(idiomorph)/)'
  ]
  ,
  // Map the idiomorph package to a small test mock to avoid pulling ESM sources from
  // node_modules (which can require extra transform steps). The mock provides a
  // compatible `morph` function used by AppBlock.idiomorphRender.
  moduleNameMapper: {
    '^idiomorph(/.*)?$': '<rootDir>/tests/__mocks__/idiomorph.js',
    // When running tests, map imports like `src/core.js` to the compiled
    // CommonJS output produced by the `pretest` build step (build-cjs/).
    '^src/(.*)$': '<rootDir>/build-cjs/$1',
    // Allow tests to import fixtures/modules using `tests/...` paths
    '^tests/(.*)$': '<rootDir>/tests/$1'
  }
};
