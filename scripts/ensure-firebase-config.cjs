#!/usr/bin/env node
const { existsSync, mkdirSync, writeFileSync } = require('node:fs');
const { dirname, join, resolve } = require('node:path');

const CONFIG_RELATIVE = 'src/assets/firebase-config.json';
const EXAMPLE = 'firebase-config.example.json';
const REQUIRED_ENV = [
  'FIREBASE_API_KEY',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MESSAGING_SENDER_ID',
];

function ensureFirebaseConfig({ root, env, require: required = false, log = {} }) {
  const target = join(root, CONFIG_RELATIVE);
  if (existsSync(target)) {
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
  const result = ensureFirebaseConfig({
    root: resolve(__dirname, '..'),
    env: process.env,
    require: process.argv.includes('--require'),
    log: {
      stdout: (line) => console.log(line),
      stderr: (line) => console.error(line),
    },
  });
  process.exit(result.code);
}

module.exports = { ensureFirebaseConfig };
