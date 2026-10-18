#!/usr/bin/env node
// cordova-ios 8 runs `xcodebuild -exportArchive` whenever `--device` is set.
// That export needs a Team ID and a provisioning profile. A Personal Team
// certificate in the keychain is not that credential, and passing
// CODE_SIGNING_ALLOWED=NO on the same command still tries the export and fails.
//   - Team ID in build.json and a signing identity: `cordova build ios
//     --release --device` (signed IPA).
//   - Anything else: `xcodebuild archive` with signing disabled. Produces
//     App.xcarchive and does not export an IPA.

const { spawnSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { chooseIosBuild } = require('./ios-build-mode.cjs');

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

function readReleaseTeam() {
  const buildJson = resolve(projectRoot, 'build.json');
  if (!existsSync(buildJson)) {
    return '';
  }
  try {
    const parsed = JSON.parse(readFileSync(buildJson, 'utf8'));
    return parsed?.ios?.release?.developmentTeam ?? '';
  } catch {
    return '';
  }
}

function runCordovaBuild() {
  console.log(
    '[build-ios] Team ID and signing identity found — cordova build ios --release --device',
  );
  const cordovaBuild = spawnSync(
    'npx',
    ['--no-install', 'cordova', 'build', 'ios', '--release', '--device'],
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
    '[build-ios] running xcodebuild archive without export. Signed IPA is absent.',
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
      'CODE_SIGN_STYLE=Manual',
      'DEVELOPMENT_TEAM=',
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

const developmentTeam = readReleaseTeam();
const hasIdentity = hasSigningIdentity();
const mode = chooseIosBuild({
  hasSigningIdentity: hasIdentity,
  developmentTeam,
});
if (mode === 'signed-export') {
  runCordovaBuild();
} else {
  if (hasIdentity) {
    console.log(
      '[build-ios] a signing certificate is installed, but build.json has no ios.release.developmentTeam. Signed IPA export is skipped.',
    );
  }
  runXcodebuildArchive();
}
