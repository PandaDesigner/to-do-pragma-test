#!/usr/bin/env node
// Builds the iOS archive for the `feature/app-base-2` Cordova setup.
//
// cordova-ios 8 always runs `xcodebuild -exportArchive` after the archive
// step when `--device` is passed; that export requires a Team ID and a
// provisioning profile and fails in CI runners without Apple Developer
// credentials (`exportArchive No Team Found in Archive`). It detects whether
// signing identities are present in the keychain:
//   - If yes (developer machine): delegates to `cordova build ios --release
//     --device` so the export step produces a signed `.ipa`.
//   - If no (CI runner): runs `xcodebuild archive` directly, which produces
//     `App.xcarchive` and `App.app` under
//     `platforms/ios/build/Release-iphoneos/` without trying to export.

const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');

const projectRoot = resolve(__dirname, '..');
const platformsIos = resolve(projectRoot, 'platforms', 'ios');
const SIGNING_IDENTITY_HASH = /[A-F0-9]{40}/i;

function hasSigningIdentity() {
  const identityLookup = spawnSync(
    'security',
    ['find-identity', '-v', '-p', 'codesigning'],
    { encoding: 'utf8' },
  );
  if (identityLookup.status !== 0) {
    return false;
  }
  return SIGNING_IDENTITY_HASH.test(identityLookup.stdout || '');
}

function runCordovaBuild() {
  console.log(
    '[build-ios] signing identity detected — using cordova build ios --release --device',
  );
  const firebase = spawnSync(
    'node',
    ['scripts/ensure-firebase-config.cjs', '--require', '--sync'],
    { stdio: 'inherit', cwd: projectRoot },
  );
  if (firebase.status !== 0) {
    process.exit(firebase.status ?? 1);
  }
  const web = spawnSync(
    'npx',
    ['ng', 'build', '--configuration', 'production'],
    { stdio: 'inherit', cwd: projectRoot },
  );
  if (web.status !== 0) {
    process.exit(web.status ?? 1);
  }
  const cordovaBuild = spawnSync(
    'npx',
    [
      '--no-install',
      'cordova',
      'build',
      'ios',
      '--release',
      '--device',
      '--buildFlag=CODE_SIGNING_ALLOWED=NO',
    ],
    { stdio: 'inherit', cwd: projectRoot },
  );
  process.exit(cordovaBuild.status ?? 1);
}

function runXcodebuildArchive() {
  const workspace = resolve(platformsIos, 'App.xcworkspace');
  if (!existsSync(workspace)) {
    console.error('[build-ios] App.xcworkspace not found at', workspace);
    process.exit(1);
  }
  console.log(
    '[build-ios] no signing identity — running xcodebuild archive (no export)',
  );
  const archivePath = resolve(
    platformsIos,
    'build',
    'Release-iphoneos',
    'App.xcarchive',
  );
  const xcodeArchive = spawnSync(
    'xcodebuild',
    [
      '-workspace',
      workspace,
      '-scheme',
      'App',
      '-configuration',
      'Release',
      '-destination',
      'generic/platform=iOS',
      '-archivePath',
      archivePath,
      'archive',
      'CODE_SIGNING_ALLOWED=NO',
      'CODE_SIGNING_REQUIRED=NO',
      'CODE_SIGN_IDENTITY=',
    ],
    { stdio: 'inherit', cwd: platformsIos },
  );
  process.exit(xcodeArchive.status ?? 1);
}

if (!existsSync(platformsIos)) {
  console.error(
    '[build-ios] platforms/ios is missing. Run `npx cordova platform add ios` first.',
  );
  process.exit(1);
}

if (hasSigningIdentity()) {
  runCordovaBuild();
} else {
  runXcodebuildArchive();
}
