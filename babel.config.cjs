module.exports = {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: "> 0.5%, ie >= 11"
          },
          // For Jest, transpile modules to CommonJS so tests can run under Node
          modules: process.env.JEST_WORKER_ID ? 'auto' : false,
          spec: true,
          // Do not inject core-js imports during tests (usage can insert `import "core-js/..."`)
          // which may cause parse-time ESM import statements to appear unexpectedly.
          useBuiltIns: false,
          forceAllTransforms: true
        }
      ]
    ],
};