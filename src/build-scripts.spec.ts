import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(__dirname, '..');

function read(relativePath: string): string {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

describe('release build scripts', () => {
  it('[ENV-01.5] release scripts build the web bundle with --configuration production', () => {
    const manifest = JSON.parse(read('package.json')) as {
      scripts: Record<string, string>;
    };
    expect(manifest.scripts['build:android:release']).toContain(
      'ng build --configuration production',
    );
    expect(read('scripts/ionic-build.cjs')).toContain(
      "'--configuration', 'production'",
    );
    expect(read('scripts/build-android-release.cjs')).toContain(
      "'--configuration', 'production'",
    );
  });

  it('[FBCFG-01.6] release scripts require firebase config before the production build', () => {
    const release = read('package.json');
    const android = read('scripts/build-android-release.cjs');
    const ios = read('scripts/build-ios-archive.cjs');
    const workflow = read('.github/workflows/verify.yml');
    expect(release).toMatch(
      /ensure-firebase-config\.cjs --require && ng build --configuration production/,
    );
    const androidRequire = android.indexOf('ensure-firebase-config.cjs');
    const androidBuild = android.indexOf("'--configuration', 'production'");
    expect(androidRequire).toBeGreaterThan(-1);
    expect(androidRequire).toBeLessThan(androidBuild);
    expect(android).toContain('--require');
    const signing = ios.slice(ios.indexOf('function runCordovaBuild'));
    expect(signing).toContain('ensure-firebase-config.cjs');
    expect(signing).toContain('--require');
    expect(signing.indexOf('--require')).toBeLessThan(
      signing.indexOf("'--configuration', 'production'"),
    );
    expect(workflow).toContain('node scripts/ensure-firebase-config.cjs');
    expect(workflow).not.toContain('ensure-firebase-config.cjs --require');
  });
});

describe('ensureFirebaseConfig', () => {
  const sentinel = 'SENTINEL-FIREBASE-VALUE-DO-NOT-PRINT';

  function load() {
    return require('../scripts/ensure-firebase-config.cjs') as {
      ensureFirebaseConfig: (input: {
        root: string;
        env: Record<string, string | undefined>;
        require?: boolean;
        log?: {
          stdout?: (line: string) => void;
          stderr?: (line: string) => void;
        };
      }) => { code: number };
    };
  }

  function sandbox(): string {
    return mkdtempSync(join(tmpdir(), 'firebase-config-'));
  }

  function output() {
    const stdout: string[] = [];
    const stderr: string[] = [];
    return {
      stdout,
      stderr,
      log: {
        stdout: (line: string) => stdout.push(line),
        stderr: (line: string) => stderr.push(line),
      },
    };
  }

  it('[FBCFG-01.1] --require fails with a clear message when firebase-config.json is missing', () => {
    const logs = output();
    const result = load().ensureFirebaseConfig({
      root: sandbox(),
      env: {},
      require: true,
      log: logs.log,
    });
    const message = [...logs.stdout, ...logs.stderr].join('\n');
    expect(result.code).toBe(1);
    expect(message).toContain('src/assets/firebase-config.json');
    expect(message).toContain('firebase-config.example.json');
    expect(message).toContain('FIREBASE_');
  });

  it('[FBCFG-01.2] generates firebase-config.json from FIREBASE_* variables', () => {
    const directory = sandbox();
    const logs = output();
    const result = load().ensureFirebaseConfig({
      root: directory,
      env: {
        FIREBASE_API_KEY: 'test-api-key',
        FIREBASE_PROJECT_ID: 'test-project',
        FIREBASE_APP_ID: 'test-app',
        FIREBASE_MESSAGING_SENDER_ID: 'test-sender',
      },
      require: true,
      log: logs.log,
    });
    const written = JSON.parse(
      readFileSync(join(directory, 'src/assets/firebase-config.json'), 'utf8'),
    ) as Record<string, string>;
    expect(result.code).toBe(0);
    expect(written).toMatchObject({
      apiKey: 'test-api-key',
      projectId: 'test-project',
      appId: 'test-app',
      messagingSenderId: 'test-sender',
    });
  });

  it('[FBCFG-01.3] never overwrites an existing firebase-config.json', () => {
    const directory = sandbox();
    const target = join(directory, 'src/assets/firebase-config.json');
    mkdirSync(join(directory, 'src/assets'), { recursive: true });
    writeFileSync(target, '{"apiKey":"keep-me"}');
    const result = load().ensureFirebaseConfig({
      root: directory,
      env: {
        FIREBASE_API_KEY: 'other-key',
        FIREBASE_PROJECT_ID: 'other-project',
        FIREBASE_APP_ID: 'other-app',
        FIREBASE_MESSAGING_SENDER_ID: 'other-sender',
      },
      require: true,
    });
    expect(result.code).toBe(0);
    expect(readFileSync(target, 'utf8')).toBe('{"apiKey":"keep-me"}');
  });

  it('[FBCFG-01.4] warns and succeeds without --require', () => {
    const logs = output();
    const result = load().ensureFirebaseConfig({
      root: sandbox(),
      env: {},
      log: logs.log,
    });
    const message = [...logs.stdout, ...logs.stderr].join('\n');
    expect(result.code).toBe(0);
    expect(message.toLowerCase()).toContain('valores por defecto');
  });

  it('[FBCFG-01.5] never prints configuration values', () => {
    const directory = sandbox();
    const logs = output();
    load().ensureFirebaseConfig({
      root: directory,
      env: {
        FIREBASE_API_KEY: sentinel,
        FIREBASE_PROJECT_ID: sentinel,
        FIREBASE_APP_ID: sentinel,
        FIREBASE_MESSAGING_SENDER_ID: sentinel,
        FIREBASE_AUTH_DOMAIN: sentinel,
        FIREBASE_STORAGE_BUCKET: sentinel,
      },
      require: true,
      log: logs.log,
    });
    const missing = output();
    load().ensureFirebaseConfig({
      root: sandbox(),
      env: { FIREBASE_API_KEY: sentinel },
      require: true,
      log: missing.log,
    });
    const printed = [
      ...logs.stdout,
      ...logs.stderr,
      ...missing.stdout,
      ...missing.stderr,
    ].join('\n');
    expect(printed).not.toContain(sentinel);
  });

  it('[FBCFG-01.7] incomplete variables fail naming only the missing keys', () => {
    const logs = output();
    const result = load().ensureFirebaseConfig({
      root: sandbox(),
      env: { FIREBASE_API_KEY: sentinel },
      require: true,
      log: logs.log,
    });
    const message = [...logs.stdout, ...logs.stderr].join('\n');
    expect(result.code).toBe(1);
    expect(message).toContain('FIREBASE_PROJECT_ID');
    expect(message).toContain('FIREBASE_APP_ID');
    expect(message).toContain('FIREBASE_MESSAGING_SENDER_ID');
    expect(message).not.toContain(sentinel);
  });
});
