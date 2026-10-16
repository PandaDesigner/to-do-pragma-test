#!/usr/bin/env node
// Resets `cordova.platforms` in package.json to `[]`.
// `cordova platform add <name>` rewrites that array on every run, which breaks
// the INIT-04 invariant asserted by `src/project-config.spec.ts`. Run this
// after `cordova platform add` (or hook it into a husky pre-commit) to keep
// the manifest aligned with the project invariant while local `platforms/`
// directories stay gitignored and free to hold any platforms.

const { readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const manifestPath = resolve(__dirname, '..', 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const removed = manifest.cordova?.platforms ?? [];
if (removed.length === 0) {
  process.exit(0);
}

manifest.cordova = { ...manifest.cordova, platforms: [] };
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');