#!/usr/bin/env node
// Rewrites `cordova.platforms` in package.json to the declared baseline
// (`["android", "ios"]`). The Cordova CLI mutates that array on every
// `cordova platform add|rm`, so the manifest drifts and breaks the project
// invariant asserted by `src/project-config.spec.ts`. Run this after touching
// platforms (or hook it into a husky pre-commit) to keep the manifest in
// sync with the baseline. Local `platforms/` stays gitignored and may hold
// any platforms independently.

const { readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const BASELINE_PLATFORMS = Object.freeze(['android', 'ios']);

const manifestPath = resolve(__dirname, '..', 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const current = manifest.cordova?.platforms ?? [];

const sameAsBaseline =
  current.length === BASELINE_PLATFORMS.length &&
  current.every((platform) => BASELINE_PLATFORMS.includes(platform));
if (sameAsBaseline) {
  process.exit(0);
}

manifest.cordova = {
  ...manifest.cordova,
  platforms: [...BASELINE_PLATFORMS],
};
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');