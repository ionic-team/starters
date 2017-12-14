#!/usr/bin/env node

const { run } = require('../dist/deploy');
run(process.argv).catch(e => console.error(e));
