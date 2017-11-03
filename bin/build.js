#!/usr/bin/env node

const { run } = require('../dist/build');
run().catch(e => console.error(e));
