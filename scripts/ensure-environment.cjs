#!/usr/bin/env node
// `src/environments/environment.ts` stays gitignored. CI and a fresh clone
// only have the credential-free example, so copy it when the local file is
// missing. Never overwrite a file that already exists.

const { copyFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

const root = resolve(__dirname, '..');
const target = resolve(root, 'src/environments/environment.ts');
const source = resolve(root, 'src/environments/environment.example.ts');

if (!existsSync(target)) {
  copyFileSync(source, target);
}
