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
};
