#!/usr/bin/env node
// Resolves signing credentials from .env.local, substitutes them into
// `build.json`, runs `ng build` and `ionic cordova build android --release
// --device`, then restores the original `build.json`. The committed file
// keeps env-var placeholders so secrets never enter git.

const { spawnSync } = require('node:child_process');
const { readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const projectRoot = resolve(__dirname, '..');
const envFile = resolve(projectRoot, '.env.local');
const buildJsonPath = resolve(projectRoot, 'build.json');

const PLACEHOLDERS = [
  'ANDROID_KEY_ALIAS_PASSWORD',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
];

function loadEnv(filePath) {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  const entries = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const equalsAt = trimmed.indexOf('=');
    if (equalsAt === -1) {
      continue;
    }
    const key = trimmed.slice(0, equalsAt).trim();
    const value = trimmed.slice(equalsAt + 1).trim();
    entries[key] = value;
  }
  return entries;
}

const env = loadEnv(envFile);
const missing = PLACEHOLDERS.filter((name) => !env[name]);
if (missing.length > 0) {
  console.error(`Missing in ${envFile}: ${missing.join(', ')}`);
  process.exit(1);
}

const placeholderPattern = new RegExp(PLACEHOLDERS.join('|'), 'g');
const original = readFileSync(buildJsonPath, 'utf8');
const resolved = original.replace(placeholderPattern, (name) => env[name]);

let exitCode = 0;
try {
  writeFileSync(buildJsonPath, resolved);
  const web = spawnSync('npx', ['ng', 'build', '--configuration', 'production'], {
    stdio: 'inherit',
    cwd: projectRoot,
  });
  if (web.status !== 0) {
    exitCode = web.status ?? 1;
  } else {
    const bundle = spawnSync(
      'npx',
      ['ionic', 'cordova', 'build', 'android', '--release', '--device'],
      { stdio: 'inherit', cwd: projectRoot },
    );
    exitCode = bundle.status ?? 1;
    if (exitCode === 0) {
      const apk = spawnSync(
        './gradlew',
        [':app:assembleRelease'],
        {
          stdio: 'inherit',
          cwd: resolve(projectRoot, 'platforms/android'),
        },
      );
      exitCode = apk.status ?? 1;
    }
  }
} finally {
  writeFileSync(buildJsonPath, original);
}
process.exit(exitCode);