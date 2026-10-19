#!/usr/bin/env node
const {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} = require('node:fs');
const { dirname, join, resolve } = require('node:path');

const CONFIG_RELATIVE = 'src/assets/firebase-config.json';
const EXAMPLE = 'firebase-config.example.json';
const REQUIRED_ENV = [
  'FIREBASE_API_KEY',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MESSAGING_SENDER_ID',
];

function readEnvFile(root) {
  const file = join(root, '.env.local');
  if (!existsSync(file)) {
    return {};
  }
  return Object.fromEntries(
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .map((line) => {
        const separator = line.indexOf('=');
        return [
          line.slice(0, separator).trim(),
          line.slice(separator + 1).trim(),
        ];
      })
      .filter(([key]) => key),
  );
}

function ensureFirebaseConfig({
  root,
  env,
  require: required = false,
  sync = false,
  log = {},
}) {
  const target = join(root, CONFIG_RELATIVE);
  if (existsSync(target) && !sync) {
    return { code: 0 };
  }
  const missing = REQUIRED_ENV.filter((key) => !env[key]);
  if (missing.length === 0) {
    const config = {
      apiKey: env.FIREBASE_API_KEY,
      projectId: env.FIREBASE_PROJECT_ID,
      appId: env.FIREBASE_APP_ID,
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    };
    if (env.FIREBASE_AUTH_DOMAIN) {
      config.authDomain = env.FIREBASE_AUTH_DOMAIN;
    }
    if (env.FIREBASE_STORAGE_BUCKET) {
      config.storageBucket = env.FIREBASE_STORAGE_BUCKET;
    }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${JSON.stringify(config, null, 2)}\n`);
    return { code: 0 };
  }
  const stderr = log.stderr ?? (() => undefined);
  if (!required) {
    stderr(
      `Aviso: no hay ${CONFIG_RELATIVE}. La app usará los valores por defecto de Remote Config.`,
    );
    return { code: 0 };
  }
  if (missing.length === REQUIRED_ENV.length) {
    stderr(
      `Falta ${CONFIG_RELATIVE}. Copiá src/assets/${EXAMPLE} o definí las variables FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_APP_ID y FIREBASE_MESSAGING_SENDER_ID.`,
    );
    return { code: 1 };
  }
  stderr(`Faltan variables: ${missing.join(', ')}`);
  return { code: 1 };
}

if (require.main === module) {
  const fileEnv = readEnvFile(resolve(__dirname, '..'));
  const result = ensureFirebaseConfig({
    root: resolve(__dirname, '..'),
    env: { ...fileEnv, ...process.env },
    require: process.argv.includes('--require'),
    sync: process.argv.includes('--sync'),
    log: {
      stdout: (line) => console.log(line),
      stderr: (line) => console.error(line),
    },
  });
  process.exit(result.code);
}

module.exports = { ensureFirebaseConfig };
