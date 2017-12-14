#!/usr/bin/env node

const { run } = require('../dist/build');
run(process.argv).catch(e => console.error(e));
