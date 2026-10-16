#!/usr/bin/env node
const { spawn } = require('node:child_process');

const build = spawn('npx', ['ng', 'build', '--configuration', 'production'], { stdio: 'inherit' });
build.on('exit', (code) => process.exit(code ?? 1));
