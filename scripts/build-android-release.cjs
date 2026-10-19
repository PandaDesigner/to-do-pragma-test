#!/usr/bin/env node
// Reads signing credentials from .env.local and passes them to
// `ionic cordova build android --release --device` as CLI flags, then runs
// `./gradlew :app:assembleRelease`. `build.json` stays in the repo only as
// placeholders; secrets never enter git.

const { spawnSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const projectRoot = resolve(__dirname, '..');
const envFile = resolve(projectRoot, '.env.local');

const REQUIRED_ENV_VARS = [
  'ANDROID_KEYSTORE_PATH',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS_PASSWORD',
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

function ensureReleaseFirebaseConfig() {
  return spawnSync(
    'node',
    ['scripts/ensure-firebase-config.cjs', '--require', '--sync'],
    {
      stdio: 'inherit',
      cwd: projectRoot,
    },
  );
}

function runWebBuild() {
  return spawnSync('npx', ['ng', 'build', '--configuration', 'production'], {
    stdio: 'inherit',
    cwd: projectRoot,
  });
}

function runBundleBuild(env) {
  return spawnSync(
    'npx',
    [
      'ionic',
      'cordova',
      'build',
      'android',
      '--release',
      '--device',
      '--',
      '--',
      `--keystore=${env.ANDROID_KEYSTORE_PATH}`,
      `--alias=${env.ANDROID_KEY_ALIAS}`,
      `--storePassword=${env.ANDROID_KEYSTORE_PASSWORD}`,
      `--password=${env.ANDROID_KEY_ALIAS_PASSWORD}`,
    ],
    { stdio: 'inherit', cwd: projectRoot },
  );
}

function runAssembleRelease() {
  return spawnSync('./gradlew', [':app:assembleRelease'], {
    stdio: 'inherit',
    cwd: resolve(projectRoot, 'platforms/android'),
  });
}

const env = loadEnv(envFile);
const missing = REQUIRED_ENV_VARS.filter((name) => !env[name]);
if (missing.length > 0) {
  console.error(`Missing in ${envFile}: ${missing.join(', ')}`);
  process.exit(1);
}

const firebase = ensureReleaseFirebaseConfig();
if (firebase.status !== 0) {
  process.exit(firebase.status ?? 1);
}

const web = runWebBuild();
if (web.status !== 0) {
  process.exit(web.status ?? 1);
}

const bundle = runBundleBuild(env);
if (bundle.status !== 0) {
  process.exit(bundle.status ?? 1);
}

process.exit(runAssembleRelease().status ?? 1);
