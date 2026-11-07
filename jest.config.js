// force timezone to UTC to allow tests to work regardless of local timezone
// generally used by snapshots, but can affect specific tests
process.env.TZ = 'UTC';

const fs = require('fs');
const path = require('path');
const base = require('./.config/jest.config');
const { grafanaESModules, nodeModulesToTransform } = require('./.config/jest/utils');

// @gp-grid packages only export an `import` condition; core is a pnpm sibling of react.
const gpGridReact = fs.realpathSync(path.resolve(__dirname, 'node_modules/@gp-grid/react'));

module.exports = {
  // Jest configuration provided by Grafana scaffolding
  ...base,
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^@gp-grid/react$': path.join(gpGridReact, 'dist/index.js'),
    '^@gp-grid/core$': path.join(gpGridReact, '../core/dist/index.js'),
  },
  transformIgnorePatterns: [nodeModulesToTransform([...grafanaESModules, '@gp-grid'])],
};
