#!/usr/bin/env node
const { spawn } = require('node:child_process');

const firebase = spawn(
  'node',
  ['scripts/ensure-firebase-config.cjs', '--sync'],
  {
    stdio: 'inherit',
  },
);
firebase.on('exit', (firebaseCode) => {
  if (firebaseCode !== 0) {
    process.exit(firebaseCode ?? 1);
  }
  const build = spawn('npx', ['ng', 'build', '--configuration', 'production'], {
    stdio: 'inherit',
  });
  build.on('exit', (code) => process.exit(code ?? 1));
});
