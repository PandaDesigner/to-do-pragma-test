const { createCjsPreset } = require('jest-preset-angular/presets');

module.exports = {
  ...createCjsPreset(),
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  // Ionicons exposes this component only under the import condition.
  moduleNameMapper: {
    '^ionicons/components/ion-icon\\.js$':
      '<rootDir>/node_modules/ionicons/components/ion-icon.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@angular/common/locales/.*\\.js$|@ionic/|@stencil/|ionicons/))',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
    './src/app/domain/': {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95,
    },
    './src/app/data/': {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
    './src/app/store/': {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
};
